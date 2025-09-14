-- Date: 20250606
-- Ticket: Harmonisation backend & securisation API
-- Migration: breath weekly

/*--------------------------------------------------------------------------
  Breathwork weekly metrics materialized views and refresh job
--------------------------------------------------------------------------*/

/* 1-A  VUE UTILISATEUR  ----------------------------------------- */
CREATE MATERIALIZED VIEW IF NOT EXISTS public.metrics_weekly_breath AS
SELECT
  user_id_hash,
  date_trunc('week', ts)::date AS week_start,

  /* Flow-Walk --------------------------------------------------- */
  percentile_cont(0.5) within group (order by rmssd_delta) AS hrv_stress_idx,
  avg(coherence_pct)                                       AS coherence_avg,
  sum(mvpa_min)                                            AS mvpa_week,

  /* Glow-Mug ---------------------------------------------------- */
  avg(hr_drop_bpm)                                         AS relax_idx,
  avg(sms1)                                                AS mindfulness_avg,
  avg(
    CASE
      WHEN mood_emoji IN ('🙂','😄','😊') THEN 1
      WHEN mood_emoji IN ('😐','😑')       THEN 0
      ELSE -1
    END
  )                                                        AS mood_score
FROM flow_walk
GROUP BY user_id_hash, week_start

UNION ALL

SELECT
  user_id_hash,
  date_trunc('week', ts)::date AS week_start,
  NULL, NULL, NULL,
  avg(hr_drop_bpm),
  avg(sms1),
  avg(
    CASE
      WHEN mood_emoji IN ('🙂','😄','😊') THEN 1
      WHEN mood_emoji IN ('😐','😑')       THEN 0
      ELSE -1
    END
  )
FROM glow_mug
GROUP BY user_id_hash, week_start
WITH NO DATA;

CREATE UNIQUE INDEX IF NOT EXISTS metrics_weekly_breath_pk
  ON public.metrics_weekly_breath(user_id_hash, week_start);

/* 1-B  VUE ORGANISATION  --------------------------------------- */
CREATE MATERIALIZED VIEW IF NOT EXISTS public.metrics_weekly_breath_org AS
SELECT
  uom.org_id,
  m.week_start,
  count(*)                          AS members,
  avg(hrv_stress_idx)               AS org_hrv_idx,
  avg(coherence_avg)                AS org_coherence,
  avg(mvpa_week)                    AS org_mvpa,
  avg(relax_idx)                    AS org_relax,
  avg(mindfulness_avg)              AS org_mindfulness,
  avg(mood_score)                   AS org_mood
FROM public.metrics_weekly_breath  m
JOIN public.user_org_map           uom
      ON uom.user_id_hash = m.user_id_hash
GROUP BY uom.org_id, m.week_start
WITH NO DATA;

CREATE UNIQUE INDEX IF NOT EXISTS metrics_weekly_breath_org_pk
  ON public.metrics_weekly_breath_org(org_id, week_start);

/* 1-C  PRIVILEGES ---------------------------------------------- */
GRANT SELECT ON metrics_weekly_breath,
                 metrics_weekly_breath_org  TO service_role;

/* 2-A  Fonction de refresh idempotente */
CREATE OR REPLACE FUNCTION public.refresh_metrics_breath()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  PERFORM refresh materialized view concurrently public.metrics_weekly_breath;
  PERFORM refresh materialized view concurrently public.metrics_weekly_breath_org;
END;
$$;

/* 2-B  Planification quotidienne 03 h 12 UTC */
SELECT cron.schedule(
  job_name => 'refresh_metrics_breath',
  schedule => '12 3 * * *',
  command  => $$CALL public.refresh_metrics_breath();$$
);
