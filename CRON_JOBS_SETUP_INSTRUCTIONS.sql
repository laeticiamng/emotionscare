-- ════════════════════════════════════════════════════════════════════════════
-- CONFIGURATION DES CRON JOBS SUPABASE
-- ════════════════════════════════════════════════════════════════════════════
-- 
-- ⚠️ IMPORTANT: Ce fichier doit être exécuté MANUELLEMENT dans l'éditeur SQL Supabase
-- Ne PAS utiliser via migration automatique car il contient des données spécifiques au projet
--
-- Prérequis:
-- 1. Extensions pg_cron et pg_net activées dans Supabase
-- 2. Edge functions déployées: collect-system-metrics, send-weekly-monitoring-report
-- 3. Secrets configurés: RESEND_API_KEY, ADMIN_EMAIL
--
-- Instructions:
-- 1. Remplacer YOUR_PROJECT_ID par votre véritable Project ID Supabase
-- 2. Remplacer YOUR_ANON_KEY par votre clé anon Supabase
-- 3. Copier-coller ce script dans l'éditeur SQL Supabase (Dashboard > SQL Editor)
-- 4. Exécuter le script
-- 5. Vérifier les jobs créés avec: SELECT * FROM cron.job;
--
-- ════════════════════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────────────────────
-- 1. ACTIVER LES EXTENSIONS REQUISES
-- ────────────────────────────────────────────────────────────────────────────

-- Extension pg_cron pour la planification
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- Extension pg_net pour les appels HTTP
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Vérifier les extensions
SELECT * FROM pg_extension WHERE extname IN ('pg_cron', 'pg_net');

-- ────────────────────────────────────────────────────────────────────────────
-- 2. SUPPRIMER LES JOBS EXISTANTS (si rejouez le script)
-- ────────────────────────────────────────────────────────────────────────────

-- Supprimer les anciens jobs s'ils existent
SELECT cron.unschedule('collect-system-metrics-job');
SELECT cron.unschedule('weekly-monitoring-report-job');

-- ────────────────────────────────────────────────────────────────────────────
-- 3. CONFIGURER LES VARIABLES DU PROJET
-- ────────────────────────────────────────────────────────────────────────────

-- ⚠️ REMPLACER CES VALEURS PAR VOS VRAIES VALEURS
DO $$
DECLARE
  project_url TEXT := 'https://YOUR_PROJECT_ID.supabase.co';  -- ⚠️ MODIFIER ICI
  anon_key TEXT := 'YOUR_ANON_KEY';  -- ⚠️ MODIFIER ICI (clé publique, pas service role)
BEGIN
  -- Afficher les valeurs pour vérification
  RAISE NOTICE 'Project URL: %', project_url;
  RAISE NOTICE 'Anon Key: %', LEFT(anon_key, 20) || '...';
  
  -- Vérifier que les valeurs ont été modifiées
  IF project_url LIKE '%YOUR_PROJECT_ID%' OR anon_key = 'YOUR_ANON_KEY' THEN
    RAISE EXCEPTION 'ERREUR: Vous devez remplacer YOUR_PROJECT_ID et YOUR_ANON_KEY par vos vraies valeurs!';
  END IF;
END $$;

-- ────────────────────────────────────────────────────────────────────────────
-- 4. CRON JOB #1: COLLECTE MÉTRIQUES SYSTÈME (toutes les 5 minutes)
-- ────────────────────────────────────────────────────────────────────────────

SELECT cron.schedule(
  'collect-system-metrics-job',
  '*/5 * * * *',  -- Toutes les 5 minutes
  $$
  SELECT
    net.http_post(
      url := 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/collect-system-metrics',  -- ⚠️ MODIFIER ICI
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR_ANON_KEY'  -- ⚠️ MODIFIER ICI
      ),
      body := jsonb_build_object(
        'timestamp', now()
      )
    ) as request_id;
  $$
);

-- Vérifier création du job
SELECT jobid, schedule, command, nodename, nodeport, database, username, active, jobname 
FROM cron.job 
WHERE jobname = 'collect-system-metrics-job';

-- ────────────────────────────────────────────────────────────────────────────
-- 5. CRON JOB #2: RAPPORT HEBDOMADAIRE (chaque lundi à 9h00)
-- ────────────────────────────────────────────────────────────────────────────

SELECT cron.schedule(
  'weekly-monitoring-report-job',
  '0 9 * * 1',  -- Chaque lundi à 9h00 (heure serveur UTC)
  $$
  SELECT
    net.http_post(
      url := 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/send-weekly-monitoring-report',  -- ⚠️ MODIFIER ICI
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR_ANON_KEY'  -- ⚠️ MODIFIER ICI
      ),
      body := jsonb_build_object(
        'report_date', CURRENT_DATE,
        'period', 'weekly'
      )
    ) as request_id;
  $$
);

-- Vérifier création du job
SELECT jobid, schedule, command, nodename, nodeport, database, username, active, jobname 
FROM cron.job 
WHERE jobname = 'weekly-monitoring-report-job';

-- ────────────────────────────────────────────────────────────────────────────
-- 6. VÉRIFICATIONS FINALES
-- ────────────────────────────────────────────────────────────────────────────

-- Lister tous les jobs actifs
SELECT 
  jobid,
  jobname,
  schedule,
  active,
  database
FROM cron.job
ORDER BY jobname;

-- Voir l'historique d'exécution des jobs (dernières 24h)
SELECT 
  job.jobname,
  run.status,
  run.start_time,
  run.end_time,
  run.return_message
FROM cron.job_run_details run
JOIN cron.job job ON run.jobid = job.jobid
WHERE run.start_time > NOW() - INTERVAL '24 hours'
ORDER BY run.start_time DESC
LIMIT 20;

-- ────────────────────────────────────────────────────────────────────────────
-- 7. COMMANDES UTILES POUR LA MAINTENANCE
-- ────────────────────────────────────────────────────────────────────────────

-- Désactiver temporairement un job (sans le supprimer)
-- SELECT cron.alter_job(
--   job_id := (SELECT jobid FROM cron.job WHERE jobname = 'collect-system-metrics-job'),
--   schedule := NULL  -- Le désactive
-- );

-- Réactiver un job
-- SELECT cron.alter_job(
--   job_id := (SELECT jobid FROM cron.job WHERE jobname = 'collect-system-metrics-job'),
--   schedule := '*/5 * * * *'  -- Le réactive avec son schedule
-- );

-- Supprimer un job définitivement
-- SELECT cron.unschedule('collect-system-metrics-job');

-- Tester manuellement un appel (remplacer les valeurs)
-- SELECT
--   net.http_post(
--     url := 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/collect-system-metrics',
--     headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
--   ) as request_id;

-- ────────────────────────────────────────────────────────────────────────────
-- 8. NOTES IMPORTANTES
-- ────────────────────────────────────────────────────────────────────────────

-- 📝 FUSEAUX HORAIRES
-- Les cron jobs utilisent le fuseau horaire du serveur Supabase (généralement UTC)
-- Pour Paris (UTC+1 en hiver, UTC+2 en été), ajuster l'heure du cron :
-- - 9h Paris hiver (UTC+1) = 8h UTC → '0 8 * * 1'
-- - 9h Paris été (UTC+2) = 7h UTC → '0 7 * * 1'

-- 📝 SYNTAXE CRON
-- ┌───────────── minute (0 - 59)
-- │ ┌─────────── heure (0 - 23)
-- │ │ ┌───────── jour du mois (1 - 31)
-- │ │ │ ┌─────── mois (1 - 12)
-- │ │ │ │ ┌───── jour de la semaine (0 - 6) (0 = dimanche)
-- │ │ │ │ │
-- * * * * *
--
-- Exemples :
-- '*/5 * * * *'     = Toutes les 5 minutes
-- '0 9 * * 1'       = Chaque lundi à 9h00
-- '0 0 * * *'       = Chaque jour à minuit
-- '0 */6 * * *'     = Toutes les 6 heures
-- '0 9 1 * *'       = Le 1er de chaque mois à 9h00

-- 📝 MONITORING
-- Surveiller régulièrement cron.job_run_details pour détecter les échecs
-- Configurer des alertes si return_message contient 'failed' ou 'error'

-- 📝 LIMITES
-- Supabase Free Tier : 2 cron jobs maximum
-- Supabase Pro : Illimité
-- Durée max exécution : 5 minutes (timeout edge function)

-- ════════════════════════════════════════════════════════════════════════════
-- FIN DU SCRIPT DE CONFIGURATION
-- ════════════════════════════════════════════════════════════════════════════

-- ✅ Si aucune erreur, vos cron jobs sont configurés !
-- ✅ Vérifier dans quelques minutes que les métriques sont collectées
-- ✅ Attendre lundi prochain 9h pour vérifier le rapport hebdomadaire
-- 
-- 📧 Questions ? support@emotionscare.com
