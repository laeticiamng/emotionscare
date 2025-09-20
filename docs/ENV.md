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


