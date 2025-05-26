# ETL Musicothérapie

Ce module agrège les sessions **BioTune** et **Neon Walk** dans des vues matérialisées hebdomadaires.

```mermaid
flowchart TD
    A[biotune_sessions] --> C(metrics_weekly_music)
    B[neon_walk_sessions] --> C
    C --> D(metrics_weekly_music_org)
```

## Exemples de requêtes

Rafraîchir manuellement les métriques :
```sql
CALL public.refresh_metrics_music();
```

Lister les scores d'une organisation :
```sql
SELECT *
FROM public.metrics_weekly_music_org
WHERE org_id = 'acme'
ORDER BY week_start DESC;
```
