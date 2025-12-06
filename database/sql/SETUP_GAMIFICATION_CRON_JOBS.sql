-- ================================================
-- CRON JOBS CONFIGURATION FOR GAMIFICATION SYSTEM
-- EmotionsCare - Défis Quotidiens & Leaderboard
-- ================================================
--
-- IMPORTANT: This script must be executed manually via Supabase SQL Editor
-- as it contains project-specific URLs and API keys.
--
-- ================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ================================================
-- 1. DAILY CHALLENGES GENERATION
-- Runs every day at midnight UTC (00:00)
-- ================================================

SELECT cron.schedule(
  'generate-daily-challenges-midnight',
  '0 0 * * *', -- Every day at midnight UTC
  $$
  SELECT
    net.http_post(
        url:='https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/generate-daily-challenges',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

-- ================================================
-- 2. LEADERBOARD RANKING CALCULATION
-- Runs every hour to refresh rankings
-- ================================================

SELECT cron.schedule(
  'calculate-rankings-hourly',
  '0 * * * *', -- Every hour at :00
  $$
  SELECT
    net.http_post(
        url:='https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/calculate-rankings',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

-- ================================================
-- MONITORING QUERIES
-- ================================================

-- List all active cron jobs
-- SELECT * FROM cron.job;

-- View recent cron job executions
-- SELECT * FROM cron.job_run_details 
-- ORDER BY start_time DESC 
-- LIMIT 20;

-- ================================================
-- ERROR MONITORING
-- ================================================

-- View failed cron job executions
-- SELECT 
--   jobid,
--   job_name,
--   status,
--   return_message,
--   start_time,
--   end_time
-- FROM cron.job_run_details 
-- WHERE status = 'failed'
-- ORDER BY start_time DESC
-- LIMIT 10;

-- ================================================
-- JOB MANAGEMENT (commented out for safety)
-- ================================================

-- Disable daily challenges generation:
-- SELECT cron.unschedule('generate-daily-challenges-midnight');

-- Disable rankings calculation:
-- SELECT cron.unschedule('calculate-rankings-hourly');

-- ================================================
-- IMPORTANT NOTES
-- ================================================
-- 
-- Cron Schedule Syntax: (minute hour day-of-month month day-of-week)
-- - '0 0 * * *'    = Every day at midnight (00:00 UTC)
-- - '0 * * * *'    = Every hour at :00
-- - '*/15 * * * *' = Every 15 minutes
-- - '0 2 * * *'    = Every day at 2:00 AM UTC
-- - '0 0 * * 0'    = Every Sunday at midnight
-- - '0 0 1 * *'    = First day of every month at midnight
--
-- For more info on pg_cron: https://supabase.com/docs/guides/database/extensions/pg_cron
-- For cron syntax: https://crontab.guru/
--
-- Edge Functions logs can be viewed in Supabase Dashboard:
-- Functions > [function-name] > Logs
-- ================================================
