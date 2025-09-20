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
| `FF_B2B_AGGREGATES` | `true` | Active l'endpoint `/assess/aggregate` et les vues B2B correspondantes. |

> Pour un environnement local, copiez `.env.example` vers `.env.local`, renseignez les variables ci-dessus puis redémarrez les fonctions Edge.
