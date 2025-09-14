-- Date: 20250608
-- Ticket: Harmonisation backend & securisation API
-- Migration: gam raw

-- GAM raw tables and triggers

-- 1-A  TABLE echo_crystal  (rire → cristal)
CREATE TABLE IF NOT EXISTS public.echo_crystal (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_hash    text          NOT NULL,
  ts              timestamptz   NOT NULL DEFAULT now(),
  joy_idx         real          NOT NULL,
  arousal_voice   real          NOT NULL,
  laugh_db        real          NOT NULL,
  laugh_pitch     real          NOT NULL,
  crystal_type    text          NOT NULL,
  color_hex       char(7)       NOT NULL,
  sparkle_level   real          NOT NULL,
  mesh_url        text,
  minted_bool     boolean       DEFAULT false,
  pos_affect      real,
  genuine_flag    boolean
);
CREATE INDEX IF NOT EXISTS idx_ec_user_ts
  ON public.echo_crystal(user_id_hash, ts DESC);

-- 1-B  TABLE bb_chain  (partage chaîne Bubble-Beat)
CREATE TABLE IF NOT EXISTS public.bb_chain (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_hash    text          NOT NULL,
  ts              timestamptz   NOT NULL DEFAULT now(),
  parent_id       uuid          REFERENCES public.bb_chain(id) ON DELETE SET NULL,
  depth           int           NOT NULL DEFAULT 0,
  share_count     int           NOT NULL DEFAULT 1
);
CREATE INDEX idx_bb_user_ts ON public.bb_chain(user_id_hash, ts DESC);

-- 1-C  TABLE neon_challenge  (walk AR hebdo)
CREATE TABLE IF NOT EXISTS public.neon_challenge (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_hash    text          NOT NULL,
  ts              timestamptz   NOT NULL DEFAULT now(),
  steps           int           NOT NULL,
  km              real          NOT NULL,
  joy_idx         real,
  mvpa_min        real,
  streak_flag     boolean
);
CREATE INDEX idx_nc_user_ts ON public.neon_challenge(user_id_hash, ts DESC);

-- 1-D  RLS (lecture/écriture perso)
ALTER TABLE echo_crystal   ENABLE ROW LEVEL SECURITY;
ALTER TABLE bb_chain       ENABLE ROW LEVEL SECURITY;
ALTER TABLE neon_challenge ENABLE ROW LEVEL SECURITY;

CREATE POLICY p_ec_rw ON echo_crystal
  USING (user_id_hash = current_setting('request.jwt.claim.user_hash', true))
  WITH CHECK (user_id_hash = current_setting('request.jwt.claim.user_hash', true));

CREATE POLICY p_bb_rw ON bb_chain
  USING (user_id_hash = current_setting('request.jwt.claim.user_hash', true))
  WITH CHECK (user_id_hash = current_setting('request.jwt.claim.user_hash', true));

CREATE POLICY p_nc_rw ON neon_challenge
  USING (user_id_hash = current_setting('request.jwt.claim.user_hash', true))
  WITH CHECK (user_id_hash = current_setting('request.jwt.claim.user_hash', true));

-- 1-E  TRIGGERS
/* Echo-Crystal : PANAS-PA proxy + genuine_flag */
CREATE OR REPLACE FUNCTION public.calc_echo_metrics() RETURNS trigger AS $$
BEGIN
  NEW.pos_affect  := NEW.joy_idx;
  NEW.genuine_flag:= NEW.laugh_db >= 60;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_echo_metrics
BEFORE INSERT ON public.echo_crystal
FOR EACH ROW EXECUTE FUNCTION public.calc_echo_metrics();

/* Bubble-Beat : depth = parent.depth +1 */
CREATE OR REPLACE FUNCTION public.calc_bb_depth() RETURNS trigger AS $$
DECLARE
  parent_depth int := 0;
BEGIN
  IF NEW.parent_id IS NOT NULL THEN
    SELECT depth INTO parent_depth FROM public.bb_chain WHERE id = NEW.parent_id;
  END IF;
  NEW.depth := parent_depth + 1;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_bb_depth
BEFORE INSERT ON public.bb_chain
FOR EACH ROW EXECUTE FUNCTION public.calc_bb_depth();

/* Neon-Challenge : mvpa_min + streak_flag */
CREATE OR REPLACE FUNCTION public.calc_nc_metrics() RETURNS trigger AS $$
DECLARE
  prev_ts timestamptz;
BEGIN
  NEW.mvpa_min := ROUND((NEW.steps / 100.0) * (NEW.km / 0.8), 2);
  SELECT ts INTO prev_ts
    FROM public.neon_challenge
    WHERE user_id_hash = NEW.user_id_hash
    ORDER BY ts DESC LIMIT 1;
  IF prev_ts IS NOT NULL AND NEW.ts::date = prev_ts::date + 1 THEN
    NEW.streak_flag := true;
  ELSE
    NEW.streak_flag := false;
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_nc_metrics
BEFORE INSERT ON public.neon_challenge
FOR EACH ROW EXECUTE FUNCTION public.calc_nc_metrics();
