/*---------------------------------------------------------------------------
  GAM weekly metrics materialized views and refresh job
---------------------------------------------------------------------------*/

/* 1-A – Vue matérialisée UTILISATEUR  --------------------------- */
CREATE MATERIALIZED VIEW IF NOT EXISTS public.metrics_weekly_gam AS
SELECT
    ec.user_id_hash,
    date_trunc('week', COALESCE(ec.ts, bc.ts, nc.ts))::date AS week_start,

    /* Affect positif : moyenne Joy cristaux  ------------------- */
    AVG(ec.pos_affect)                       AS pa_avg,

    /* Rire authentique : % “genuine” --------------------------- */
    AVG(CASE WHEN ec.genuine_flag THEN 1 ELSE 0 END)    AS laugh_genuine_ratio,

    /* Connectedness : profondeur moyenne de chaîne ------------- */
    AVG(bc.depth)                            AS conn_depth_avg,

    /* Engagement : total partages semaine ---------------------- */
    SUM(bc.share_count)                      AS shares_total,

    /* Activité physique : Σ minutes MVPA ----------------------- */
    SUM(nc.mvpa_min)                         AS mvpa_min,

    /* Auto-efficacité : % jours avec streak -------------------- */
    AVG(CASE WHEN nc.streak_flag THEN 1 ELSE 0 END)     AS streak_ratio
FROM   public.echo_crystal      ec
FULL   JOIN public.bb_chain     bc USING (user_id_hash)
FULL   JOIN public.neon_challenge nc USING (user_id_hash)
GROUP  BY ec.user_id_hash, week_start
WITH NO DATA;

CREATE UNIQUE INDEX IF NOT EXISTS metrics_weekly_gam_pk
    ON public.metrics_weekly_gam(user_id_hash, week_start);

/* 1-B – Vue matérialisée ORGANISATION -------------------------- */
CREATE MATERIALIZED VIEW IF NOT EXISTS public.metrics_weekly_gam_org AS
SELECT
    m.org_id,
    m.week_start,
    COUNT(*)                           AS n_members,
    AVG(m.pa_avg)                      AS pa_org_avg,
    AVG(m.laugh_genuine_ratio)         AS laugh_ratio_org,
    AVG(m.conn_depth_avg)              AS conn_depth_org,
    SUM(m.shares_total)                AS shares_org,
    AVG(m.mvpa_min)                    AS mvpa_org,
    AVG(m.streak_ratio)                AS streak_org
FROM (
    SELECT uom.org_id, w.*
    FROM   public.metrics_weekly_gam w
    JOIN   public.user_org_map uom USING (user_id_hash)
) m
GROUP BY m.org_id, m.week_start
WITH NO DATA;

CREATE UNIQUE INDEX IF NOT EXISTS metrics_weekly_gam_org_pk
    ON public.metrics_weekly_gam_org(org_id, week_start);

/* 1-C – Droits minimalistes ------------------------------------ */
GRANT SELECT ON metrics_weekly_gam      TO service_role;
GRANT SELECT ON metrics_weekly_gam_org  TO service_role;

/* 2-A Fonction idempotente */
CREATE OR REPLACE FUNCTION public.refresh_metrics_gam() RETURNS void AS $$
BEGIN
  PERFORM REFRESH MATERIALIZED VIEW CONCURRENTLY public.metrics_weekly_gam;
  PERFORM REFRESH MATERIALIZED VIEW CONCURRENTLY public.metrics_weekly_gam_org;
END;
$$ LANGUAGE plpgsql;

/* 2-B Planification (pg_cron ou Supabase scheduler) */
SELECT cron.schedule(
  job_name  => 'refresh_metrics_gam',
  schedule  => '15 3 * * *',          -- 03 h 15 UTC
  command   => $$CALL public.refresh_metrics_gam();$$
);
