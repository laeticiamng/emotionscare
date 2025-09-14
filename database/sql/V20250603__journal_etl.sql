-- Date: 20250603
-- Ticket: Harmonisation backend & securisation API
-- Migration: journal etl

/*---------------------------------------------------------------------------
  1.1  VUE MATÉRIALISÉE  metrics_weekly_journal
---------------------------------------------------------------------------*/
CREATE MATERIALIZED VIEW IF NOT EXISTS public.metrics_weekly_journal AS
SELECT
  user_id_hash,
  date_trunc('week', ts) AS week_start,

  /* AFFECT */
  avg(valence)                    AS valence_avg,
  stddev_samp(valence)            AS valence_sd,

  /* GRATITUDE */
  avg(CASE WHEN gratitude_hits > 0 THEN 1 ELSE 0 END) AS gratitude_ratio,

  /* WPM */
  percentile_cont(0.5) WITHIN GROUP (ORDER BY wpm)      AS wpm_median,

  /* POSITIVE / NEGATIVE AFFECT */
  avg(panas_pa)                   AS panas_pa_avg,
  avg(panas_na)                   AS panas_na_avg

FROM (
  SELECT ts, user_id_hash,
         valence,
         0            AS gratitude_hits,
         0            AS wpm,
         0::int       AS panas_pa,
         0::int       AS panas_na
    FROM journal_voice

  UNION ALL

  SELECT ts, user_id_hash,
         valence,
         gratitude_hits,
         COALESCE(wpm,0),
         0, 0
    FROM journal_text
) AS j
GROUP BY user_id_hash, week_start
WITH NO DATA;   -- vue vide jusqu’au premier REFRESH

/*---------------------------------------------------------------------------
  1.2  INDEX pour accélérer les dashboards
---------------------------------------------------------------------------*/
CREATE UNIQUE INDEX IF NOT EXISTS
  idx_mwj_user_week ON metrics_weekly_journal(user_id_hash, week_start);

/*---------------------------------------------------------------------------
  1.3  FONCTION DE REFRESH + PLANIFICATION pg_cron
---------------------------------------------------------------------------*/
CREATE OR REPLACE PROCEDURE public.refresh_metrics_weekly_journal()
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM pg_advisory_xact_lock(2025060301);  -- mutex
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.metrics_weekly_journal;
END;
$$;

-- Supprime l’ancien job si déjà défini
SELECT cron.unschedule('3h_nightly_journal') WHERE '3h_nightly_journal'
  IN (SELECT jobname FROM cron.job);

-- Planifie à 03 h UTC tous les jours
SELECT cron.schedule(
  '3h_nightly_journal',
  '0 3 * * *',
  $$ CALL public.refresh_metrics_weekly_journal(); $$
);
