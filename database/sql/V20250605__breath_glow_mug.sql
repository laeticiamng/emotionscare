-- Date: 20250605
-- Ticket: Harmonisation backend & securisation API
-- Migration: breath glow_mug table and trigger

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
CREATE INDEX IF NOT EXISTS idx_mug_user_ts ON glow_mug(user_id_hash, ts DESC);

ALTER TABLE glow_mug ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_mug_rw
  ON glow_mug
  USING (user_id_hash = current_setting('request.jwt.claim.user_hash', true))
  WITH CHECK (user_id_hash = current_setting('request.jwt.claim.user_hash', true));

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
