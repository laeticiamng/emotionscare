# 🌱 Variables d'environnement clés

## Edge Function `assess-submit`

| Variable | Description |
| --- | --- |
| `CORS_ORIGINS` | Liste des origines autorisées pour les requêtes CORS (séparées par une virgule). |
| `FF_ASSESS_WHO5` | Active l'instrument WHO-5 côté Edge (`true` par défaut). |
| `FF_ASSESS_STAI6` | Active l'instrument STAI-6 (`true` par défaut). |
| `FF_ASSESS_SAM` | Active l'instrument SAM (`true` par défaut). |
| `FF_ASSESS_SUDS` | Active l'instrument SUDS (`true` par défaut). |

> ℹ️  Positionnez ces variables dans l'environnement Supabase Edge (`supabase env set …`).


