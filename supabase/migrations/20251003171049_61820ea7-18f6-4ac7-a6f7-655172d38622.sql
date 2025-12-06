-- ============================================================================
-- OPTIMISATIONS DB - Phase 1 : Indexes composites
-- ============================================================================

-- Journal : Requêtes user + période
CREATE INDEX IF NOT EXISTS idx_journal_voice_user_ts 
  ON journal_voice(user_id, ts DESC);

CREATE INDEX IF NOT EXISTS idx_journal_text_user_ts 
  ON journal_text(user_id, ts DESC);

-- VR Nebula : Requêtes user + période
CREATE INDEX IF NOT EXISTS idx_vr_nebula_user_ts 
  ON vr_nebula_sessions(user_id, ts_start DESC);

-- VR Dome : Requêtes session + user
CREATE INDEX IF NOT EXISTS idx_vr_dome_session_user 
  ON vr_dome_sessions(session_id, user_id);

CREATE INDEX IF NOT EXISTS idx_vr_dome_user_ts 
  ON vr_dome_sessions(user_id, ts_join DESC);

-- Breath : Requêtes user + semaine
CREATE INDEX IF NOT EXISTS idx_breath_user_week 
  ON breath_weekly_metrics(user_id, week_start DESC);

CREATE INDEX IF NOT EXISTS idx_breath_org_week 
  ON breath_weekly_org_metrics(org_id, week_start DESC);

-- Assessments : Requêtes user + instrument + période
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_user_instrument 
  ON assessment_sessions(user_id, instrument, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_assessments_user_instrument_ts 
  ON assessments(user_id, instrument, ts DESC);

-- Org memberships : Requêtes org + role
CREATE INDEX IF NOT EXISTS idx_org_memberships_org_role 
  ON org_memberships(org_id, role) WHERE role IN ('admin', 'manager');

-- ============================================================================
-- OPTIMISATIONS DB - Phase 2 : Vues matérialisées
-- ============================================================================

-- Vue matérialisée : Dashboard utilisateur hebdomadaire
CREATE MATERIALIZED VIEW IF NOT EXISTS user_weekly_dashboard AS
SELECT 
  u.user_id,
  date_trunc('week', u.week)::date as week_start,
  
  -- Journal metrics
  COALESCE(jv_stats.voice_count, 0) as journal_voice_count,
  COALESCE(jt_stats.text_count, 0) as journal_text_count,
  
  -- VR metrics
  COALESCE(vr_stats.session_count, 0) as vr_sessions_count,
  vr_stats.avg_coherence,
  vr_stats.avg_hrv_delta,
  
  -- Breath metrics
  bw.coherence_avg as breath_coherence,
  bw.mood_score as breath_mood,
  bw.hrv_stress_idx as breath_hrv,
  
  -- Assessment metrics
  COALESCE(ass_stats.assessment_count, 0) as assessments_count,
  
  -- Last activity
  GREATEST(
    jv_stats.last_ts,
    jt_stats.last_ts,
    vr_stats.last_ts,
    ass_stats.last_ts
  ) as last_activity_at,
  
  NOW() as refreshed_at
  
FROM (
  SELECT DISTINCT 
    user_id, 
    date_trunc('week', week_start) as week
  FROM breath_weekly_metrics
  WHERE week_start >= NOW() - INTERVAL '6 months'
) u

LEFT JOIN LATERAL (
  SELECT 
    COUNT(*) as voice_count,
    MAX(ts) as last_ts
  FROM journal_voice jv
  WHERE jv.user_id = u.user_id
    AND date_trunc('week', jv.ts) = u.week
) jv_stats ON true

LEFT JOIN LATERAL (
  SELECT 
    COUNT(*) as text_count,
    MAX(ts) as last_ts
  FROM journal_text jt
  WHERE jt.user_id = u.user_id
    AND date_trunc('week', jt.ts) = u.week
) jt_stats ON true

LEFT JOIN LATERAL (
  SELECT 
    COUNT(*) as session_count,
    AVG(coherence_score) as avg_coherence,
    AVG(rmssd_delta) as avg_hrv_delta,
    MAX(ts_start) as last_ts
  FROM vr_nebula_sessions vn
  WHERE vn.user_id = u.user_id
    AND date_trunc('week', vn.ts_start) = u.week
) vr_stats ON true

LEFT JOIN breath_weekly_metrics bw 
  ON bw.user_id = u.user_id 
  AND bw.week_start = u.week::date

LEFT JOIN LATERAL (
  SELECT 
    COUNT(*) as assessment_count,
    MAX(ts) as last_ts
  FROM assessments a
  WHERE a.user_id = u.user_id
    AND date_trunc('week', a.ts) = u.week
) ass_stats ON true;

-- Index sur la vue matérialisée
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_weekly_dashboard_pk 
  ON user_weekly_dashboard(user_id, week_start);

CREATE INDEX IF NOT EXISTS idx_user_weekly_dashboard_week 
  ON user_weekly_dashboard(week_start DESC);

CREATE INDEX IF NOT EXISTS idx_user_weekly_dashboard_activity 
  ON user_weekly_dashboard(last_activity_at DESC NULLS LAST);

-- Fonction de refresh
CREATE OR REPLACE FUNCTION refresh_analytics_dashboards()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_weekly_dashboard;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- RLS sur la vue matérialisée
ALTER MATERIALIZED VIEW user_weekly_dashboard OWNER TO postgres;
GRANT SELECT ON user_weekly_dashboard TO authenticated;