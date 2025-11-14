-- Migration: Create materialized views for VR weekly aggregates
-- Created: 2025-11-14
-- Description: Create materialized views for weekly VR metrics (Nebula & Dome)

-- ============================================
-- 1. VR NEBULA WEEKLY AGGREGATES (User Level)
-- ============================================

CREATE MATERIALIZED VIEW IF NOT EXISTS vr_nebula_weekly_user AS
SELECT
  user_id,
  DATE_TRUNC('week', ts_start) AS week_start,
  COUNT(*) AS session_count,
  SUM(duration_s) AS total_duration_s,
  AVG(duration_s) AS avg_duration_s,
  AVG(resp_rate_avg) AS avg_resp_rate,
  AVG(hrv_pre) AS avg_hrv_pre,
  AVG(hrv_post) AS avg_hrv_post,
  AVG(rmssd_delta) AS avg_rmssd_delta,
  AVG(coherence_score) AS avg_coherence_score,
  MAX(coherence_score) AS max_coherence_score,
  MIN(ts_start) AS first_session_at,
  MAX(ts_start) AS last_session_at,
  CURRENT_TIMESTAMP AS refreshed_at
FROM vr_nebula_sessions
WHERE ts_start >= CURRENT_DATE - INTERVAL '365 days' -- Keep 1 year of data
GROUP BY user_id, DATE_TRUNC('week', ts_start);

-- Index for fast user lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_vr_nebula_weekly_user_pk
ON vr_nebula_weekly_user(user_id, week_start);

CREATE INDEX IF NOT EXISTS idx_vr_nebula_weekly_user_week
ON vr_nebula_weekly_user(week_start DESC);

COMMENT ON MATERIALIZED VIEW vr_nebula_weekly_user IS
'Weekly aggregates for VR Nebula sessions per user - refreshed daily';

-- ============================================
-- 2. VR DOME WEEKLY AGGREGATES (User Level)
-- ============================================

CREATE MATERIALIZED VIEW IF NOT EXISTS vr_dome_weekly_user AS
SELECT
  user_id,
  DATE_TRUNC('week', ts) AS week_start,
  COUNT(*) AS session_count,
  COUNT(DISTINCT session_id) AS unique_sessions,
  AVG(hr_mean) AS avg_hr_mean,
  AVG(hr_std) AS avg_hr_std,
  AVG(valence) AS avg_valence,
  AVG(valence_avg) AS avg_valence_avg,
  AVG(synchrony_idx) AS avg_synchrony_idx,
  AVG(group_sync_idx) AS avg_group_sync_idx,
  AVG(team_pa) AS avg_team_pa,
  MIN(ts_join) AS first_session_at,
  MAX(COALESCE(ts_leave, ts_join)) AS last_session_at,
  CURRENT_TIMESTAMP AS refreshed_at
FROM vr_dome_sessions
WHERE ts >= CURRENT_DATE - INTERVAL '365 days' -- Keep 1 year of data
GROUP BY user_id, DATE_TRUNC('week', ts);

-- Index for fast user lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_vr_dome_weekly_user_pk
ON vr_dome_weekly_user(user_id, week_start);

CREATE INDEX IF NOT EXISTS idx_vr_dome_weekly_user_week
ON vr_dome_weekly_user(week_start DESC);

COMMENT ON MATERIALIZED VIEW vr_dome_weekly_user IS
'Weekly aggregates for VR Dome sessions per user - refreshed daily';

-- ============================================
-- 3. VR COMBINED WEEKLY AGGREGATES (User Level)
-- ============================================

-- Combines both Nebula and Dome sessions for overall VR activity
CREATE MATERIALIZED VIEW IF NOT EXISTS vr_combined_weekly_user AS
SELECT
  COALESCE(n.user_id, d.user_id) AS user_id,
  COALESCE(n.week_start, d.week_start) AS week_start,
  COALESCE(n.session_count, 0) AS nebula_sessions,
  COALESCE(d.session_count, 0) AS dome_sessions,
  COALESCE(n.session_count, 0) + COALESCE(d.session_count, 0) AS total_sessions,
  COALESCE(n.total_duration_s, 0) AS nebula_duration_s,
  COALESCE(n.avg_coherence_score, 0) AS avg_coherence_score,
  COALESCE(d.avg_synchrony_idx, 0) AS avg_synchrony_idx,
  COALESCE(d.avg_team_pa, 0) AS avg_team_pa,
  LEAST(n.first_session_at, d.first_session_at) AS first_session_at,
  GREATEST(n.last_session_at, d.last_session_at) AS last_session_at,
  CURRENT_TIMESTAMP AS refreshed_at
FROM vr_nebula_weekly_user n
FULL OUTER JOIN vr_dome_weekly_user d
  ON n.user_id = d.user_id AND n.week_start = d.week_start;

-- Index for fast user lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_vr_combined_weekly_user_pk
ON vr_combined_weekly_user(user_id, week_start);

CREATE INDEX IF NOT EXISTS idx_vr_combined_weekly_user_week
ON vr_combined_weekly_user(week_start DESC);

COMMENT ON MATERIALIZED VIEW vr_combined_weekly_user IS
'Combined weekly aggregates for all VR sessions (Nebula + Dome) per user';

-- ============================================
-- 4. ORGANIZATION-LEVEL WEEKLY AGGREGATES
-- ============================================

-- Note: Requires organization_members table linking users to orgs
CREATE MATERIALIZED VIEW IF NOT EXISTS vr_weekly_org AS
SELECT
  om.organization_id,
  c.week_start,
  COUNT(DISTINCT c.user_id) AS active_users,
  SUM(c.total_sessions) AS total_sessions,
  SUM(c.nebula_sessions) AS total_nebula_sessions,
  SUM(c.dome_sessions) AS total_dome_sessions,
  SUM(c.nebula_duration_s) AS total_nebula_duration_s,
  AVG(c.avg_coherence_score) AS avg_coherence_score,
  AVG(c.avg_synchrony_idx) AS avg_synchrony_idx,
  AVG(c.avg_team_pa) AS avg_team_pa,
  CURRENT_TIMESTAMP AS refreshed_at
FROM vr_combined_weekly_user c
LEFT JOIN organization_members om ON c.user_id = om.user_id
WHERE om.organization_id IS NOT NULL
GROUP BY om.organization_id, c.week_start;

-- Index for fast organization lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_vr_weekly_org_pk
ON vr_weekly_org(organization_id, week_start);

CREATE INDEX IF NOT EXISTS idx_vr_weekly_org_week
ON vr_weekly_org(week_start DESC);

COMMENT ON MATERIALIZED VIEW vr_weekly_org IS
'Weekly aggregates for VR sessions at organization level';

-- ============================================
-- 5. REFRESH FUNCTIONS
-- ============================================

-- Function to refresh all VR weekly views
CREATE OR REPLACE FUNCTION refresh_vr_weekly_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Refresh in dependency order
  REFRESH MATERIALIZED VIEW CONCURRENTLY vr_nebula_weekly_user;
  REFRESH MATERIALIZED VIEW CONCURRENTLY vr_dome_weekly_user;
  REFRESH MATERIALIZED VIEW CONCURRENTLY vr_combined_weekly_user;
  REFRESH MATERIALIZED VIEW CONCURRENTLY vr_weekly_org;

  RAISE NOTICE 'VR weekly materialized views refreshed at %', CURRENT_TIMESTAMP;
END;
$$;

COMMENT ON FUNCTION refresh_vr_weekly_views() IS
'Refresh all VR weekly materialized views - should be called daily via cron';

-- Initial refresh
SELECT refresh_vr_weekly_views();

-- ============================================
-- 6. GRANT PERMISSIONS
-- ============================================

-- Allow authenticated users to read their own data
GRANT SELECT ON vr_nebula_weekly_user TO authenticated;
GRANT SELECT ON vr_dome_weekly_user TO authenticated;
GRANT SELECT ON vr_combined_weekly_user TO authenticated;
GRANT SELECT ON vr_weekly_org TO authenticated;

-- Service role can refresh views
GRANT EXECUTE ON FUNCTION refresh_vr_weekly_views() TO service_role;

-- ============================================
-- 7. SETUP AUTOMATIC REFRESH (via pg_cron)
-- ============================================

-- Note: Requires pg_cron extension
-- This will refresh views daily at 2 AM UTC
-- Uncomment if pg_cron is available:

/*
SELECT cron.schedule(
  'refresh-vr-weekly-views',
  '0 2 * * *', -- Every day at 2 AM UTC
  'SELECT refresh_vr_weekly_views();'
);
*/

-- Alternative: Can be triggered via edge function called by external cron
