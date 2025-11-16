# Configuration du Cron Job pour l'Escalade Automatique des Alertes

## Vue d'ensemble

Le système d'escalade automatique permet d'augmenter progressivement la priorité des alertes non résolues et de notifier des niveaux hiérarchiques supérieurs après un délai configurable.

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

### 2. Créer le job cron pour l'escalade

Exécutez la requête suivante :

```sql
SELECT cron.schedule(
  'check-alert-escalation',
  '*/30 * * * *', -- Toutes les 30 minutes
  $$
  SELECT
    net.http_post(
        url:='https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/check-alert-escalation',
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

- **Toutes les 30 minutes** : `*/30 * * * *` (recommandé pour une réactivité optimale)
- **Toutes les heures** : `0 * * * *`
- **Toutes les 2 heures** : `0 */2 * * *`

## Fonctionnement du système

1. Le cron job appelle `/check-alert-escalation` toutes les 30 minutes
2. La fonction vérifie les alertes non résolues dont le délai est dépassé
3. Pour chaque alerte éligible :
   - Augmente le niveau d'escalade (+1)
   - Enregistre l'historique d'escalade
   - Augmente la priorité si configuré (low → medium → high → critical)
   - Envoie des notifications aux rôles du niveau correspondant
4. Les alertes atteignent un niveau maximum configurable (par défaut 3)

## Configuration des règles d'escalade

Utilisez l'interface `/admin/alert-escalation` pour :
- Définir le délai avant escalade (par défaut 2h)
- Configurer les niveaux d'escalade (1-3)
- Définir les rôles notifiés à chaque niveau
- Activer/désactiver l'augmentation automatique de priorité
- Activer/désactiver les règles

### Exemple de configuration

**Niveau 1** (après 2h) :
- Rôles : developer, tech_lead
- Priorité : high

**Niveau 2** (après 4h) :
- Rôles : tech_lead, manager
- Priorité : critical

**Niveau 3** (après 6h) :
- Rôles : manager, cto
- Priorité : critical

## Analyse IA des patterns d'erreurs

Le système inclut une fonction d'analyse IA (`analyze-error-patterns`) qui :
1. Groupe les erreurs similaires sur 30 jours
2. Analyse les patterns avec Lovable AI (Gemini)
3. Génère des suggestions de templates optimisés
4. Propose des résolutions automatiques

### Lancer l'analyse manuellement

Vous pouvez déclencher l'analyse depuis l'interface `/admin/ai-template-suggestions` ou via :

```sql
SELECT
  net.http_post(
      url:='https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/analyze-error-patterns',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU"}'::jsonb
  ) as request_id;
```

### Automatiser l'analyse (optionnel)

Pour analyser automatiquement les patterns chaque semaine :

```sql
SELECT cron.schedule(
  'analyze-error-patterns-weekly',
  '0 2 * * 1', -- Tous les lundis à 2h du matin
  $$
  SELECT
    net.http_post(
        url:='https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/analyze-error-patterns',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU"}'::jsonb
    ) as request_id;
  $$
);
```

## Monitoring

### Logs des escalades

```sql
SELECT 
  id, 
  title, 
  severity,
  escalation_level,
  escalation_history,
  created_at
FROM unified_alerts 
WHERE escalation_level > 0
ORDER BY escalation_level DESC, created_at DESC
LIMIT 20;
```

### Suggestions IA

```sql
SELECT 
  pattern_name,
  confidence_score,
  occurrences,
  status,
  created_at
FROM ai_template_suggestions
ORDER BY occurrences DESC, confidence_score DESC
LIMIT 10;
```

## Désactiver les jobs

```sql
-- Désactiver l'escalade automatique
SELECT cron.unschedule('check-alert-escalation');

-- Désactiver l'analyse IA (si activée)
SELECT cron.unschedule('analyze-error-patterns-weekly');
```

## Support

Pour toute question, consultez :
- Documentation pg_cron : https://supabase.com/docs/guides/database/extensions/pg_cron
- Documentation Lovable AI : https://docs.lovable.dev/features/ai
