# Configuration du Rapport Hebdomadaire Automatique

## 📧 Rapport par Email

Un rapport hebdomadaire est généré automatiquement et envoyé par email pour résumer :
- Résultats des tests A/B
- Tickets créés automatiquement
- Métriques de performance des escalades
- Statistiques globales

### Configuration Email

**⚠️ Important** : Avant de configurer le cron job, assurez-vous d'avoir :

1. **Configuré Resend.com** :
   - Un compte sur https://resend.com
   - Un domaine validé sur https://resend.com/domains
   - Une clé API créée sur https://resend.com/api-keys
   - La clé `RESEND_API_KEY` déjà configurée dans les secrets Supabase ✅

2. **Configuré l'email admin** :
   - Le secret `ADMIN_EMAIL` contient l'adresse email de destination
   - Par défaut : `admin@emotionscare.com`

### Contenu du Rapport

Le rapport hebdomadaire inclut :

#### 📊 Statistiques Clés
- **Tests A/B** : Total, significatifs, en cours
- **Tickets** : Total créé, confiance ML moyenne, répartition par intégration
- **Escalades** : Total, résolues, taux de résolution
- **Performance** : Taux de résolution moyen, temps moyen

#### 🧪 Top 5 Tests A/B
- Nom du test
- Statut (running, completed, cancelled)
- Gagnant actuel
- Niveau de confiance

#### 🎫 Top 5 Tickets Créés
- Numéro du ticket
- Assigné à
- Confiance ML
- Type d'intégration (Jira/Linear)

### Configuration du Cron Job

Pour recevoir automatiquement le rapport chaque lundi à 9h00, exécutez ce SQL dans Supabase :

```sql
-- Activer pg_cron si ce n'est pas déjà fait
create extension if not exists pg_cron;

-- Créer le cron job pour le rapport hebdomadaire (chaque lundi à 9h00)
select cron.schedule(
  'send-weekly-monitoring-report',
  '0 9 * * 1', -- Chaque lundi à 9h00 (format: minute heure jour mois jour_semaine)
  $$
  select
    net.http_post(
      url := 'https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/send-weekly-monitoring-report',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU"}'::jsonb,
      body := '{"manual_trigger": false}'::jsonb
    ) as request_id;
  $$
);
```

### Fréquences Alternatives

Si vous préférez une autre fréquence :

**Tous les vendredis à 17h00** (fin de semaine) :
```sql
'0 17 * * 5'
```

**Tous les jours à 8h00** (rapport quotidien) :
```sql
'0 8 * * *'
```

**Deux fois par semaine** (lundi et jeudi à 9h00) :
```sql
'0 9 * * 1,4'
```

**Premier jour du mois à 9h00** (rapport mensuel) :
```sql
'0 9 1 * *'
```

### Test Manuel

Pour tester l'envoi du rapport sans attendre le cron :

```bash
curl -X POST \
  https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/send-weekly-monitoring-report \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU" \
  -d '{"manual_trigger": true}'
```

### Vérification

1. **Vérifier le cron job** :
```sql
select * from cron.job where jobname = 'send-weekly-monitoring-report';
```

2. **Voir l'historique des exécutions** :
```sql
select * from cron.job_run_details 
where jobid = (select jobid from cron.job where jobname = 'send-weekly-monitoring-report')
order by start_time desc 
limit 10;
```

3. **Supprimer le cron job** (si nécessaire) :
```sql
select cron.unschedule('send-weekly-monitoring-report');
```

### Design du Rapport

Le rapport est formaté en HTML responsive avec :
- 📊 Header avec gradient violet
- 📈 4 cartes de statistiques avec bordures colorées
- 📋 Tableaux détaillés des tests A/B et tickets
- 🎨 Design professionnel et lisible sur mobile/desktop

---

**Note** : Assurez-vous que `RESEND_API_KEY` et `ADMIN_EMAIL` sont configurés avant de lancer le cron job.
