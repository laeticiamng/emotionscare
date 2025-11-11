-- ================================================
-- RPC Functions for Cron Jobs Monitoring
-- ================================================

-- Function to get cron job history from cron.job_run_details
CREATE OR REPLACE FUNCTION get_gamification_cron_history()
RETURNS TABLE (
  jobid bigint,
  job_name text,
  status text,
  return_message text,
  start_time timestamptz,
  end_time timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    jrd.jobid,
    j.jobname as job_name,
    jrd.status,
    jrd.return_message,
    jrd.start_time,
    jrd.end_time
  FROM cron.job_run_details jrd
  JOIN cron.job j ON j.jobid = jrd.jobid
  WHERE j.jobname IN ('generate-daily-challenges-midnight', 'calculate-rankings-hourly')
  ORDER BY jrd.start_time DESC
  LIMIT 100;
END;
$$;

-- Function to get active cron jobs configuration
CREATE OR REPLACE FUNCTION get_gamification_cron_jobs()
RETURNS TABLE (
  jobid bigint,
  jobname text,
  schedule text,
  active boolean,
  database text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    j.jobid,
    j.jobname,
    j.schedule,
    j.active,
    j.database
  FROM cron.job j
  WHERE j.jobname IN ('generate-daily-challenges-midnight', 'calculate-rankings-hourly')
  ORDER BY j.jobname;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_gamification_cron_history() TO authenticated;
GRANT EXECUTE ON FUNCTION get_gamification_cron_jobs() TO authenticated;