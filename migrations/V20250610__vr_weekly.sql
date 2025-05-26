/*---------------------------------------------------------------------------
  VR weekly metrics materialized views and refresh job
---------------------------------------------------------------------------*/

/* 1-A — Vue matérialisée utilisateur · metrics_weekly_vr */
CREATE MATERIALIZED VIEW IF NOT EXISTS public.metrics_weekly_vr AS
SELECT
  user_id_hash,
  date_trunc('week', ts_finish)::date AS week_start,

  percentile_cont(0.5) within group (order by rmssd_delta) AS hrv_gain_median,
  avg(coherence_score)                                     AS coherence_avg
FROM   vr_nebula_sessions
GROUP  BY user_id_hash, week_start
WITH   NO DATA;

CREATE UNIQUE INDEX IF NOT EXISTS pk_metrics_weekly_vr
  ON public.metrics_weekly_vr(user_id_hash, week_start);

/* 1-B — Vue matérialisée organisation · metrics_weekly_vr_org */
CREATE MATERIALIZED VIEW IF NOT EXISTS public.metrics_weekly_vr_org AS
SELECT
  uom.org_id,
  m.week_start,
  count(*)                              AS members,
  avg(m.hrv_gain_median)                AS org_hrv_gain,
  avg(m.coherence_avg)                  AS org_coherence,
  avg(d.synchrony_idx)                  AS org_sync_idx,
  avg(d.team_pa)                        AS org_team_pa
FROM public.metrics_weekly_vr  m
JOIN public.user_org_map       uom USING (user_id_hash)
LEFT JOIN (
    SELECT  org_id,
            date_trunc('week', ts)::date     AS week_start,
            avg(hr_std)   AS synchrony_idx,
            avg(valence)  AS team_pa
    FROM    vr_dome_sessions v
    JOIN    user_org_map    u USING (user_id_hash)
    GROUP   BY org_id, week_start
) d USING (org_id, week_start)
GROUP BY uom.org_id, m.week_start
WITH NO DATA;

CREATE UNIQUE INDEX IF NOT EXISTS pk_metrics_weekly_vr_org
  ON public.metrics_weekly_vr_org(org_id, week_start);

/* 1-C — Droits lecture */
GRANT SELECT ON metrics_weekly_vr, metrics_weekly_vr_org TO service_role;

/* 2-A — Procédure de rafraîchissement */
CREATE OR REPLACE PROCEDURE public.refresh_metrics_vr()
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM REFRESH MATERIALIZED VIEW CONCURRENTLY public.metrics_weekly_vr;
  PERFORM REFRESH MATERIALIZED VIEW CONCURRENTLY public.metrics_weekly_vr_org;
END $$;

/* 2-B — Planification pg_cron (03 h 15 UTC) */
SELECT cron.schedule(
  job_name  => 'refresh_metrics_vr',
  schedule  => '15 3 * * *',
  command   => $$CALL public.refresh_metrics_vr();$$
);
