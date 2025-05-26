-- MED raw tables for Flow Walk & Glow Mug

-- ───────────── 1-A  FLOW_WALK ─────────────────────────────
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

-- ───────────── 1-B  GLOW_MUG ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.glow_mug (
  id              uuid PRIMARY KEY       DEFAULT gen_random_uuid(),
  user_id_hash    text        NOT NULL,
  ts              timestamptz NOT NULL DEFAULT now(),
  hr_drop_bpm     real,
  hr_pre          int,
  hr_post         int,
  calm_score      int  CHECK (calm_score BETWEEN 1 AND 3),
  sms1            real,
  mood_emoji      text CHECK (char_length(mood_emoji)=2)
);
CREATE INDEX idx_mug_user_ts ON glow_mug(user_id_hash, ts DESC);

-- ───────────── 1-C  RLS ───────────────────────────────────
ALTER TABLE flow_walk ENABLE ROW LEVEL SECURITY;
ALTER TABLE glow_mug  ENABLE ROW LEVEL SECURITY;

CREATE POLICY p_flow_rw
  ON flow_walk
  USING (user_id_hash = current_setting('request.jwt.claim.user_hash', true))
  WITH CHECK (user_id_hash = current_setting('request.jwt.claim.user_hash', true));

CREATE POLICY p_mug_rw
  ON glow_mug
  USING (user_id_hash = current_setting('request.jwt.claim.user_hash', true))
  WITH CHECK (user_id_hash = current_setting('request.jwt.claim.user_hash', true));

-- ───────────── 1-D  TRIGGERS ─────────────────────────────
/* Flow-Walk : coherence_pct, rmssd_delta, mvpa_min */
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

/* Glow-Mug : hr_drop & SMS-1 */
CREATE OR REPLACE FUNCTION public.calc_glow_mug() RETURNS trigger AS $$
BEGIN
  IF NEW.hr_pre IS NOT NULL AND NEW.hr_post IS NOT NULL THEN
    NEW.hr_drop_bpm := NEW.hr_pre - NEW.hr_post;
  END IF;
  NEW.sms1 := (NEW.calm_score - 1) * 2.0;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_mug_metrics
BEFORE INSERT ON glow_mug
FOR EACH ROW EXECUTE FUNCTION public.calc_glow_mug();
