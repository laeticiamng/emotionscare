# EmotionsCare – Variables d'environnement

## Assessments cliniques

| Variable | Description | Valeur recommandée (dev) |
| --- | --- | --- |
| `CORS_ORIGINS` | Liste des origines autorisées pour les Edge Functions cliniques (`/functions/v1/assess-start`). | `https://app.prod.tld,https://staging.app.tld,http://localhost:5173` |
| `FF_ASSESS_WHO5` | Active la diffusion du WHO-5 via l'Edge. | `true` |
| `FF_ASSESS_STAI6` | Active la diffusion du STAI-6 via l'Edge. | `true` |
| `FF_ASSESS_ISI` | Active la diffusion de l'ISI hebdomadaire via l'Edge. | `true` |
| `FF_ASSESS_SAM` | Active la diffusion du SAM via l'Edge. | `true` |
| `FF_ASSESS_SUDS` | Active la diffusion du SUDS via l'Edge. | `true` |
| `FF_ORCH_BREATH` | Active l’orchestration adaptative du module respiration. | `true` |

> ℹ️ Ces variables sont lues côté Edge. Toute désactivation (`false`) renvoie une erreur `instrument_disabled`.
