# Endpoints VR Weekly

Ces routes exposent les KPI hebdomadaires VR.

## GET `/me/vr/weekly?since=YYYY-MM-DD`
Retourne les métriques personnelles de l'utilisateur authentifié.

## GET `/org/:orgId/vr/weekly?since=YYYY-MM-DD`
Retourne les métriques agrégées pour une organisation (rôle admin requis).
