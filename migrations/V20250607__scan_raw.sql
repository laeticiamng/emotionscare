-- SCAN raw tables and triggers

-- 1-A TABLE scan_face
CREATE TABLE IF NOT EXISTS public.scan_face (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_hash    text          NOT NULL,
  ts              timestamptz   NOT NULL DEFAULT now(),
  duration_s      int           NOT NULL,
  valence_series  real[]        NOT NULL,
  arousal_series  real[]        NOT NULL,
  valence_avg     real,
  arousal_sd      real,
  img_url         text,
  share_bool      boolean       DEFAULT false
);
CREATE INDEX IF NOT EXISTS idx_scan_face_user_ts
  ON public.scan_face(user_id_hash, ts DESC);

-- 1-B TABLE scan_glimmer
CREATE TABLE IF NOT EXISTS public.scan_glimmer (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_hash    text NOT NULL,
  ts              timestamptz NOT NULL DEFAULT now(),
  joy_series      real[]    NOT NULL,
  delay_ms        int       NOT NULL,
  joy_avg         real,
  gif_url         text,
  share_bool      boolean DEFAULT false
);
CREATE INDEX idx_scan_glimmer_user_ts
  ON public.scan_glimmer(user_id_hash, ts DESC);

-- 1-C TABLE scan_voice
CREATE TABLE IF NOT EXISTS public.scan_voice (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_hash     text NOT NULL,
  ts               timestamptz NOT NULL DEFAULT now(),
  word             text NOT NULL,
  valence_voice    real NOT NULL,
  arousal_voice    real NOT NULL,
  vad_valence      real,
  lex_sentiment    real,
  expressive_len   int,
  mp4_url          text,
  share_bool       boolean DEFAULT false
);
CREATE INDEX idx_scan_voice_user_ts
  ON public.scan_voice(user_id_hash, ts DESC);

-- 1-D RLS & policies
ALTER TABLE scan_face     ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_glimmer  ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_voice    ENABLE ROW LEVEL SECURITY;

CREATE POLICY p_face_rw ON scan_face
  USING  (user_id_hash = current_setting('request.jwt.claim.user_hash', true))
  WITH CHECK (user_id_hash = current_setting('request.jwt.claim.user_hash', true));
CREATE POLICY p_glimmer_rw ON scan_glimmer
  USING  (user_id_hash = current_setting('request.jwt.claim.user_hash', true))
  WITH CHECK (user_id_hash = current_setting('request.jwt.claim.user_hash', true));
CREATE POLICY p_voice_rw ON scan_voice
  USING  (user_id_hash = current_setting('request.jwt.claim.user_hash', true))
  WITH CHECK (user_id_hash = current_setting('request.jwt.claim.user_hash', true));

-- 1-E TRIGGERS
/* face : valence_avg, arousal_sd */
CREATE OR REPLACE FUNCTION public.calc_scan_face() RETURNS trigger AS $$
DECLARE
  n       int;
  sum_a   real := 0;
  sum_a2  real := 0;
BEGIN
  NEW.valence_avg := (SELECT AVG(v) FROM unnest(NEW.valence_series) AS v);
  n := array_length(NEW.arousal_series,1);
  IF n > 1 THEN
    SELECT SUM(v), SUM(v*v) INTO sum_a, sum_a2
      FROM unnest(NEW.arousal_series) AS v;
    NEW.arousal_sd := sqrt((sum_a2 - (sum_a*sum_a)/n) / (n-1));
  ELSE
    NEW.arousal_sd := 0;
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_scan_face
BEFORE INSERT ON scan_face
FOR EACH ROW EXECUTE FUNCTION public.calc_scan_face();

/* glimmer : joy_avg */
CREATE OR REPLACE FUNCTION public.calc_scan_glimmer() RETURNS trigger AS $$
BEGIN
  NEW.joy_avg := (SELECT AVG(v) FROM unnest(NEW.joy_series) AS v);
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_scan_glimmer
BEFORE INSERT ON scan_glimmer
FOR EACH ROW EXECUTE FUNCTION public.calc_scan_glimmer();

/* voice : vad_valence, lex_sentiment, expressive_len */
CREATE OR REPLACE FUNCTION public.calc_scan_voice() RETURNS trigger AS $$
BEGIN
  NEW.vad_valence    := NEW.valence_voice;
  NEW.lex_sentiment  := CASE
                          WHEN NEW.valence_voice >= 0 THEN NEW.valence_voice
                          ELSE -NEW.valence_voice END;
  NEW.expressive_len := length(NEW.word);
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_scan_voice
BEFORE INSERT ON scan_voice
FOR EACH ROW EXECUTE FUNCTION public.calc_scan_voice();
