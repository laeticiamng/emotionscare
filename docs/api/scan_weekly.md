# Endpoints Scan Weekly

Ces routes exposent les KPI hebdomadaires issus des analyses "scan".

## GET `/me/scan/weekly?since=YYYY-MM-DD`
Retourne les métriques personnelles de l'utilisateur authentifié.

## GET `/org/:orgId/scan/weekly?since=YYYY-MM-DD`
Retourne les métriques agrégées pour une organisation (rôle admin requis).
