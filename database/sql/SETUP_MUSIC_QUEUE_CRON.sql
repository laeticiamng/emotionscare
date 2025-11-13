-- =====================================================
-- Configuration du Cron Job pour la Queue Musicale
-- =====================================================
--
-- Ce script configure un job cron qui exécute automatiquement
-- le worker de la queue musicale toutes les minutes.
--
-- ⚠️ INSTRUCTIONS IMPORTANTES :
-- 1. Ce script DOIT être exécuté MANUELLEMENT via le SQL Editor de Supabase
-- 2. Il contient des URLs et des clés spécifiques à votre projet
-- 3. NE PAS inclure ce script dans les migrations automatiques
--
-- =====================================================

-- 1. Activer les extensions nécessaires
-- =====================================================
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Créer le job cron pour le worker de la queue musicale
-- =====================================================
-- Ce job s'exécute toutes les minutes et appelle l'edge function
-- music-queue-worker pour traiter les demandes en attente

SELECT cron.schedule(
  'music-queue-worker-every-minute',
  '* * * * *', -- Toutes les minutes
  $$
  SELECT
    net.http_post(
        url:='https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/music-queue-worker',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU"}'::jsonb,
        body:=concat('{"triggered_at": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

-- =====================================================
-- Vérification et Monitoring
-- =====================================================

-- Vérifier que le job est bien créé
SELECT * FROM cron.job WHERE jobname = 'music-queue-worker-every-minute';

-- Voir l'historique d'exécution (dernières 20 exécutions)
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
WHERE jobid = (
  SELECT jobid 
  FROM cron.job 
  WHERE jobname = 'music-queue-worker-every-minute'
)
ORDER BY start_time DESC 
LIMIT 20;

-- =====================================================
-- Voir les erreurs récentes
-- =====================================================
SELECT 
  start_time,
  status,
  return_message
FROM cron.job_run_details 
WHERE jobid = (
  SELECT jobid 
  FROM cron.job 
  WHERE jobname = 'music-queue-worker-every-minute'
)
AND status = 'failed'
ORDER BY start_time DESC 
LIMIT 10;

-- =====================================================
-- Gestion du Job
-- =====================================================

-- Désactiver temporairement le job
-- SELECT cron.unschedule('music-queue-worker-every-minute');

-- Réactiver le job après désactivation
-- Il faut recréer le job avec la commande SELECT cron.schedule ci-dessus

-- Supprimer définitivement le job
-- SELECT cron.unschedule('music-queue-worker-every-minute');

-- =====================================================
-- Informations complémentaires
-- =====================================================

-- Fréquences alternatives (à modifier dans la commande cron.schedule) :
-- * * * * *        : Toutes les minutes (actuel)
-- */2 * * * *      : Toutes les 2 minutes
-- */5 * * * *      : Toutes les 5 minutes
-- */15 * * * *     : Toutes les 15 minutes
-- 0 * * * *        : Toutes les heures
-- 0 */2 * * *      : Toutes les 2 heures

-- Pour modifier la fréquence :
-- 1. Désactiver le job actuel avec cron.unschedule
-- 2. Recréer le job avec la nouvelle fréquence

-- Documentation pg_cron :
-- https://supabase.com/docs/guides/database/extensions/pg_cron

-- =====================================================
-- Fonctionnement du système
-- =====================================================
--
-- 1. Le cron job appelle music-queue-worker toutes les minutes
-- 2. Le worker récupère jusqu'à 5 demandes en attente
-- 3. Pour chaque demande :
--    - Marque comme "processing"
--    - Appelle emotion-music-ai pour générer la musique
--    - Marque comme "completed" ou "failed"
--    - Effectue des retries automatiques en cas d'échec
-- 4. Rate limiting : 2 secondes entre chaque génération
-- 5. L'API Suno est vérifiée avant le traitement
-- 6. Les logs sont accessibles dans Supabase Edge Functions
--
-- =====================================================
