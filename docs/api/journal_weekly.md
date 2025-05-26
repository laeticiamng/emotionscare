# Endpoints Journal Weekly

Ces routes exposent les KPI hebdomadaires du journal.

## GET `/journal/weekly?since=YYYY-MM-DD`
Retourne les métriques personnelles de l'utilisateur authentifié.

Exemple :
```bash
curl -H "Authorization: Bearer <token>" \
     https://<project>.functions.supabase.co/journal/weekly?since=2024-01-01
```

## GET `/org/:orgId/journal/weekly?since=YYYY-MM-DD`
Retourne les KPI agrégés pour l'organisation spécifiée (rôle admin requis).

Exemple :
```bash
curl -H "Authorization: Bearer <token>" \
     https://<project>.functions.supabase.co/org/ORG_ID/journal/weekly
```

