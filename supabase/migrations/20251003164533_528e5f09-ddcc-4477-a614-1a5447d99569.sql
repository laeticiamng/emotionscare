-- JOUR 4 - PHASE 3 : Migration Breath In-Memory → Supabase
-- Date: 2025-10-03
-- Objectif: Créer tables Breath avec RLS pour métriques respiration

-- ============================================
-- 1. TABLES BREATH METRICS
-- ============================================

-- Table métriques respiration hebdomadaires (utilisateur)
CREATE TABLE IF NOT EXISTS public.breath_weekly_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL,
  hrv_stress_idx DECIMAL(5,2),
  coherence_avg DECIMAL(5,2),
  mvpa_week INTEGER,
  relax_idx DECIMAL(5,2),
  mindfulness_avg DECIMAL(5,2),
  mood_score DECIMAL(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_start)
);

CREATE INDEX IF NOT EXISTS idx_breath_weekly_user 
ON breath_weekly_metrics(user_id, week_start DESC);

-- Table métriques respiration hebdomadaires (organisation)
CREATE TABLE IF NOT EXISTS public.breath_weekly_org_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  week_start DATE NOT NULL,
  members INTEGER DEFAULT 0,
  org_hrv_idx DECIMAL(5,2),
  org_coherence DECIMAL(5,2),
  org_mvpa INTEGER,
  org_relax DECIMAL(5,2),
  org_mindfulness DECIMAL(5,2),
  org_mood DECIMAL(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(org_id, week_start)
);

CREATE INDEX IF NOT EXISTS idx_breath_weekly_org 
ON breath_weekly_org_metrics(org_id, week_start DESC);

-- ============================================
-- 2. TRIGGERS AUTO-UPDATE
-- ============================================

CREATE OR REPLACE FUNCTION public.update_breath_weekly_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_breath_weekly_updated
BEFORE UPDATE ON public.breath_weekly_metrics
FOR EACH ROW EXECUTE FUNCTION public.update_breath_weekly_updated_at();

CREATE TRIGGER trg_breath_weekly_org_updated
BEFORE UPDATE ON public.breath_weekly_org_metrics
FOR EACH ROW EXECUTE FUNCTION public.update_breath_weekly_updated_at();

-- ============================================
-- 3. RLS POLICIES
-- ============================================

ALTER TABLE public.breath_weekly_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breath_weekly_org_metrics ENABLE ROW LEVEL SECURITY;

-- Breath metrics policies (utilisateur)
CREATE POLICY "breath_metrics_select_own"
  ON public.breath_weekly_metrics
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "breath_metrics_insert_own"
  ON public.breath_weekly_metrics
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "breath_metrics_update_own"
  ON public.breath_weekly_metrics
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "breath_metrics_delete_own"
  ON public.breath_weekly_metrics
  FOR DELETE
  USING (auth.uid() = user_id);

-- Breath org metrics policies (organisation)
CREATE POLICY "breath_org_select_members"
  ON public.breath_weekly_org_metrics
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE org_memberships.org_id = breath_weekly_org_metrics.org_id
      AND org_memberships.user_id = auth.uid()
    )
  );

CREATE POLICY "breath_org_insert_admin"
  ON public.breath_weekly_org_metrics
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE org_memberships.org_id = breath_weekly_org_metrics.org_id
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role IN ('admin', 'manager')
    )
  );

CREATE POLICY "breath_org_update_admin"
  ON public.breath_weekly_org_metrics
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE org_memberships.org_id = breath_weekly_org_metrics.org_id
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role IN ('admin', 'manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE org_memberships.org_id = breath_weekly_org_metrics.org_id
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role IN ('admin', 'manager')
    )
  );

-- ============================================
-- 4. DOCUMENTATION
-- ============================================

COMMENT ON TABLE public.breath_weekly_metrics IS 
'Métriques hebdomadaires de respiration/cohérence cardiaque par utilisateur. Remplace storage in-memory.';

COMMENT ON TABLE public.breath_weekly_org_metrics IS 
'Agrégations hebdomadaires des métriques breath par organisation. Remplace storage in-memory.';

COMMENT ON COLUMN public.breath_weekly_metrics.hrv_stress_idx IS 
'Indice de stress basé sur la variabilité cardiaque (0-100)';

COMMENT ON COLUMN public.breath_weekly_metrics.coherence_avg IS 
'Score de cohérence cardiaque moyen sur la semaine (0-1)';

COMMENT ON COLUMN public.breath_weekly_metrics.mvpa_week IS 
'Minutes d''activité physique modérée à vigoureuse par semaine';

-- ============================================
-- 5. VÉRIFICATIONS
-- ============================================

DO $$
DECLARE
  breath_rls BOOLEAN;
  breath_org_rls BOOLEAN;
BEGIN
  SELECT relrowsecurity INTO breath_rls
  FROM pg_class
  WHERE relname = 'breath_weekly_metrics';
  
  SELECT relrowsecurity INTO breath_org_rls
  FROM pg_class
  WHERE relname = 'breath_weekly_org_metrics';
  
  IF NOT breath_rls THEN
    RAISE EXCEPTION 'RLS not enabled on breath_weekly_metrics';
  END IF;
  
  IF NOT breath_org_rls THEN
    RAISE EXCEPTION 'RLS not enabled on breath_weekly_org_metrics';
  END IF;
  
  RAISE NOTICE 'RLS correctly enabled on Breath tables';
END $$;