# 🏥 Configuration du Dashboard de Santé Système

## Vue d'ensemble

Le dashboard de santé système fournit une surveillance en temps réel des KPIs critiques avec alerting automatique basé sur des seuils configurables.

## KPIs Surveillés

| Métrique | Description | Unité | Seuil Alerte | Seuil Critique |
|----------|-------------|-------|--------------|----------------|
| **Uptime** | Disponibilité du système | % | < 99.5% | < 99.0% |
| **Latence Moyenne** | Temps de réponse API | ms | > 500ms | > 1000ms |
| **Taux d'Erreur** | Pourcentage d'erreurs critiques | % | > 1.0% | > 5.0% |
| **Alertes/Heure** | Nombre d'alertes générées | count | > 10 | > 20 |
| **CPU Usage** | Utilisation du processeur | % | > 70% | > 85% |
| **Memory Usage** | Utilisation de la mémoire | % | > 75% | > 90% |

## Architecture

### 1. Tables de Données

**`system_health_metrics`** : Stocke les métriques en temps réel
- Rafraîchissement toutes les 5 minutes via cron
- Rétention : 30 jours (configurable)
- Index sur `metric_name` et `timestamp` pour performances

**`system_health_thresholds`** : Configuration des seuils d'alerte
- Opérateurs de comparaison : `gt` (>), `lt` (<), `gte` (≥), `lte` (≤)
- Canaux de notification : Slack, Email, Discord
- Activation/désactivation individuelle par métrique

### 2. Edge Function `collect-system-metrics`

Collecte automatique des métriques :
- Calcule l'uptime basé sur le ratio erreurs/requêtes
- Mesure la latence moyenne des escalades
- Détermine le taux d'erreur critique
- Compte les alertes par heure
- Vérifie les seuils et déclenche des notifications

### 3. Dashboard UI

Accès : `/admin/system-health`

Fonctionnalités :
- 📊 Cartes KPI en temps réel avec indicateurs de statut
- 📈 Graphiques d'évolution sur 1 heure avec lignes de seuils
- ⚙️ Configuration des seuils d'alerte
- 🔔 Alerting automatique via Slack/Discord/Email
- 📉 Tendances (↗ hausse, ↘ baisse, → stable)

## Configuration du Cron Job

Pour collecter les métriques automatiquement toutes les 5 minutes :

```sql
-- Activer pg_cron si nécessaire
create extension if not exists pg_cron;

-- Créer le job de collecte des métriques (toutes les 5 minutes)
select cron.schedule(
  'collect-system-metrics',
  '*/5 * * * *', -- Toutes les 5 minutes
  $$
  select
    net.http_post(
      url := 'https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/collect-system-metrics',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU"}'::jsonb,
      body := '{}'::jsonb
    ) as request_id;
  $$
);
```

### Fréquences Alternatives

**Toutes les minutes** (pour une surveillance très fine) :
```sql
'* * * * *'
```

**Toutes les 15 minutes** (équilibre surveillance/coût) :
```sql
'*/15 * * * *'
```

**Toutes les heures** (surveillance légère) :
```sql
'0 * * * *'
```

## Alerting Automatique

### Déclenchement des Alertes

Quand une métrique dépasse un seuil :
1. ✅ Enregistrement de l'événement dans les logs
2. 📧 Notification envoyée via les canaux configurés
3. 🔔 Notification push aux admins (si activées)
4. 📊 Affichage dans le dashboard avec badge rouge/orange

### Configuration des Seuils

Via l'interface :
1. Aller sur `/admin/system-health`
2. Cliquer sur l'icône ⚙️ d'une carte KPI
3. Ajuster les seuils d'alerte et critique
4. Sauvegarder

Via SQL :
```sql
update system_health_thresholds
set 
  warning_threshold = 600,
  critical_threshold = 1200
where metric_name = 'avg_response_time_ms';
```

## Interprétation des Statuts

| Statut | Icône | Couleur | Signification |
|--------|-------|---------|---------------|
| **Healthy** | ✅ | Vert | Valeur dans les limites acceptables |
| **Warning** | ⚠️ | Orange | Seuil d'alerte dépassé - surveillance requise |
| **Critical** | 🚨 | Rouge | Seuil critique dépassé - action immédiate requise |

## Nettoyage Automatique

Pour éviter la croissance excessive de la table, configurez un nettoyage automatique :

```sql
-- Supprimer les métriques de plus de 30 jours (quotidien à 3h)
select cron.schedule(
  'cleanup-old-metrics',
  '0 3 * * *',
  $$
  delete from public.system_health_metrics
  where timestamp < now() - interval '30 days';
  $$
);
```

## Export des Rapports

Le dashboard inclut une fonctionnalité d'export :

### Excel (XLSX)
- 📊 Feuille "Données" : toutes les métriques des tests A/B
- 🤖 Feuille "Recommandations ML" : insights générés
- 📋 Feuille "Résumé" : statistiques globales
- 🎨 Auto-dimensionnement des colonnes

### PDF (via Impression)
- 📄 Format professionnel avec logo EmotionsCare
- 📈 Tables formatées et lisibles
- 🤖 Section recommandations ML
- 🖨️ Utilise la boîte de dialogue d'impression native

## Monitoring Avancé

### Graphiques Temps Réel

- **Courbe de tendance** : Évolution sur la dernière heure
- **Lignes de référence** : Seuils warning (orange) et critical (rouge) en pointillés
- **Rafraîchissement** : Automatique toutes les 10 secondes
- **Zoom** : Cliquer-glisser sur le graphique

### Indicateurs de Tendance

- **↗ Hausse** : Augmentation > 5% vs dernière mesure
- **↘ Baisse** : Diminution > 5% vs dernière mesure
- **→ Stable** : Variation < 5%

## Intégration avec Notifications

Les alertes de santé système sont automatiquement envoyées via :
- Slack/Discord (si webhooks configurés)
- Email (si RESEND_API_KEY configuré)
- Notifications push navigateur (si activées)

## API d'Accès

### Consulter les Métriques Récentes

```sql
select * from system_health_metrics
where metric_name = 'uptime_percentage'
  and timestamp > now() - interval '1 hour'
order by timestamp desc;
```

### Voir les Alertes Déclenchées

```sql
-- Via les logs de l'edge function
select * from edge_logs
where function_name = 'collect-system-metrics'
order by timestamp desc
limit 20;
```

## Dépannage

### Métriques Non Collectées

**Vérifications** :
1. Cron job actif : `select * from cron.job where jobname = 'collect-system-metrics'`
2. Historique : `select * from cron.job_run_details where jobid = (select jobid from cron.job where jobname = 'collect-system-metrics') order by start_time desc limit 5`
3. Logs edge function : Console Supabase → Functions → collect-system-metrics

### Alertes Non Envoyées

**Vérifications** :
1. Webhooks configurés et actifs
2. Seuils correctement définis dans `system_health_thresholds`
3. `enabled = true` pour les métriques
4. Logs de la fonction `send-notification`

## Bonnes Pratiques

1. **Ajuster les Seuils** : Basez-vous sur vos données historiques pour des seuils réalistes
2. **Surveillance Progressive** : Commencez avec des seuils larges, affinez progressivement
3. **Éviter les Faux Positifs** : Un seuil trop serré génère trop d'alertes
4. **Review Mensuelle** : Réévaluez les seuils selon l'évolution du système
5. **Documentation** : Documentez chaque changement de seuil et sa justification

---

**Note** : Les métriques CPU et Memory sont actuellement simulées. En production, intégrez des outils comme Prometheus ou les métriques Supabase pour des données réelles.
