# Sécurité & conformité

## RLS (Row Level Security)
- Tables sensibles (`emotion_scans`, `sessions`, `journal_entries`) : politiques owner-only.
- Vues B2B (`org_rollups`) : filtrées par `organisation_id` avec contrainte `min_n` supérieure ou égale à cinq.
- Toutes les fonctions Edge utilisent le service role uniquement pour accéder aux vues sécurisées.

## Frontend
- CSP stricte : `default-src 'self'; connect-src https://*.supabase.co https://api.hume.ai ...` (voir `public/_headers`).
- HSTS activé via `_headers` (max-age un an, includeSubDomains, preload).
- COOP/COEP définis (`Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Embedder-Policy: require-corp`).
- Pas de third-party analytics.

## Logs & observabilité
- Les logs Edge sont redacted : jamais de payload audio/texte brut. Seules des métadonnées anonymes sont conservées.
- Sentry : les breadcrumbs suppriment les identifiants directs (hash SHA-256).
- Export B2B : lien signé expirant après quinze minutes (`expiresInMinutes`, min cinq, max soixante) + audit trail.

## Données cliniques
- Jamais de scores numériques dans l’UI ; uniquement des résumés textuels.
- Les orchestrations (respiration/musique) consomment les signaux `soften_audio`, `long_exhale`, etc. Aucun stockage de voix brute.
- Les réponses d’évaluation sont purgées des PII (normalisation `sanitizeAssessmentPayload`).

## Tests & CI
- `npm run lint` + `npm run test` à chaque PR.
- `npm run gen:openapi && npm run type-check` garantit que les clients utilisent les types générés.
- Playwright axe-core sur `/`, `/app/home`, `/app/scan`, `/b2b/reports`.
