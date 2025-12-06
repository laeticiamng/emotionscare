# 🎵 EC-MUSIC-PARCOURS-XL - Runbook Opérationnel

## Vue d'ensemble

Système de parcours musicaux thérapeutiques 18-24 minutes, génération Suno via callbacks, stockage Supabase, lecture progressive (preview < 40s, final < 3min).

---

## Architecture

```
User → parcours-xl-create → DB (run + segments)
     ↓
parcours-xl-runner → parcours-xl-generate (séquentiel)
     ↓
Suno API → parcours-xl-callback (first → preview_url, complete → storage_path)
     ↓
sign-track (sécurisé) → URL signée 1h
     ↓
Player UI (crossfade preview → final)
```

---

## Edge Functions

### 1. **parcours-xl-create**
- **Rôle**: Créer run + segments via OpenAI Structured Outputs
- **Auth**: JWT requis (user)
- **Secrets**: `OPENAI_API_KEY`, `SUPABASE_ANON_KEY`
- **Timeout**: ~15s (génération brief)
- **Sortie**: `runId`, `brief`, `segmentsCount`

### 2. **parcours-xl-generate**
- **Rôle**: Lancer génération Suno pour 1 segment
- **Auth**: Public (no JWT, appelé par runner)
- **Secrets**: `SUNO_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- **Quota Suno**: 20 req / 10s
- **Callback**: `CALLBACK_BASE?segment=<id>&token=<uuid>`

### 3. **parcours-xl-callback**
- **Rôle**: Recevoir callbacks Suno (first/complete/error)
- **Auth**: Public (token anti-rejeu)
- **Idempotence**: vérifie ordre états (queued→generating→first→complete→failed)
- **Storage**: upload MP3 → `runs/<runId>/<segmentId>.mp3`
- **Timeout Suno**: < 15s requis

### 4. **sign-track**
- **Rôle**: Générer URL signée 1h (sécurisé)
- **Auth**: JWT requis (vérifie user = propriétaire run)
- **Secrets**: `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- **Sortie**: `{ url: "signed_url_1h" }`

### 5. **parcours-xl-runner**
- **Rôle**: Orchestrer génération séquentielle de tous segments
- **Auth**: Public (ou service_role selon usage)
- **Retry**: 3× sur 429/5xx avec backoff 2s/4s/6s
- **Poll**: 2.5s jusqu'à `status=complete` (timeout 5min/segment)

---

## Base de données

### Tables principales

#### `parcours_runs`
```sql
id UUID PRIMARY KEY
user_id UUID NOT NULL
preset_key TEXT NOT NULL
status TEXT CHECK (status IN ('creating', 'ready', 'failed'))
brief TEXT
suds_start/mid/end INTEGER CHECK (BETWEEN 0 AND 10)
metadata JSONB
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ (trigger auto)
```

**Index**:
- `idx_runs_user` (user_id)
- `idx_runs_status` (status)

#### `parcours_segments`
```sql
id UUID PRIMARY KEY
run_id UUID REFERENCES parcours_runs
segment_index INTEGER
prompt TEXT
status TEXT CHECK (status IN ('queued', 'generating', 'first', 'complete', 'failed'))
preview_url TEXT (stream Suno, ~40s)
final_url TEXT (deprecated, peut expirer)
storage_path TEXT (ex: runs/<runId>/<segId>.mp3)
duration_seconds INTEGER
callback_token UUID DEFAULT gen_random_uuid()
metadata JSONB
created_at TIMESTAMPTZ
```

**Index**:
- `u_segments_run_idx` UNIQUE (run_id, segment_index)
- `idx_segments_status` (status)

### Storage

**Bucket**: `parcours-tracks` (private)
- **Chemin**: `runs/<runId>/<segmentId>.mp3`
- **Limite**: 50MB/fichier
- **MIME**: audio/mpeg, audio/mp3, audio/wav

**RLS Policies**:
```sql
-- Lecture via sign-track (service_role vérifie ownership)
"Service role can manage all tracks"
  ON storage.objects FOR ALL
  USING (bucket_id = 'parcours-tracks' AND auth.role() = 'service_role')
```

---

## Flux nominal

### 1. Création (user → create)
```typescript
const { data } = await supabase.functions.invoke('parcours-xl-create', {
  body: { presetKey: 'panique-anxiete', emotionState: 'fear-0.8' }
});
// → data.runId
```

### 2. Génération séquentielle (runner)
```typescript
await supabase.functions.invoke('parcours-xl-runner', {
  body: { runId }
});
```

**Séquence**:
- Runner lit segments (status != 'complete')
- Pour chaque: invoke `parcours-xl-generate` avec retry 429/5xx
- Poll DB status → 'complete' (timeout 5min)
- Continue au suivant

### 3. Callbacks Suno (async)

#### First (~30-40s)
```json
POST /parcours-xl-callback?segment=<id>&token=<tok>
{
  "stage": "first",
  "streamUrl": "https://suno.com/preview.mp3"
}
```
→ DB: `status='first'`, `preview_url=streamUrl`  
→ UI: démarre lecture preview

#### Complete (~2-3min)
```json
POST /parcours-xl-callback?segment=<id>&token=<tok>
{
  "stage": "complete",
  "downloadUrl": "https://suno.com/final.mp3",
  "duration": 125
}
```
→ Upload Storage → `storage_path`  
→ DB: `status='complete'`, `storage_path='runs/.../seg.mp3'`  
→ UI: switch preview → final (crossfade)

### 4. Lecture (UI)

**Player logic**:
1. Priorité: `storage_path` → `sign-track` → URL signée 1h
2. Fallback: `final_url` (deprecated, peut expirer)
3. Fallback: `preview_url` (stream)

**Crossfade** (150-200ms):
- Fade out volume actuel
- Remplace `audio.src`
- Fade in nouveau volume

---

## Métriques clés

### Latences cibles
- **TTFP** (Time To First Preview): < 40s
- **TTFC** (Time To Final Complete): < 3min
- **Run ready** (tous segments): < 24min (4 seg × 6min max)

### Suivi
```sql
-- Latence moyenne first
SELECT AVG(
  EXTRACT(EPOCH FROM (metadata->>'first_received_at')::timestamptz - created_at)
) as avg_first_latency_seconds
FROM parcours_segments
WHERE status IN ('first', 'complete');

-- Taux d'erreurs
SELECT 
  status,
  COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () as percent
FROM parcours_segments
GROUP BY status;

-- Runs par utilisateur (top abuse)
SELECT user_id, COUNT(*) as run_count
FROM parcours_runs
WHERE created_at > now() - interval '7 days'
GROUP BY user_id
ORDER BY run_count DESC
LIMIT 10;
```

---

## Troubleshooting

### ❌ Segments bloqués en 'generating'

**Symptôme**: Pas de callback Suno reçu après 5min

**Causes**:
1. CALLBACK_BASE invalide (localhost, 404, non HTTPS)
2. Token anti-rejeu incorrect
3. Suno rate-limit (429) ou down (5xx)

**Actions**:
```sql
-- Vérifier segments bloqués
SELECT id, run_id, created_at, status, suno_task_id, metadata
FROM parcours_segments
WHERE status = 'generating'
  AND created_at < now() - interval '5 minutes';

-- Retry manuel (si Suno task_id existe)
-- → recréer segment avec nouveau callback_token
```

### ❌ "Failed to sign URL" (sign-track)

**Causes**:
1. `storage_path` NULL (upload failed)
2. User != propriétaire run (403)
3. Fichier supprimé de Storage

**Actions**:
```sql
-- Vérifier storage_path
SELECT id, storage_path, final_url, preview_url
FROM parcours_segments
WHERE id = '<segment_id>';

-- Fallback: remettre final_url si encore valide
UPDATE parcours_segments
SET final_url = metadata->>'suno_download_url'
WHERE id = '<segment_id>' AND storage_path IS NULL;
```

### ❌ Runner timeout (> 30min)

**Causes**:
1. Un segment en retry infini (429 persistant)
2. Suno API down
3. Callback jamais reçu

**Actions**:
```bash
# Logs runner
curl "https://<project>.supabase.co/functions/v1/parcours-xl-runner/logs"

# Relancer runner (idempotent)
curl -X POST "https://<project>.supabase.co/functions/v1/parcours-xl-runner" \
  -H "Content-Type: application/json" \
  -d '{"runId": "<run_id>"}'
```

---

## Tests prod

### Smoke test complet
```bash
# 1. Créer run
RUN_ID=$(curl -X POST "https://<project>.supabase.co/functions/v1/parcours-xl-create" \
  -H "Authorization: Bearer $USER_JWT" \
  -H "Content-Type: application/json" \
  -d '{"presetKey": "universel-reset"}' | jq -r .runId)

# 2. Lancer runner
curl -X POST "https://<project>.supabase.co/functions/v1/parcours-xl-runner" \
  -H "Content-Type: application/json" \
  -d "{\"runId\": \"$RUN_ID\"}"

# 3. Poll status
watch -n 5 "psql -c \"SELECT status FROM parcours_runs WHERE id='$RUN_ID'\""

# 4. Tester sign-track
SEG_ID=$(psql -t -c "SELECT id FROM parcours_segments WHERE run_id='$RUN_ID' LIMIT 1")
curl -X POST "https://<project>.supabase.co/functions/v1/sign-track" \
  -H "Authorization: Bearer $USER_JWT" \
  -H "Content-Type: application/json" \
  -d "{\"segmentId\": \"$SEG_ID\"}"
```

---

## Rollout canary

### Phase 1: 5% users
```sql
-- Feature flag (à créer)
CREATE TABLE feature_flags (
  user_id UUID PRIMARY KEY,
  parcours_xl_enabled BOOLEAN DEFAULT false
);

-- Activer 5%
INSERT INTO feature_flags (user_id, parcours_xl_enabled)
SELECT id, (RANDOM() < 0.05)
FROM auth.users
WHERE created_at < now() - interval '30 days';
```

### Phase 2: Monitoring
- TTFP < 45s pour 95% → OK
- Taux d'erreurs < 5% → OK
- Pas de plaintes callbacks/timeout → OK

### Phase 3: 100%
- Supprimer feature flag ou passer à true pour tous

---

## Secrets requis

```bash
# Dans Supabase Dashboard → Settings → Functions
SUPABASE_URL              # Auto
SUPABASE_ANON_KEY         # Pour sign-track auth
SUPABASE_SERVICE_ROLE_KEY # Auto
OPENAI_API_KEY            # GPT-4o-mini (brief)
SUNO_API_KEY              # Génération audio
CALLBACK_BASE             # https://<project>.supabase.co/functions/v1/parcours-xl-callback
```

---

## Contacts & escalades

**Alerts**:
- Taux d'erreurs > 10% : investigate logs callback/generate
- TTFC > 5min pour > 20% : vérifier Suno API status
- Runner timeout > 50% : backoff insuffisant ou quota dépassé

**Suno API**:
- Dashboard: https://api.sunoapi.org/dashboard
- Quota: 20 req/10s, surveiller 429 dans logs
- Support: api-support@suno.com (si down prolongé)

---

## Changelog

- **2025-10-06**: Prod-ready (storage_path, sign-track sécurisé, runner retry, crossfade)
- **2025-10-05**: MVP callback first/complete
- **2025-10-04**: Init EC-MUSIC-PARCOURS-XL

---

**Dernière révision**: 2025-10-06  
**Mainteneur**: Laëticia (EmotionsCare)
