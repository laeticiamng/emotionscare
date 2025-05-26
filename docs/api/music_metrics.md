# API Music Metrics

Ces endpoints exposent les scores calculés par les widgets **BioTune 2-Track** et **Neon-Route Walk**.
Les données sont récupérées depuis les vues matérialisées `biotune_daily_metrics`, `neon_walk_daily_metrics` et leurs équivalents hebdomadaires. Les agrégats organisationnels proviennent de `metrics_weekly_music_org`.

## Endpoints

| Méthode | Route | Description |
|-----------|-------|-------------|
| `GET` | `/music/daily?since=30 days` | Scores quotidiens de l'utilisateur courant |
| `GET` | `/music/weekly?since=8 weeks` | Scores hebdomadaires de l'utilisateur |
| `GET` | `/org/:orgId/music/weekly` | Agrégats hebdomadaires pour l'organisation |

Exemple pour récupérer les scores hebdomadaires d'une organisation :

```bash
curl -H "Authorization: Bearer <jwt>" \
  https://<project>.functions.supabase.co/org/acme/music/weekly
```

Chaque appel n'expose que des valeurs agrégées et respecte les règles RLS.
