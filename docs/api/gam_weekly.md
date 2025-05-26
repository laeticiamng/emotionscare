# Endpoints Gamification Weekly

Ces routes exposent les KPI hebdomadaires de gamification.

## GET `/me/gam/weekly?since=YYYY-MM-DD`
Retourne les métriques personnelles de l'utilisateur authentifié.

## GET `/org/:orgId/gam/weekly?since=YYYY-MM-DD`
Retourne les métriques agrégées pour une organisation (rôle admin requis).
