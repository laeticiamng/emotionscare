-- ============================================
-- Configuration pg_cron pour EmotionsCare RGPD
-- ============================================
-- Ce fichier configure les jobs cron automatiques
-- pour les fonctions scheduled-pdf-reports et pdf-notifications
--
-- IMPORTANT: Ces commandes doivent être exécutées manuellement
-- via l'interface Supabase SQL Editor, car elles contiennent
-- des informations spécifiques au projet (URL, clés API)
-- ============================================

-- 1. Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Configurer le job pour les rapports PDF planifiés
-- Exécuté toutes les heures pour vérifier les rapports à générer
SELECT cron.schedule(
  'scheduled-pdf-reports-hourly',
  '0 * * * *', -- Toutes les heures à la minute 0
  $$
  SELECT net.http_post(
    url:='https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/scheduled-pdf-reports',
    headers:=jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU'
    ),
    body:=jsonb_build_object(
      'time', now()::text
    )
  ) as request_id;
  $$
);

-- 3. Configurer le job pour les notifications PDF
-- Exécuté deux fois par jour (8h et 16h) pour envoyer les notifications
SELECT cron.schedule(
  'pdf-notifications-twice-daily',
  '0 8,16 * * *', -- À 8h00 et 16h00 tous les jours
  $$
  SELECT net.http_post(
    url:='https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/pdf-notifications',
    headers:=jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU'
    ),
    body:=jsonb_build_object(
      'time', now()::text
    )
  ) as request_id;
  $$
);

-- ============================================
-- Vérification des jobs configurés
-- ============================================

-- Lister tous les jobs cron actifs
SELECT 
  jobid,
  schedule,
  command,
  nodename,
  nodeport,
  database,
  username,
  active,
  jobname
FROM cron.job
ORDER BY jobid;

-- ============================================
-- Monitoring des exécutions
-- ============================================

-- Voir l'historique des exécutions (dernières 50)
SELECT 
  runid,
  jobid,
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
LIMIT 50;

-- Voir uniquement les échecs récents
SELECT 
  runid,
  jobid,
  status,
  return_message,
  start_time
FROM cron.job_run_details
WHERE status = 'failed'
ORDER BY start_time DESC
LIMIT 20;

-- ============================================
-- Gestion des jobs (si besoin)
-- ============================================

-- Désactiver temporairement un job
-- SELECT cron.unschedule('scheduled-pdf-reports-hourly');
-- SELECT cron.unschedule('pdf-notifications-twice-daily');

-- Réactiver un job (re-exécuter les commandes SELECT cron.schedule ci-dessus)

-- Supprimer définitivement un job
-- SELECT cron.unschedule('scheduled-pdf-reports-hourly');

-- ============================================
-- Notes importantes
-- ============================================
-- 
-- 1. Fréquences recommandées:
--    - scheduled-pdf-reports: Toutes les heures (0 * * * *)
--    - pdf-notifications: 2x/jour à 8h et 16h (0 8,16 * * *)
--
-- 2. Pour modifier la fréquence:
--    - D'abord désactiver: SELECT cron.unschedule('nom-du-job');
--    - Puis recréer avec nouvelle fréquence
--
-- 3. Syntaxe cron (5 champs):
--    ┌───────────── minute (0 - 59)
--    │ ┌───────────── heure (0 - 23)
--    │ │ ┌───────────── jour du mois (1 - 31)
--    │ │ │ ┌───────────── mois (1 - 12)
--    │ │ │ │ ┌───────────── jour de la semaine (0 - 6, 0=dimanche)
--    │ │ │ │ │
--    * * * * *
--
-- 4. Exemples de fréquences:
--    - Toutes les 15 minutes: */15 * * * *
--    - Tous les jours à minuit: 0 0 * * *
--    - Tous les lundis à 9h: 0 9 * * 1
--    - Premier jour du mois: 0 0 1 * *
--
-- 5. Les logs des edge functions sont visibles dans:
--    Supabase Dashboard > Edge Functions > Logs
--
-- ============================================
