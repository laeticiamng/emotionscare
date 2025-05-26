-- Flyway migration for widgets raw tables and triggers
-- 2025-06-01

-- 1.1 Instant Glow / micro_breaks
CREATE TABLE IF NOT EXISTS public.micro_breaks (
  id           uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_hash text         NOT NULL,
  ts           timestamptz  NOT NULL DEFAULT now(),
  hr_pre       int,
  hr_post      int,
  rmssd_delta  int,
  valence_pre  real,
  valence_post real,
  pss1         int
);

-- 1.2 Bubble-Beat / bubble_sessions
CREATE TABLE IF NOT EXISTS public.bubble_sessions (
  id           uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_hash text         NOT NULL,
  ts           timestamptz  NOT NULL DEFAULT now(),
  bpm          int,
  smile_amp    real,
  hr_sdnn      int,
  breath_idx   real,
  joy_idx      real,
  panas_pa     int
);

-- 1.3 Silk Wallpaper / silk_wallpaper
CREATE TABLE IF NOT EXISTS public.silk_wallpaper (
  id           uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_hash text         NOT NULL,
  ts           timestamptz  NOT NULL DEFAULT now(),
  hr_1min      int,
  tap_len_ms   int,
  sms1         int,
  hr_drop      int
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_micro_breaks_user_time ON micro_breaks(user_id_hash, ts DESC);
CREATE INDEX IF NOT EXISTS idx_bubble_sessions_user_time ON bubble_sessions(user_id_hash, ts DESC);
CREATE INDEX IF NOT EXISTS idx_silk_wallpaper_user_time ON silk_wallpaper(user_id_hash, ts DESC);

-- RLS setup (development permissive)
ALTER TABLE micro_breaks    ENABLE ROW LEVEL SECURITY;
ALTER TABLE bubble_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE silk_wallpaper  ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_read_own ON micro_breaks
  FOR SELECT USING (user_id_hash = current_setting('request.jwt.claim.user_hash', true));
CREATE POLICY p_read_own_bubble ON bubble_sessions
  FOR SELECT USING (user_id_hash = current_setting('request.jwt.claim.user_hash', true));
CREATE POLICY p_read_own_silk ON silk_wallpaper
  FOR SELECT USING (user_id_hash = current_setting('request.jwt.claim.user_hash', true));

-- Trigger functions
CREATE OR REPLACE FUNCTION public.calc_micro_break()
RETURNS TRIGGER AS $$
DECLARE
  rmssd_pre  int;
  rmssd_post int;
BEGIN
  rmssd_pre  := NEW.hr_pre;
  rmssd_post := NEW.hr_post;
  NEW.rmssd_delta := COALESCE(rmssd_post,0) - COALESCE(rmssd_pre,0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calc_micro_break
BEFORE INSERT ON public.micro_breaks
FOR EACH ROW EXECUTE FUNCTION public.calc_micro_break();

CREATE OR REPLACE FUNCTION public.calc_bubble_metrics()
RETURNS TRIGGER AS $$
BEGIN
  NEW.breath_idx := 6 - COALESCE(NEW.bpm, 0);
  NEW.joy_idx    := COALESCE(NEW.smile_amp, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calc_bubble_metrics
BEFORE INSERT ON public.bubble_sessions
FOR EACH ROW EXECUTE FUNCTION public.calc_bubble_metrics();

CREATE OR REPLACE FUNCTION public.calc_silk_metrics()
RETURNS TRIGGER AS $$
BEGIN
  NEW.hr_drop := COALESCE(NEW.hr_1min,0) - NEW.hr_1min;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calc_silk_metrics
BEFORE INSERT ON public.silk_wallpaper
FOR EACH ROW EXECUTE FUNCTION public.calc_silk_metrics();
