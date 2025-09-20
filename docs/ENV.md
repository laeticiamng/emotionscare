# Variables d'environnement clés

Ce document résume les variables nécessaires pour activer les agrégations B2B textuelles.

## Supabase

| Variable | Description |
| --- | --- |
| `SUPABASE_URL` | URL du projet Supabase utilisée par les fonctions Edge. |
| `SUPABASE_ANON_KEY` | Clé publique utilisée côté Edge pour interroger Supabase avec RLS actif. |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé réservée aux tâches batch (upsert des rollups). Ne jamais l'exposer au client. |

## Feature flags

| Variable | Valeur recommandée | Description |
| --- | --- | --- |
| `ALLOWED_ORIGINS` | Liste des origines autorisées pour les Edge Functions cliniques (`/functions/v1/assess-start`). | `https://app.emotionscare.com,https://staging.emotionscare.com` |
| `FF_ASSESS_WHO5` | Active la diffusion du WHO-5 via l'Edge. | `true` |
| `FF_ASSESS_STAI6` | Active la diffusion du STAI-6 via l'Edge. | `true` |
| `FF_ASSESS_ISI` | Active la diffusion de l'ISI hebdomadaire via l'Edge. | `true` |
| `FF_ASSESS_SAM` | Active la diffusion du SAM via l'Edge. | `true` |
| `FF_ASSESS_SUDS` | Active la diffusion du SUDS via l'Edge. | `true` |
| `FF_ORCH_BREATH` | Active l’orchestration adaptative du module respiration. | `true` |
| `FF_B2B_AGGREGATES` | `true` | Active l'endpoint `/assess/aggregate` et les vues B2B correspondantes. |
| `FF_B2B_HEATMAP` | `true` | Débloque la heatmap RH textuelle côté suite B2B. |

