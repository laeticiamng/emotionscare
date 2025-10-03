-- JOUR 4 - PHASE 2 : Migration VR In-Memory → Supabase
-- Date: 2025-10-03
-- Objectif: Créer tables VR avec RLS pour sessions immersives

-- ============================================
-- 1. TABLES VR RAW (Bio-Nebula & Glow-Collective)
-- ============================================

-- Table VR Nebula (sessions individuelles Bio-Nebula)
CREATE TABLE IF NOT EXISTS public.vr_nebula_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_id_hash TEXT, -- Migration progressive (legacy)
  ts_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  ts_finish TIMESTAMPTZ,
  duration_s INTEGER NOT NULL,
  resp_rate_avg REAL,
  hrv_pre INTEGER,
  hrv_post INTEGER,
  rmssd_delta INTEGER,
  coherence_score REAL,
  client TEXT DEFAULT 'mobile',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vr_nebula_user_ts 
ON vr_nebula_sessions(user_id, ts_start DESC);

-- Table VR Dome (sessions collectives Glow-Collective)
CREATE TABLE IF NOT EXISTS public.vr_dome_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_id_hash TEXT, -- Migration progressive (legacy)
  ts TIMESTAMPTZ NOT NULL DEFAULT now(),
  ts_join TIMESTAMPTZ NOT NULL DEFAULT now(),
  ts_leave TIMESTAMPTZ,
  hr_mean REAL,
  hr_std REAL,
  valence REAL,
  valence_avg REAL,
  synchrony_idx REAL,
  group_sync_idx REAL,
  team_pa REAL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vr_dome_session_user 
ON vr_dome_sessions(session_id, user_id);

-- ============================================
-- 2. TRIGGERS CALCULS AUTOMATIQUES
-- ============================================

-- Trigger Bio-Nebula: Calcul ΔRMSSD et Coherence
CREATE OR REPLACE FUNCTION public.calc_vr_nebula()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.rmssd_delta := COALESCE(NEW.hrv_post, 0) - COALESCE(NEW.hrv_pre, 0);
  
  IF NEW.resp_rate_avg IS NOT NULL THEN
    NEW.coherence_score := GREATEST(0, 100 - ABS(NEW.resp_rate_avg * 1.0 - 5.5) * 10);
  ELSE
    NEW.coherence_score := NULL;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_vr_nebula 
BEFORE INSERT ON public.vr_nebula_sessions
FOR EACH ROW EXECUTE FUNCTION public.calc_vr_nebula();

-- Trigger Dome: Calcul synchrony et team PA
CREATE OR REPLACE FUNCTION public.calc_vr_dome()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  grp_hr_std REAL;
  grp_pa REAL;
BEGIN
  SELECT STDDEV_SAMP(hr_mean), AVG(valence)
  INTO grp_hr_std, grp_pa
  FROM public.vr_dome_sessions
  WHERE session_id = NEW.session_id
    AND ts_leave IS NOT NULL;
  
  NEW.synchrony_idx := grp_hr_std;
  NEW.group_sync_idx := grp_hr_std;
  NEW.team_pa := grp_pa;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_vr_dome 
BEFORE INSERT ON public.vr_dome_sessions
FOR EACH ROW EXECUTE FUNCTION public.calc_vr_dome();

-- ============================================
-- 3. RLS POLICIES
-- ============================================

ALTER TABLE public.vr_nebula_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vr_dome_sessions ENABLE ROW LEVEL SECURITY;

-- Nebula policies
CREATE POLICY "vr_nebula_select_own"
  ON public.vr_nebula_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "vr_nebula_insert_own"
  ON public.vr_nebula_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "vr_nebula_update_own"
  ON public.vr_nebula_sessions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "vr_nebula_delete_own"
  ON public.vr_nebula_sessions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Dome policies
CREATE POLICY "vr_dome_select_own"
  ON public.vr_dome_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "vr_dome_insert_own"
  ON public.vr_dome_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "vr_dome_update_own"
  ON public.vr_dome_sessions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "vr_dome_delete_own"
  ON public.vr_dome_sessions
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 4. DOCUMENTATION
-- ============================================

COMMENT ON TABLE public.vr_nebula_sessions IS 
'Sessions VR individuelles Bio-Nebula avec métriques HRV et cohérence cardiaque. Remplace storage in-memory.';

COMMENT ON TABLE public.vr_dome_sessions IS 
'Sessions VR collectives Glow-Collective avec synchronisation de groupe. Remplace storage in-memory.';

-- ============================================
-- 5. VÉRIFICATIONS
-- ============================================

DO $$
DECLARE
  nebula_rls BOOLEAN;
  dome_rls BOOLEAN;
BEGIN
  SELECT relrowsecurity INTO nebula_rls
  FROM pg_class
  WHERE relname = 'vr_nebula_sessions';
  
  SELECT relrowsecurity INTO dome_rls
  FROM pg_class
  WHERE relname = 'vr_dome_sessions';
  
  IF NOT nebula_rls THEN
    RAISE EXCEPTION 'RLS not enabled on vr_nebula_sessions';
  END IF;
  
  IF NOT dome_rls THEN
    RAISE EXCEPTION 'RLS not enabled on vr_dome_sessions';
  END IF;
  
  RAISE NOTICE 'RLS correctly enabled on VR tables';
END $$;