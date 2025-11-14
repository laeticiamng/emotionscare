-- Migration: Create refresh function for breath weekly aggregates
-- Created: 2025-11-14
-- Description: Populate breath_weekly_metrics from breathwork_sessions

-- ============================================
-- 1. REFRESH FUNCTION FOR USER BREATH METRICS
-- ============================================

CREATE OR REPLACE FUNCTION refresh_breath_weekly_user_metrics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert or update weekly breath metrics for each user
  INSERT INTO breath_weekly_metrics (
    user_id,
    week_start,
    hrv_stress_idx,
    coherence_avg,
    mvpa_week,
    relax_idx,
    mindfulness_avg,
    mood_score,
    created_at,
    updated_at
  )
  SELECT
    bs.user_id,
    DATE_TRUNC('week', bs.created_at)::DATE AS week_start,
    -- HRV Stress Index: Based on stress level reduction
    AVG(
      CASE
        WHEN bs.stress_level_before IS NOT NULL AND bs.stress_level_after IS NOT NULL
        THEN 100.0 - ((bs.stress_level_after::DECIMAL / bs.stress_level_before::DECIMAL) * 100.0)
        ELSE NULL
      END
    )::DECIMAL(5,2) AS hrv_stress_idx,
    -- Coherence average
    AVG(bs.coherence_score)::DECIMAL(5,2) AS coherence_avg,
    -- MVPA: Sum of duration as proxy for moderate activity minutes
    SUM(bs.duration)::INTEGER AS mvpa_week,
    -- Relax index: Based on stress reduction
    AVG(
      CASE
        WHEN bs.stress_level_before IS NOT NULL AND bs.stress_level_after IS NOT NULL
        THEN (bs.stress_level_before - bs.stress_level_after)::DECIMAL * 10.0
        ELSE NULL
      END
    )::DECIMAL(5,2) AS relax_idx,
    -- Mindfulness: Based on coherence and session count
    (AVG(bs.coherence_score) * (COUNT(*)::DECIMAL / 7.0))::DECIMAL(5,2) AS mindfulness_avg,
    -- Mood score: Inverse of stress level after
    AVG(
      CASE
        WHEN bs.stress_level_after IS NOT NULL
        THEN (10.0 - bs.stress_level_after::DECIMAL) * 10.0
        ELSE NULL
      END
    )::DECIMAL(5,2) AS mood_score,
    MIN(bs.created_at) AS created_at,
    CURRENT_TIMESTAMP AS updated_at
  FROM breathwork_sessions bs
  WHERE bs.created_at >= CURRENT_DATE - INTERVAL '365 days' -- Last year
  GROUP BY bs.user_id, DATE_TRUNC('week', bs.created_at)::DATE
  ON CONFLICT (user_id, week_start)
  DO UPDATE SET
    hrv_stress_idx = EXCLUDED.hrv_stress_idx,
    coherence_avg = EXCLUDED.coherence_avg,
    mvpa_week = EXCLUDED.mvpa_week,
    relax_idx = EXCLUDED.relax_idx,
    mindfulness_avg = EXCLUDED.mindfulness_avg,
    mood_score = EXCLUDED.mood_score,
    updated_at = CURRENT_TIMESTAMP;

  RAISE NOTICE 'Breath weekly user metrics refreshed at %', CURRENT_TIMESTAMP;
END;
$$;

COMMENT ON FUNCTION refresh_breath_weekly_user_metrics() IS
'Refresh weekly breath metrics for all users from breathwork_sessions - should be called daily';

-- ============================================
-- 2. REFRESH FUNCTION FOR ORG BREATH METRICS
-- ============================================

CREATE OR REPLACE FUNCTION refresh_breath_weekly_org_metrics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert or update weekly breath org metrics
  INSERT INTO breath_weekly_org_metrics (
    org_id,
    week_start,
    members,
    org_hrv_idx,
    org_coherence,
    org_mvpa,
    org_relax,
    org_mindfulness,
    org_mood,
    created_at,
    updated_at
  )
  SELECT
    om.organization_id AS org_id,
    bwm.week_start,
    COUNT(DISTINCT bwm.user_id)::INTEGER AS members,
    AVG(bwm.hrv_stress_idx)::DECIMAL(5,2) AS org_hrv_idx,
    AVG(bwm.coherence_avg)::DECIMAL(5,2) AS org_coherence,
    SUM(bwm.mvpa_week)::INTEGER AS org_mvpa,
    AVG(bwm.relax_idx)::DECIMAL(5,2) AS org_relax,
    AVG(bwm.mindfulness_avg)::DECIMAL(5,2) AS org_mindfulness,
    AVG(bwm.mood_score)::DECIMAL(5,2) AS org_mood,
    MIN(bwm.created_at) AS created_at,
    CURRENT_TIMESTAMP AS updated_at
  FROM breath_weekly_metrics bwm
  LEFT JOIN organization_members om ON bwm.user_id = om.user_id
  WHERE om.organization_id IS NOT NULL
    AND bwm.week_start >= CURRENT_DATE - INTERVAL '365 days'
  GROUP BY om.organization_id, bwm.week_start
  ON CONFLICT (org_id, week_start)
  DO UPDATE SET
    members = EXCLUDED.members,
    org_hrv_idx = EXCLUDED.org_hrv_idx,
    org_coherence = EXCLUDED.org_coherence,
    org_mvpa = EXCLUDED.org_mvpa,
    org_relax = EXCLUDED.org_relax,
    org_mindfulness = EXCLUDED.org_mindfulness,
    org_mood = EXCLUDED.org_mood,
    updated_at = CURRENT_TIMESTAMP;

  RAISE NOTICE 'Breath weekly org metrics refreshed at %', CURRENT_TIMESTAMP;
END;
$$;

COMMENT ON FUNCTION refresh_breath_weekly_org_metrics() IS
'Refresh weekly breath metrics for organizations from user metrics - should be called daily';

-- ============================================
-- 3. COMBINED REFRESH FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION refresh_breath_weekly_metrics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Refresh in dependency order
  PERFORM refresh_breath_weekly_user_metrics();
  PERFORM refresh_breath_weekly_org_metrics();

  RAISE NOTICE 'All breath weekly metrics refreshed at %', CURRENT_TIMESTAMP;
END;
$$;

COMMENT ON FUNCTION refresh_breath_weekly_metrics() IS
'Refresh all breath weekly metrics (user + org) - should be called daily via cron';

-- Initial refresh
SELECT refresh_breath_weekly_metrics();

-- ============================================
-- 4. GRANT PERMISSIONS
-- ============================================

GRANT EXECUTE ON FUNCTION refresh_breath_weekly_user_metrics() TO service_role;
GRANT EXECUTE ON FUNCTION refresh_breath_weekly_org_metrics() TO service_role;
GRANT EXECUTE ON FUNCTION refresh_breath_weekly_metrics() TO service_role;

-- ============================================
-- 5. SETUP AUTOMATIC REFRESH (via pg_cron)
-- ============================================

-- Note: Requires pg_cron extension
-- This will refresh metrics daily at 2:30 AM UTC
-- Uncomment if pg_cron is available:

/*
SELECT cron.schedule(
  'refresh-breath-weekly-metrics',
  '30 2 * * *', -- Every day at 2:30 AM UTC
  'SELECT refresh_breath_weekly_metrics();'
);
*/

-- Alternative: Can be triggered via edge function called by external cron
