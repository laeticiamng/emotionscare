-- Migration: Widgets raw tables & triggers

-------------------------------------------------------------
-- 1.1 INSTANT GLOW  (micro_breaks)
-------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.micro_breaks
( id             uuid          PRIMARY KEY DEFAULT gen_random_uuid()
, user_id_hash   text          NOT NULL
, ts             timestamptz   NOT NULL DEFAULT now()
, hr_pre         int
, hr_post        int
, rmssd_delta    int          -- Δ HRV (calc)
, valence_pre    real
, valence_post   real
, pss1           int          -- proxy “I felt nervous” 0-4
);
CREATE INDEX IF NOT EXISTS idx_mb_user_ts ON micro_breaks(user_id_hash, ts DESC);

-------------------------------------------------------------
-- 1.2 BUBBLE-BEAT  (bubble_sessions)
-------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bubble_sessions
( id             uuid          PRIMARY KEY DEFAULT gen_random_uuid()
, user_id_hash   text          NOT NULL
, ts             timestamptz   NOT NULL DEFAULT now()
, bpm            int
, smile_amp      real
, hr_sdnn        int
, breath_idx     real          -- calc
, joy_idx        real          -- calc
, panas_pa       int           -- 10-50
);
CREATE INDEX idx_bb_user_ts ON bubble_sessions(user_id_hash, ts DESC);

-------------------------------------------------------------
-- 1.3 SILK WALLPAPER  (silk_wallpaper)
-------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.silk_wallpaper
( id             uuid          PRIMARY KEY DEFAULT gen_random_uuid()
, user_id_hash   text          NOT NULL
, ts             timestamptz   NOT NULL DEFAULT now()
, hr_1min        int
, tap_len_ms     int
, sms1           int           -- State Mindfulness 0-4
, hr_drop        int           -- calc
);
CREATE INDEX idx_sw_user_ts ON silk_wallpaper(user_id_hash, ts DESC);

-- 2. RLS & Hash salé

ALTER TABLE micro_breaks    ENABLE ROW LEVEL SECURITY;
ALTER TABLE bubble_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE silk_wallpaper  ENABLE ROW LEVEL SECURITY;

CREATE POLICY p_select_own ON micro_breaks
FOR SELECT USING (user_id_hash = current_setting('request.jwt.claim.user_hash', true));
CREATE POLICY p_select_own_bb ON bubble_sessions
FOR SELECT USING (user_id_hash = current_setting('request.jwt.claim.user_hash', true));
CREATE POLICY p_select_own_sw ON silk_wallpaper
FOR SELECT USING (user_id_hash = current_setting('request.jwt.claim.user_hash', true));

-- 3. Triggers PL/pgSQL

CREATE OR REPLACE FUNCTION calc_micro_break() RETURNS TRIGGER AS $$
BEGIN
  NEW.rmssd_delta := COALESCE(NEW.hr_post,0) - COALESCE(NEW.hr_pre,0);
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calc_micro_break
BEFORE INSERT ON micro_breaks
FOR EACH ROW EXECUTE FUNCTION calc_micro_break();

CREATE OR REPLACE FUNCTION calc_bubble_metrics() RETURNS TRIGGER AS $$
BEGIN
  NEW.breath_idx := 6 - COALESCE(NEW.bpm,0);
  NEW.joy_idx    := COALESCE(NEW.smile_amp,0);
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calc_bubble
BEFORE INSERT ON bubble_sessions
FOR EACH ROW EXECUTE FUNCTION calc_bubble_metrics();

CREATE OR REPLACE FUNCTION calc_silk_metrics() RETURNS TRIGGER AS $$
BEGIN
  NEW.hr_drop := 0; -- baseline perso à implémenter Sprint+1
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calc_silk
BEFORE INSERT ON silk_wallpaper
FOR EACH ROW EXECUTE FUNCTION calc_silk_metrics();
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
