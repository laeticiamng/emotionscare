-- ═══════════════════════════════════════════════════════════
-- TIMECRAFT - Tables pour le module de design du temps
-- ═══════════════════════════════════════════════════════════

-- Types de blocs temporels
CREATE TYPE public.time_block_type AS ENUM (
  'creation',      -- Temps de création, flow
  'recovery',      -- Repos, récupération
  'constraint',    -- Contraintes, obligations
  'emotional',     -- Charge émotionnelle forte
  'chosen',        -- Temps choisi
  'imposed',       -- Temps subi
  'decision',      -- Prise de décision
  'urgency',       -- Urgences
  'routine',       -- Routine, automatismes
  'exposure'       -- Exposition sociale/publique
);

-- Table des blocs temporels (B2C)
CREATE TABLE public.time_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  version_id UUID,
  block_type public.time_block_type NOT NULL,
  label TEXT,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_hour INTEGER CHECK (start_hour >= 0 AND start_hour <= 23),
  duration_hours NUMERIC(4,2) CHECK (duration_hours > 0 AND duration_hours <= 24),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  emotional_charge INTEGER CHECK (emotional_charge >= 1 AND emotional_charge <= 10),
  is_ideal BOOLEAN DEFAULT false,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des versions de trajectoires temporelles
CREATE TABLE public.time_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  version_type TEXT DEFAULT 'current' CHECK (version_type IN ('current', 'ideal', 'past', 'scenario')),
  is_active BOOLEAN DEFAULT true,
  snapshot_data JSONB,
  insights JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des insights temporels générés
CREATE TABLE public.time_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  version_id UUID REFERENCES public.time_versions(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  data JSONB,
  is_dismissed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table B2B : agrégats temporels par organisation
CREATE TABLE public.org_time_aggregates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  team_id UUID,
  department TEXT,
  aggregation_type TEXT DEFAULT 'weekly',
  metrics JSONB NOT NULL DEFAULT '{}',
  block_distribution JSONB DEFAULT '{}',
  risk_zones JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  cohort_size INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(org_id, period_start, period_end, team_id, department)
);

-- Table B2B : scénarios organisationnels
CREATE TABLE public.org_time_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  scenario_type TEXT DEFAULT 'projected' CHECK (scenario_type IN ('current', 'projected', 'historical')),
  configuration JSONB NOT NULL DEFAULT '{}',
  impact_analysis JSONB,
  created_by UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes pour performance
CREATE INDEX idx_time_blocks_user ON public.time_blocks(user_id);
CREATE INDEX idx_time_blocks_version ON public.time_blocks(version_id);
CREATE INDEX idx_time_blocks_type ON public.time_blocks(block_type);
CREATE INDEX idx_time_versions_user ON public.time_versions(user_id);
CREATE INDEX idx_time_insights_user ON public.time_insights(user_id);
CREATE INDEX idx_org_time_aggregates_org ON public.org_time_aggregates(org_id);
CREATE INDEX idx_org_time_aggregates_period ON public.org_time_aggregates(period_start, period_end);
CREATE INDEX idx_org_time_scenarios_org ON public.org_time_scenarios(org_id);

-- Enable RLS
ALTER TABLE public.time_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_time_aggregates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_time_scenarios ENABLE ROW LEVEL SECURITY;

-- RLS Policies B2C
CREATE POLICY "Users can manage their own time blocks"
  ON public.time_blocks FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own time versions"
  ON public.time_versions FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own insights"
  ON public.time_insights FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies B2B (accès agrégé pour admins org)
CREATE POLICY "Org admins can view time aggregates"
  ON public.org_time_aggregates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.org_memberships 
      WHERE org_memberships.org_id = org_time_aggregates.org_id 
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Org admins can manage time scenarios"
  ON public.org_time_scenarios FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.org_memberships 
      WHERE org_memberships.org_id = org_time_scenarios.org_id 
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role IN ('admin', 'manager')
    )
  );

-- Trigger pour updated_at
CREATE TRIGGER update_time_blocks_updated_at
  BEFORE UPDATE ON public.time_blocks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_time_versions_updated_at
  BEFORE UPDATE ON public.time_versions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_org_time_scenarios_updated_at
  BEFORE UPDATE ON public.org_time_scenarios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();