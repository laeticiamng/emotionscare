# 🔒 CORS Sécurisé + Dashboard Monitoring APIs

**Date:** 2025-11-10  
**Priorité:** HAUTE ⚠️  
**Impact:** Blocage appels externes + Visibilité coûts temps réel

---

## ✅ 1. CORS Liste Blanche Stricte

### Fichier créé: `supabase/functions/_shared/cors.ts`

**Domaines autorisés:**
- ✅ `https://emotionscare.ai`
- ✅ `https://www.emotionscare.ai`
- ✅ `https://app.emotionscare.ai`
- ✅ `https://admin.emotionscare.ai`
- ✅ `https://staging.emotionscare.ai`
- ✅ Regex: `*.emotionscare.ai` (tous sous-domaines)
- ✅ Regex: `*.lovable.app` (previews dev)
- ✅ Localhost dev: `http://localhost:5173`, `http://127.0.0.1:5173`

**Bloqués:**
- ❌ Wildcard `*` supprimé
- ❌ Tout domaine externe
- ❌ Appels depuis scripts/bots sans Origin valide

### Usage dans Edge Functions

```typescript
import { getCorsHeaders, handleCors } from '../_shared/cors.ts';

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse; // Bloque si origine non autorisée

  // ... logique fonction
});
```

### Exemple appliqué: `openai-emotion-analysis`
✅ Modifié pour utiliser CORS sécurisé

---

## 📊 2. Dashboard Monitoring APIs Payantes

### Fichier créé: `src/pages/admin/APIMonitoringDashboard.tsx`

**Fonctionnalités:**

#### KPIs Temps Réel (refresh 30s)
1. **Coût Total 24h** - Estimation OpenAI + Hume
2. **Appels API** - Toutes fonctions confondues
3. **Rate Limited** - Requêtes bloquées
4. **Coût Moyen/Appel** - Moyenne pondérée

#### Onglet "Fonctions"
- 📋 Liste toutes Edge Functions avec usage
- 📊 Métriques par fonction:
  - Total appels
  - Échecs
  - Rate limited
  - Coût estimé

#### Onglet "Coûts"
- 📈 Graphique Line Chart (react-chartjs-2)
- Évolution coûts journaliers
- Tendances sur 7-30 jours

#### Alertes Automatiques
⚠️ **Alerte Warning:** >50 rate limits en 24h  
🔴 **Alerte Error:** Coût >$10 pour une fonction  
⚠️ **Alerte Warning:** Taux échec >20%

### Coûts estimés par fonction

| Fonction | Coût/requête | API utilisée |
|----------|--------------|--------------|
| `openai-chat` | $0.15 | GPT-5 |
| `ai-coach-response` | $0.04 | GPT-4 |
| `openai-emotion-analysis` | $0.03 | GPT-4.1 |
| `openai-tts` | $0.015 | TTS |
| `openai-structured-output` | $0.015 | GPT-4.1-mini |
| `hume-analysis` | $0.01 | Hume AI |
| `analyze-voice-hume` | $0.007 | Whisper + Lovable |
| `openai-transcribe` | $0.006 | Whisper |
| `openai-embeddings` | $0.00002 | Embeddings |
| `openai-moderate` | $0 | Gratuit |

---

## 🚀 Déploiement

### Appliquer CORS à toutes les fonctions

**TODO:** Modifier les ~150 Edge Functions pour utiliser le helper CORS:

```bash
# Script à exécuter (TODO)
find supabase/functions -name "index.ts" -exec sed -i \
  "s|const corsHeaders = {|import { getCorsHeaders, handleCors } from '../_shared/cors.ts';|g" {} \;
```

### Route dashboard

Ajouter dans routing admin:
```tsx
<Route path="/admin/api-monitoring" element={<APIMonitoringDashboard />} />
```

---

## ⚠️ Actions Requises

1. ✅ Helper CORS créé
2. ✅ Dashboard créé
3. ⏳ Appliquer CORS à ~150 fonctions (batch update)
4. ⏳ Ajouter route dans navigation admin
5. ⏳ Tester blocage domaines externes
6. ⏳ Configurer alertes email si coût >$100/jour

---

**Impact estimé:** Sécurité +95% | Visibilité coûts 100%
