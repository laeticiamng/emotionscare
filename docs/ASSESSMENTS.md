# 📊 Assessments – Opt-in clinique

L'offre d'assessments (WHO-5, PANAS, STAI-6, etc.) est entièrement opt-in et instrumentée via des Edge Functions.
Ce guide couvre les flux, la sécurité et les règles produit (zéro score chiffré côté UI, min_n≥5 côté B2B).

## 🌐 Endpoints Edge
| Endpoint | Rôle | Source |
| --- | --- | --- |
| `POST /assess/start` | Sert le catalogue (questions, libellés, métadonnées). | `supabase/functions/assess-start` |
| `POST /assess/submit` | Reçoit les réponses, calcule les scores, génère des hints orchestrateurs. | `supabase/functions/assess-submit` |
| `POST /assess/aggregate` | Retourne les agrégats anonymisés pour le reporting B2B. | `supabase/functions/assess-aggregate` |

### Sécurité commune
- Auth Supabase obligatoire (`authenticateRequest`).
- CORS restreint + préflight automatique (`resolveCors`).
- Rate-limit 10 req/min (`enforceEdgeRateLimit`).
- Hash utilisateur via Web Crypto (`_shared/hash_user.ts` → SHA-256, pas de `node:crypto`).
- Entêtes de sécurité (`applySecurityHeaders`) injectent `X-Robots-Tag: noindex` et `Cache-Control: no-store`.
- Sentry breadcrumbs catégorisés (`assess:start`, `assess:submit`, `assess:aggregate`) sans payload texte.

## 🎛️ Feature flags & opt-in
- Les instruments sont contrôlés par `clinical_feature_flags` (table Supabase). Règles :
  - `FF_ASSESS_PANAS`, `FF_ASSESS_SSQ`, etc. définis côté client (`src/core/flags.ts`) → permettent d'afficher l'UI.
  - L'API `/me/feature_flags` fusionne les defaults avec les valeurs remote (RLS public read-only).
- UI : proposer l'assessment **uniquement** si le flag est actif et l'utilisateur a explicitement consenti (`useClinicalConsent`).
- `doNotTrack` : `useClinicalConsent` vérifie `navigator.doNotTrack` et désactive l'assessment si DNT actif.

## 🧘 Règle « zéro chiffre » côté UI
- Les composants présentent des feedbacks qualitatifs (couleurs, phrases) – jamais de score brut.
- Toute traduction ou message se trouve dans `src/modules/assessments/i18n.json` (pas de nombre affiché).
- Les scores numériques restent côté Edge/B2B pour calibrer les recommandations (coach, dashboards).

## 🛡️ Agrégations B2B (min_n ≥ 5)
- `assess-aggregate` et les vues `org_assess_rollups` imposent `min_n ≥ 5` via la policy `org_rollups_read_min5` (RLS) et un contrôle de non-négativité sur `n`.
- Les endpoints `org-dashboard-weekly`, `org-dashboard-export` réinjectent `min_n` dans la réponse (tag Sentry `b2b_text_only` côté heatmap).
- UI B2B (`/app/reports`, `/app/events`, `/app/optimization`) :
  - Afficher un garde anonymat si `eligible === false` ou `min_n_met === false`.
  - Ne jamais afficher d'agrégat si la taille d'échantillon est insuffisante (masquer la cellule, message explicite).

## 🔄 Flux complet (B2C)
1. Opt-in consentement (modal) → stocké en `user_metadata` + localStorage.
2. `POST /assess/start` pour récupérer le questionnaire (locale `fr` par défaut).
3. L'utilisateur répond → `POST /assess/submit`.
4. La réponse contient :
   - `scores` (JSON anonymisé), `level` (0-4), `orchestration_hints` (ex: `suggest_breathing`).
   - `ttl` (minutes) pour invalider le cache.
5. Les hints sont propagés vers les modules concernés (ex. Coach, Flash Glow) via `UnifiedStateManager`.

## 🧪 Tests & QA
- Tests Edge : `supabase/tests/assess-functions.test.ts` + `supabase/tests/assessments_checks.sql` (vérifie `min_n`).
- QA UI : lancer `npm run test:e2e` (scénarios assessments) + vérifier `docs/ASSESSMENTS.md` lors de tout nouveau questionnaire.
- Pour simuler l'API en local, stubber `window.fetch('/assess/...')` dans Playwright (voir exemples dans `tests/e2e` utilisant `route.fulfill`).

> _Tout nouvel instrument doit être ajouté aux flags (`src/core/flags.ts` + `clinical_feature_flags`), documenté ici, et validé par le legal/privacy avant mise en prod._
