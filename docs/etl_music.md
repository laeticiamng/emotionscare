# ETL Musicothérapie

Ce module s'appuie sur deux vues matérialisées pour agréger les données des sessions
`biotune_sessions` et `neon_walk_sessions`.

```
biotune_sessions        neon_walk_sessions
        \                     /
         \                   /
      metrics_weekly_music
               |
      metrics_weekly_music_org
```

La fonction `refresh_metrics_music()` met à jour ces vues et est planifiée tous
les jours à 03h10 UTC via `pg_cron`.

Exemple de requête pour consulter les métriques d'un utilisateur :

```sql
select *
from public.metrics_weekly_music
where user_id_hash = 'hashA'
order by week_start desc;
```

Pour voir la planification :

```sql
select * from cron.job
where job_name = 'refresh_metrics_music';
```
