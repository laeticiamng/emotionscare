-- ============================================
-- Fonctions RPC pour le monitoring des jobs cron
-- ============================================

-- Fonction pour récupérer l'historique des jobs cron
-- Note: Cette fonction retourne des données simulées car pg_cron
-- n'expose pas directement cron.job_run_details via RPC en production
CREATE OR REPLACE FUNCTION public.get_cron_job_history()
RETURNS TABLE (
  job_name text,
  status text,
  last_run timestamptz,
  next_run timestamptz,
  execution_count bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Retourner les statistiques depuis nos tables de tracking
  RETURN QUERY
  SELECT 
    'scheduled-pdf-reports'::text as job_name,
    'completed'::text as status,
    MAX(generated_at) as last_run,
    (MAX(generated_at) + interval '1 hour')::timestamptz as next_run,
    COUNT(*)::bigint as execution_count
  FROM compliance_reports
  WHERE status = 'completed'
  
  UNION ALL
  
  SELECT 
    'pdf-notifications'::text as job_name,
    'completed'::text as status,
    MAX(created_at) as last_run,
    (MAX(created_at) + interval '8 hours')::timestamptz as next_run,
    COUNT(*)::bigint as execution_count
  FROM realtime_notifications
  WHERE type = 'report_ready';
END;
$$;

-- Fonction pour récupérer la liste des jobs cron configurés
CREATE OR REPLACE FUNCTION public.get_cron_jobs_list()
RETURNS TABLE (
  jobid bigint,
  jobname text,
  schedule text,
  active boolean,
  last_run timestamptz
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Retourner les jobs configurés (données statiques pour cette version)
  RETURN QUERY
  SELECT 
    1::bigint as jobid,
    'scheduled-pdf-reports'::text as jobname,
    '0 * * * *'::text as schedule,
    true as active,
    (SELECT MAX(generated_at) FROM compliance_reports) as last_run
  
  UNION ALL
  
  SELECT 
    2::bigint as jobid,
    'pdf-notifications'::text as jobname,
    '0 8,16 * * *'::text as schedule,
    true as active,
    (SELECT MAX(created_at) FROM realtime_notifications WHERE type = 'report_ready') as last_run;
END;
$$;

-- Accorder les permissions
GRANT EXECUTE ON FUNCTION public.get_cron_job_history() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_cron_jobs_list() TO authenticated;