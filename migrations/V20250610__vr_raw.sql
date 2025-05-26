-- VR raw tables and triggers

/* --- 1-A BIO-NEBULA ----------------------------------------------------- */
CREATE TABLE IF NOT EXISTS public.vr_nebula_sessions (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_hash    text          NOT NULL,
  ts_start        timestamptz   NOT NULL DEFAULT now(),
  duration_s      int           NOT NULL,
  resp_rate_avg   real,
  hrv_pre         int,
  hrv_post        int,
  rmssd_delta     int,
  coherence_score real,
  client          text          DEFAULT 'mobile'
);
CREATE INDEX IF NOT EXISTS idx_vr_nebula_user_ts
  ON public.vr_nebula_sessions(user_id_hash, ts_start DESC);

/* --- 1-B GLOW-COLLECTIVE DOME ------------------------------------------- */
CREATE TABLE IF NOT EXISTS public.vr_dome_sessions (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      uuid          NOT NULL,
  user_id_hash    text          NOT NULL,
  ts_join         timestamptz   NOT NULL DEFAULT now(),
  ts_leave        timestamptz,
  hr_mean         real,
  hr_std          real,
  valence_avg     real,
  group_sync_idx  real,
  team_pa         real
);
CREATE INDEX idx_vr_dome_session_user ON
  public.vr_dome_sessions(session_id, user_id_hash);

/* --- 1-C RLS & POLICIES RGPD ------------------------------------------- */
ALTER TABLE vr_nebula_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vr_dome_sessions   ENABLE ROW LEVEL SECURITY;

CREATE POLICY p_nebula_rw ON vr_nebula_sessions
  USING      (user_id_hash = current_setting('request.jwt.claim.user_hash', true))
  WITH CHECK (user_id_hash = current_setting('request.jwt.claim.user_hash', true));

CREATE POLICY p_dome_rw   ON vr_dome_sessions
  USING      (user_id_hash = current_setting('request.jwt.claim.user_hash', true))
  WITH CHECK (user_id_hash = current_setting('request.jwt.claim.user_hash', true));

/* --- 1-D TRIGGERS PL/pgSQL --------------------------------------------- */
-- Δ RMSSD + Coherence ----------------------------------------------------
CREATE OR REPLACE FUNCTION public.calc_vr_nebula() RETURNS trigger AS $$
BEGIN
  NEW.rmssd_delta := COALESCE(NEW.hrv_post,0) - COALESCE(NEW.hrv_pre,0);

  IF NEW.resp_rate_avg IS NOT NULL THEN
    NEW.coherence_score :=
      GREATEST(0, 100 - ABS(NEW.resp_rate_avg * 1.0 - 5.5) * 10);
  ELSE
    NEW.coherence_score := NULL;
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_vr_nebula BEFORE INSERT
  ON public.vr_nebula_sessions
  FOR EACH ROW EXECUTE FUNCTION public.calc_vr_nebula();

-- Group Synchrony Index & Team PA ---------------------------------------
CREATE OR REPLACE FUNCTION public.calc_vr_dome() RETURNS trigger AS $$
DECLARE
  grp_hr_std  real;
  grp_pa      real;
BEGIN
  SELECT STDDEV_SAMP(hr_mean), AVG(valence_avg)
    INTO grp_hr_std, grp_pa
  FROM public.vr_dome_sessions
  WHERE session_id = NEW.session_id
    AND ts_leave IS NOT NULL;

  NEW.group_sync_idx := grp_hr_std;
  NEW.team_pa        := grp_pa;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_vr_dome BEFORE INSERT
  ON public.vr_dome_sessions
  FOR EACH ROW EXECUTE FUNCTION public.calc_vr_dome();
