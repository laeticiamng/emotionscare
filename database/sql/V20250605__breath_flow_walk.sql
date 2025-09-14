-- Date: 20250605
-- Ticket: Harmonisation backend & securisation API
-- Migration: breath flow_walk table and trigger

CREATE TABLE IF NOT EXISTS public.flow_walk (
  id              uuid PRIMARY KEY       DEFAULT gen_random_uuid(),
  user_id_hash    text        NOT NULL,
  ts              timestamptz NOT NULL DEFAULT now(),
  steps           int         NOT NULL,
  cadence_spm     int,
  breath_rate_rpm real,
  coherence_pct   real,
  hrv_pre         int,
  hrv_post        int,
  rmssd_delta     int,
  mvpa_min        real,
  duration_s      int         NOT NULL DEFAULT 180
);
CREATE INDEX IF NOT EXISTS idx_flow_user_ts
  ON flow_walk(user_id_hash, ts DESC);

ALTER TABLE flow_walk ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_flow_rw
  ON flow_walk
  USING (user_id_hash = current_setting('request.jwt.claim.user_hash', true))
  WITH CHECK (user_id_hash = current_setting('request.jwt.claim.user_hash', true));

CREATE OR REPLACE FUNCTION public.calc_flow_walk() RETURNS trigger AS $$
BEGIN
  IF NEW.cadence_spm IS NOT NULL AND NEW.breath_rate_rpm IS NOT NULL THEN
    NEW.coherence_pct :=
      100 * (1 - LEAST(1, ABS(NEW.cadence_spm - NEW.breath_rate_rpm*6)::real
                          / (NEW.cadence_spm+1)));
  END IF;
  NEW.rmssd_delta := COALESCE(NEW.hrv_post,0) - COALESCE(NEW.hrv_pre,0);
  NEW.mvpa_min := ROUND((NEW.steps / 100.0) * (NEW.cadence_spm / 120.0), 2);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_flow_metrics
BEFORE INSERT ON flow_walk
FOR EACH ROW EXECUTE FUNCTION public.calc_flow_walk();
