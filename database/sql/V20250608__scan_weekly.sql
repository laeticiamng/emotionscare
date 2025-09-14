-- Date: 20250608
-- Ticket: Harmonisation backend & securisation API
-- Migration: scan weekly

/*---------------------------------------------------------------------------
  SCAN weekly metrics materialized views and refresh job
---------------------------------------------------------------------------*/

/* 1-A  VUE UTILISATEUR  --------------------------------------------------- */
CREATE MATERIALIZED VIEW IF NOT EXISTS public.metrics_weekly_scan AS
SELECT
  sf.user_id_hash,
  date_trunc('week', sf.ts)::date                     AS week_start,

  /* Aura-Ink */ 
  AVG(sf.valence_avg)                                 AS valence_face_avg,
  AVG(sf.arousal_sd)                                  AS arousal_sd_face,

  /* Mirror-Glimmer */
  AVG(sg.joy_avg)                                     AS joy_face_avg,

  /* Whisper-Morph */
  AVG(sv.vad_valence)                                 AS valence_voice_avg,
  AVG(sv.lex_sentiment)                               AS lexical_sentiment_avg,

  /* Sessions */
  COUNT(sf.id)                                        AS n_face_sessions,
  COUNT(sv.id)                                        AS n_voice_sessions

FROM  public.scan_face     sf
LEFT  JOIN public.scan_glimmer sg
       ON (sg.user_id_hash = sf.user_id_hash
           AND date_trunc('week', sg.ts) = date_trunc('week', sf.ts))
LEFT  JOIN public.scan_voice   sv
       ON (sv.user_id_hash = sf.user_id_hash
           AND date_trunc('week', sv.ts) = date_trunc('week', sf.ts))

GROUP BY sf.user_id_hash, week_start
WITH NO DATA;

CREATE UNIQUE INDEX IF NOT EXISTS metrics_weekly_scan_pk
    ON public.metrics_weekly_scan(user_id_hash, week_start);

/* 1-B  VUE ORGANISATION  -------------------------------------------------- */
CREATE MATERIALIZED VIEW IF NOT EXISTS public.metrics_weekly_scan_org AS
SELECT
  uom.org_id,
  m.week_start,
  COUNT(*)                              AS members,
  AVG(m.valence_face_avg)               AS org_valence_face,
  AVG(m.arousal_sd_face)                AS org_arousal_sd,
  AVG(m.joy_face_avg)                   AS org_joy_face,
  AVG(m.valence_voice_avg)              AS org_valence_voice,
  AVG(m.lexical_sentiment_avg)          AS org_lexical_sentiment
FROM public.metrics_weekly_scan m
JOIN public.user_org_map       uom
     ON uom.user_id_hash = m.user_id_hash
GROUP BY uom.org_id, m.week_start
WITH NO DATA;

CREATE UNIQUE INDEX IF NOT EXISTS metrics_weekly_scan_org_pk
    ON public.metrics_weekly_scan_org(org_id, week_start);

/* 2-A  Fonction de refresh idempotente */
CREATE OR REPLACE FUNCTION public.refresh_metrics_scan() RETURNS void
LANGUAGE plpgsql AS $$
BEGIN
  PERFORM REFRESH MATERIALIZED VIEW CONCURRENTLY public.metrics_weekly_scan;
  PERFORM REFRESH MATERIALIZED VIEW CONCURRENTLY public.metrics_weekly_scan_org;
END;
$$;

/* 2-B  Planification — pg_cron ou Supabase */
SELECT cron.schedule(
  job_name  => 'refresh_metrics_scan',
  schedule  => '15 3 * * *',          -- 03 h 15 UTC chaque nuit
  command   => $$CALL public.refresh_metrics_scan();$$
);
