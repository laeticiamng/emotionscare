# Endpoints Breath Weekly

Ces routes exposent les KPI hebdomadaires de breathwork.

## GET `/me/breath/weekly?since=YYYY-MM-DD`
Retourne les métriques personnelles de l'utilisateur authentifié.

## GET `/org/:orgId/breath/weekly?since=YYYY-MM-DD`
Retourne les métriques agrégées pour une organisation (rôle admin requis).
