CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Supprime un éventuel job existant pour idempotence
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'governance-slo-collect-hourly') THEN
    PERFORM cron.unschedule('governance-slo-collect-hourly');
  END IF;
END$$;

-- Planifie la collecte SLO toutes les heures à la minute 0
SELECT cron.schedule(
  'governance-slo-collect-hourly',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/governance-slo-collect',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU'
    ),
    body := jsonb_build_object('triggered_by', 'cron', 'time', now())
  );
  $$
);