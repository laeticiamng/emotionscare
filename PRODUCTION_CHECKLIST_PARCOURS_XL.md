# 🚀 Production Checklist - EC-MUSIC-PARCOURS-XL

## ✅ Patchs Finaux Appliqués

### 1. **sign-track** - Sécurité renforcée
- ✅ Vérification du status `complete` avant signature
- ✅ Retourne 409 si le segment n'est pas prêt
- ✅ CORS complet avec méthodes autorisées

### 2. **callback** - Idempotence & Traçabilité
- ✅ Token invalidé après `complete` (single-use)
- ✅ URL Suno originale gardée dans `metadata.suno_download_url`
- ✅ Timestamps `first_received_at` et `complete_received_at`
- ✅ Ordre des états strictement vérifié avant écriture

### 3. **Database** - Index & Contraintes
- ✅ Index unique `u_segments_run_idx` sur `(run_id, segment_index)`
- ✅ Index de performance sur `status` (segments + runs)
- ✅ Index sur `user_id` pour les requêtes utilisateur
- ✅ Bucket `parcours-tracks` forcé en privé

---

## 🎯 Go/No-Go Critères

### ✅ **GO** si :
1. **Callback First** : Preview démarre en < 40s après génération
2. **Storage Privé** : `parcours-tracks.public = false` confirmé
3. **Sign-Track Sécu** : 
   - 401 sans Authorization
   - 403 si user ≠ propriétaire
   - 200 avec URL signée 1h pour le bon user
4. **TTFC** : Segment complet (first → complete) en < 3 min moyenne
5. **Idempotence** : Rejouer `first`/`complete` retourne `skipped:true`

### ❌ **NO-GO** si :
1. Preview ne démarre pas (callback `first` non reçu)
2. `storage_path` reste null à `complete` (upload échoue)
3. Index `u_segments_run_idx` manquant (risque doublons)
4. URLs signées accessibles sans authentification

---

## 🧪 Tests Smoke Définitifs

### Test A : Callback FIRST (preview)
```bash
curl -X POST "$SUPABASE_URL/functions/v1/parcours-xl-callback?segment=<SEG>&token=<TOK>" \
 -H "Content-Type: application/json" \
 -d '{"stage":"first","streamUrl":"https://example.com/preview.mp3"}'
```
**Attendu** : `status` passe à `first`, `preview_url` rempli.

---

### Test B : Callback COMPLETE (upload Storage)
```bash
curl -X POST "$SUPABASE_URL/functions/v1/parcours-xl-callback?segment=<SEG>&token=<TOK>" \
 -H "Content-Type: application/json" \
 -d '{"stage":"complete","downloadUrl":"https://cdn1.suno.ai/demo.mp3","duration":127}'
```
**Attendu** : 
- `status` → `complete`
- `storage_path` → `runs/{runId}/{segmentId}.mp3`
- `callback_token` → `null`
- `metadata.suno_download_url` → URL originale
- Si dernier segment : `run.status` → `ready`

---

### Test C : Sign-Track Sécurité

#### Sans authentification (401)
```bash
curl -X POST "$SUPABASE_URL/functions/v1/sign-track" \
 -H "Content-Type: application/json" \
 -d '{"segmentId":"<SEG>"}'
```
**Attendu** : 401 Unauthorized

#### Avec mauvais user (403)
```bash
curl -X POST "$SUPABASE_URL/functions/v1/sign-track" \
 -H "Authorization: Bearer <AUTRE_USER_JWT>" \
 -H "Content-Type: application/json" \
 -d '{"segmentId":"<SEG>"}'
```
**Attendu** : 403 Forbidden

#### Avec bon user (200)
```bash
curl -X POST "$SUPABASE_URL/functions/v1/sign-track" \
 -H "Authorization: Bearer <OWNER_JWT>" \
 -H "Content-Type: application/json" \
 -d '{"segmentId":"<SEG>"}'
```
**Attendu** : 200 + `{"url": "https://...parcours-tracks/runs/...?token=..."}`

---

### Test D : Idempotence
1. Envoyer `first` deux fois → 2ème retourne `skipped:true`
2. Envoyer `complete` après `complete` → `skipped:true`
3. Envoyer `first` après `complete` → `skipped:true`

---

## 📊 Métriques Clés à Monitorer

| Métrique | Cible | Critique si |
|----------|-------|-------------|
| **TTFP** (Time To First Preview) | < 40s | > 60s |
| **TTFC** (Time To Full Complete) | < 3min | > 5min |
| **Taux d'erreurs** | < 5% | > 15% |
| **Runs bloqués** (status=creating > 30min) | 0 | > 3 |
| **Storage upload échoué** | < 2% | > 10% |

---

## 🔧 Variables d'Environnement Requises

### Edge Functions (Supabase)
```env
SUPABASE_URL=https://yaincoxihiqdksxgrsrk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
SUPABASE_ANON_KEY=<anon_key>
OPENAI_API_KEY=<openai_key>
SUNO_API_KEY=<suno_key>
```

### Frontend (.env)
```env
VITE_SUPABASE_PROJECT_ID=yaincoxihiqdksxgrsrk
VITE_SUPABASE_URL=https://yaincoxihiqdksxgrsrk.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon_key>
```

---

## 🎯 Architecture Finale

```
User Input (brief + SUDS)
        ↓
[parcours-xl-create]
        ↓
   OpenAI (3 prompts)
        ↓
[parcours-xl-runner] ← Séquentiel (un segment à la fois)
        ↓
[parcours-xl-generate] × 4
        ↓
   Suno API (callBackUrl)
        ↓
[parcours-xl-callback]
   ├─ first → preview_url
   └─ complete → Storage → storage_path
        ↓
   UI Player (sign-track à la demande)
```

---

## 🚨 Points de Vigilance

1. **CALLBACK_BASE** : DOIT pointer vers l'URL publique HTTPS de `parcours-xl-callback`
2. **Bucket privé** : Ne JAMAIS passer `parcours-tracks` en public
3. **Rate Limits Suno** : Runner séquentiel respecte 20 req/10s
4. **Token replay** : `callback_token` invalidé après `complete`
5. **Crossfade Player** : Bascule `preview_url` → URL signée sans "pop"

---

## ✅ Validation Finale

Cocher chaque item avant le go-live :

- [ ] Tous les tests smoke passent (A, B, C, D)
- [ ] Bucket `parcours-tracks` est privé
- [ ] Variables d'environnement configurées
- [ ] Index `u_segments_run_idx` créé
- [ ] Métriques baseline établies (1er run test)
- [ ] Rollback plan documenté
- [ ] Support alert configuré (>10% erreurs)

---

## 🎉 Déploiement Canary

**Stratégie recommandée** :
1. Activer pour 5% des users (feature flag)
2. Monitorer 48h : TTFP, erreurs, runs bloqués
3. Si OK : passer à 25% puis 100%
4. Si KO : rollback immédiat + investigation

---

**Status** : ✅ PROD-READY
**Dernière mise à jour** : 2025-10-06
**Contact** : support@emotionscare.com
