# Configuration des Cron Jobs ML Escalation

## Prérequis
- Extension `pg_cron` activée dans Supabase
- Extension `pg_net` activée dans Supabase
- Edge functions déployées (`ml-alert-predictor`, `optimize-escalation-rules`)

## Instructions SQL

Exécutez ces requêtes dans l'éditeur SQL de Supabase pour configurer les cron jobs automatiques.

### 1. Analyse ML des Prédictions (Quotidien à 2h du matin)

```sql
SELECT cron.schedule(
  'ml-alert-predictions-daily',
  '0 2 * * *', -- Tous les jours à 2h
  $$
  SELECT net.http_post(
    url := 'https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/ml-alert-predictor',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
```

### 2. Optimisation des Règles d'Escalade (Toutes les 6 heures)

```sql
SELECT cron.schedule(
  'optimize-escalation-rules-6h',
  '0 */6 * * *', -- Toutes les 6 heures
  $$
  SELECT net.http_post(
    url := 'https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/optimize-escalation-rules',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
```

## Vérification des Cron Jobs

### Lister tous les cron jobs actifs
```sql
SELECT * FROM cron.job;
```

### Voir l'historique d'exécution
```sql
SELECT 
  jobid,
  runid,
  job_pid,
  database,
  username,
  command,
  status,
  return_message,
  start_time,
  end_time
FROM cron.job_run_details
ORDER BY start_time DESC
LIMIT 20;
```

### Désactiver un cron job
```sql
SELECT cron.unschedule('ml-alert-predictions-daily');
SELECT cron.unschedule('optimize-escalation-rules-6h');
```

## Planification Recommandée

| Fonction | Fréquence | Heure | Justification |
|----------|-----------|-------|---------------|
| ML Alert Predictor | Quotidien | 2h00 | Analyse nocturne pour prédictions du jour |
| Optimize Escalation Rules | Toutes les 6h | 0h, 6h, 12h, 18h | Ajustements réguliers basés sur performances |

## Monitoring

Consultez les logs edge functions dans Supabase Dashboard:
- **Functions** → Select function → **Logs**

Vérifiez la table `ml_predictions` pour les résultats:
```sql
SELECT 
  prediction_type,
  predicted_at,
  confidence_score,
  model_version
FROM ml_predictions
ORDER BY predicted_at DESC
LIMIT 10;
```

## Troubleshooting

### Erreur: Extension pg_cron non disponible
```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
```

### Erreur: Extension pg_net non disponible
```sql
CREATE EXTENSION IF NOT EXISTS pg_net;
```

### Tester manuellement une edge function
```bash
curl -X POST \
  https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/ml-alert-predictor \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Notes Importantes

1. **Crédits Lovable AI**: Les analyses ML consomment des crédits. Surveillez votre usage.
2. **Performance**: Les analyses quotidiennes sont optimales pour ne pas surcharger l'API.
3. **Auto-optimisation**: Les règles avec précision < 50% sont automatiquement ajustées.
4. **Logs**: Conservez l'historique des prédictions pour améliorer le modèle.
