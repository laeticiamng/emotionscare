# Configuration du Cron Job pour les Audits Automatiques

## Vue d'ensemble

Le système de planification automatique des audits RGPD est maintenant configuré. Pour activer l'exécution automatique, vous devez configurer un job cron qui appellera l'edge function `scheduled-audits` périodiquement.

## Prérequis

1. Activer les extensions PostgreSQL dans votre projet Supabase :
   - `pg_cron` : Pour la planification des tâches
   - `pg_net` : Pour les requêtes HTTP

## Configuration du Cron Job

### 1. Activer les extensions

Dans le SQL Editor de votre projet Supabase, exécutez :

```sql
-- Activer pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Activer pg_net
CREATE EXTENSION IF NOT EXISTS pg_net;
```

### 2. Créer le job cron

Exécutez la requête suivante en remplaçant les valeurs :

```sql
SELECT cron.schedule(
  'check-scheduled-audits',
  '*/15 * * * *', -- Toutes les 15 minutes
  $$
  SELECT
    net.http_post(
        url:='https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/scheduled-audits/check',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);
```

### 3. Vérifier le job

Pour vérifier que le job est bien créé :

```sql
SELECT * FROM cron.job;
```

### 4. Voir l'historique d'exécution

```sql
SELECT * FROM cron.job_run_details 
ORDER BY start_time DESC 
LIMIT 10;
```

## Fréquences recommandées

- **Toutes les 15 minutes** : `*/15 * * * *` (recommandé pour vérifier les planifications)
- **Toutes les heures** : `0 * * * *`
- **Toutes les 6 heures** : `0 */6 * * *`
- **Une fois par jour à 2h** : `0 2 * * *`

## Gestion des erreurs

Si le job échoue, vous pouvez voir les erreurs dans :

```sql
SELECT * FROM cron.job_run_details 
WHERE status = 'failed'
ORDER BY start_time DESC;
```

## Désactiver le job

Pour désactiver le job temporairement :

```sql
SELECT cron.unschedule('check-scheduled-audits');
```

## Fonctionnement du système

1. Le cron job appelle `/scheduled-audits/check` toutes les 15 minutes
2. La fonction vérifie les planifications dont `next_run_at` est dépassé
3. Pour chaque planification due :
   - Lance un audit via `/compliance-audit/run`
   - Met à jour `last_run_at` et calcule `next_run_at`
4. Détecte automatiquement les baisses de score (trigger SQL)
5. Génère des alertes si :
   - Le score baisse de plus de 5 points
   - Le score passe sous le seuil configuré
   - Des recommandations critiques sont détectées
6. Envoie les notifications aux destinataires configurés

## Interface utilisateur

Utilisez l'interface "Planifications" dans le dashboard RGPD pour :
- Créer des planifications (quotidien, hebdomadaire, mensuel)
- Configurer les seuils d'alerte
- Ajouter des destinataires de notifications
- Voir les alertes générées
- Consulter l'historique des exécutions

## Monitoring

Les logs de la fonction sont accessibles dans Supabase :
1. Allez dans "Edge Functions" > "scheduled-audits"
2. Cliquez sur "Logs"
3. Filtrez par niveau de log (info, warn, error)

## Support

Pour toute question ou problème, consultez la documentation Supabase sur pg_cron :
https://supabase.com/docs/guides/database/extensions/pg_cron
