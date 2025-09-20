# Variables d’environnement essentielles

## Supabase & Auth
| Variable | Scope | Notes |
| --- | --- | --- |
| `SUPABASE_URL` | Edge, scripts | URL du projet utilisé par toutes les fonctions. |
| `SUPABASE_ANON_KEY` | Edge | Clé publique pour les requêtes signées côté client (jamais loggée). |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge uniquement | Clé privilégiée. Utilisation restreinte aux fonctions sous contrôle RLS. |
| `SUPABASE_FUNCTIONS_URL` | Local/CI | Permet d’appeler les fonctions Edge depuis les tests Playwright. |
| `SUPABASE_JWT_SECRET` | Edge | Nécessaire aux tests JWT (`supabase auth.signInWithOtp`). |

## Observabilité
| Variable | Scope | Notes |
| --- | --- | --- |
| `SENTRY_DSN` / `VITE_SENTRY_DSN` | Front + Edge | Capture des erreurs. Toujours définir l’environnement (`VITE_SENTRY_ENVIRONMENT`). |
| `SENTRY_TRACES_SAMPLE_RATE` | Front | Rester faible (0.1 par défaut) pour éviter la surcharge. |
| `SENTRY_REPLAYS_*` | Front | Replays activés uniquement sur erreurs pour des raisons RGPD. |

## IA & Intégrations
| Variable | Scope | Notes |
| --- | --- | --- |
| `OPENAI_API_KEY` | Edge | Jamais injectée côté client. Utilisée pour le coach IA et les synthèses. |
| `HUME_API_KEY` | Edge | Analyse voix/affect via Hume. Ne jamais remplir `NEXT_PUBLIC_HUME_API_KEY`/`VITE_HUME_API_KEY`. |
| `FF_HUME_ANALYSIS` | Edge | Flag global (false par défaut). Positionner sur `true` uniquement si la clé est configurée et le consentement actif. |

## Feature Flags cliniques
| Variable | Scope | Description |
| --- | --- | --- |
| `FF_ASSESS_WHO5`, `FF_ASSESS_STAI6`, `FF_ASSESS_SAM`, `FF_ASSESS_SUDS` | Edge | Active chaque instrument dans `/assess/start`. |
| `FF_B2B_AGGREGATES` | Edge | Autorise `/b2b/*` à renvoyer les synthèses narratives. |
| `FF_ORCH_*` | Front + Edge | Gouverne l’activation des orchestrations (respiration, musique, VR). |

## CORS & sécurité
| Variable | Scope | Notes |
| --- | --- | --- |
| `CORS_ORIGINS` | Edge | Liste séparée par virgules des domaines autorisés pour les appels d’évaluation. |
| `HUME_ALLOWED_ORIGINS` | Edge | Origines habilitées pour l’endpoint `ai-emotion-analysis`. |
| `HEALTH_ALLOWED_ORIGINS` | Edge | Filtre les appels aux endpoints de santé. |

## Exemples de configuration locale (`.env.local`)
```
SUPABASE_URL=https://dev-project.supabase.co
SUPABASE_ANON_KEY=public-anon
SUPABASE_SERVICE_ROLE_KEY=service-role-only
CORS_ORIGINS=http://localhost:5173
HUME_API_KEY=
FF_HUME_ANALYSIS=false
SENTRY_DSN=
```

> ⚠️ Ne jamais committer un `.env` réel. Utiliser `.env.example` comme référence officielle et le maintenir à jour à chaque ajout de variable.
