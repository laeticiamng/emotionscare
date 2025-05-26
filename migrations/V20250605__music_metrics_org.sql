CREATE MATERIALIZED VIEW IF NOT EXISTS public.metrics_weekly_music_org AS
SELECT
  uom.org_id,
  week_start,
  avg(hrv_stress_index)    AS hrv_stress_index_avg,
  avg(coherence_score)     AS coherence_score_avg,
  sum(mvpa_min)            AS mvpa_min_total,
  avg(positive_affect)     AS positive_affect_avg,
  count(DISTINCT user_id_hash) AS n_users
FROM (
  SELECT * FROM biotune_weekly_metrics
  UNION ALL
  SELECT * FROM neon_walk_weekly_metrics
) mw
JOIN public.user_org_map uom USING (user_id_hash)
GROUP BY uom.org_id, week_start
WITH NO DATA;

CREATE OR REPLACE PROCEDURE refresh_metrics_weekly_music_org()
LANGUAGE plpgsql
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.metrics_weekly_music_org;
END;
$$;

SELECT cron.schedule('refresh_metrics_weekly_music_org', '35 3 * * *', $$CALL refresh_metrics_weekly_music_org()$$);
