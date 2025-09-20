# Architecture EmotionsCare

```
Utilisatrice → App (React + Design System) ↔ Edge Functions (Supabase Functions)
     ↘                                       ↙
        Supabase (Postgres + Auth + Storage) ←→ Observabilité (Sentry, Logflare)
```

## Vue d’ensemble
- **Application React** : front unique (B2C/B2B) orchestré via RouterV2. Les composants premium résident dans `src/ui` et Storybook documente les usages sans chiffres.
- **Edge Functions** : orchestrent les évaluations (`assess-*`), l’analyse Hume (`ai-emotion-analysis`) et les exports narratifs B2B. Chaque fonction exige un JWT Supabase et respecte les flags d’opt-in.
- **Supabase** : Postgres + Auth + Storage avec RLS stricte. Les tables critiques (`emotion_scans`, `sessions`, `org_rollups`) ne sont exposées qu’au travers de vues anonymisées.
- **Observabilité** : Sentry (front + edge) et journaux redacted. Les traces incluent uniquement des identifiants opaques.

## Flux principaux
1. **Opt-in** : les comptes activent explicitement les modules. Les flags sont persistés (`profiles.feature_flags`) et contrôlés côté Edge avant chaque appel.
2. **Assessments** :
   - `POST /assess/start` fournit les questions textuelles à partir des specs OpenAPI.
   - `POST /assess/submit` sérialise les réponses (sans scores) puis déclenche l’orchestration.
   - `POST /assess/aggregate` retourne une synthèse narrative par session.
3. **Orchestration adaptative** : les résultats alimentent les modules (respiration, musique, VR) via signaux (`soften_audio`, `long_exhale`, etc.). Aucun score n’est affiché côté UI, uniquement des messages qualitatifs.
4. **Narratives B2B** : les fonctions `/b2b/*` produisent des rapports textuels (`tone`, `story`, `guidance`) respectant `min_n` et l’anonymisation.

## Edge ↔ App
- Les appels front→edge passent par `src/api/client.ts` qui consomme les types OpenAPI générés.
- `fetch` est encapsulé (auth Bearer, CORS strict). Aucune réponse n’est castée en `any`.

## Séparation front / serveur
- Les clés sensibles (`HUME_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) ne quittent jamais l’Edge.
- Toute logique UI reste purement textuelle : les gradients ou badges reflètent un état (calme, vibrant) sans valeur numérique.

## Documentation vivante
- Storybook sert de référence UI + a11y (addon a11y, onglet “A11y notes”).
- Les fichiers de specs OpenAPI (`openapi/*.yaml`) sont la source unique pour les types API. Génération automatisée via `npm run gen:openapi`.
