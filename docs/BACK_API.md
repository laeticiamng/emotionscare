# Endpoints Metrics API

Ce document récapitule les routes disponibles pour l'ingestion des widgets et la consultation des métriques.

## POST

- `/functions/v1/micro-breaks` – enregistre les données du widget micro-break.
- `/functions/v1/bubble-sessions` – enregistre les sessions Bubble.
- `/functions/v1/silk-wallpaper` – enregistre les mesures du fond d'écran Silk.

Chaque POST attend un JSON conforme aux schémas Zod définis dans `supabase/functions/_shared/schemas.ts`. Un identifiant est renvoyé avec un code **201** en cas de succès.

## GET

- `/functions/v1/me-metrics?range=7d|30d` – retourne les métriques personnelles de l'utilisateur authentifié.
- `/functions/v1/rh-metrics?team=ID&range=w4|w8` – retourne les agrégats anonymisés pour l'équipe. Nécessite le rôle `rh_manager`.

Le champ `share_metrics` du profil permet à l'utilisateur de se soustraire au partage de données ; les politiques RLS appliquées dans la base filtrent automatiquement les lignes concernées.
