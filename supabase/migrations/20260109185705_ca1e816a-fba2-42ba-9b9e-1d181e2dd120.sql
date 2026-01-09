-- =============================================
-- SCHEMA B2B EMOTIONSCARE - INSTITUTIONS
-- =============================================

-- 1. Organisation Settings étendu
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS org_type TEXT DEFAULT 'enterprise';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS size_category TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'basic';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS max_users INTEGER DEFAULT 50;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS access_code TEXT UNIQUE;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS ethical_charter_accepted BOOLEAN DEFAULT false;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS ethical_charter_accepted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS privacy_settings JSONB DEFAULT '{"anonymous_only": true, "individual_tracking": false, "data_retention_days": 90}'::jsonb;

-- 2. Table pour les codes d'accès institutionnels
CREATE TABLE IF NOT EXISTS public.org_access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  code_type TEXT NOT NULL DEFAULT 'link', -- 'link', 'qr', 'sso'
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Table pour les sessions anonymes B2B
CREATE TABLE IF NOT EXISTS public.b2b_anonymous_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  session_hash TEXT NOT NULL, -- hash de l'identifiant, pas l'identifiant lui-même
  access_code_id UUID REFERENCES org_access_codes(id),
  session_type TEXT NOT NULL DEFAULT 'wellness', -- wellness, scan, music, breath
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Données agrégées quotidiennes (anonymisées)
CREATE TABLE IF NOT EXISTS public.org_daily_aggregates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  team_id UUID, -- null = org-wide
  total_sessions INTEGER DEFAULT 0,
  unique_users_hash_count INTEGER DEFAULT 0, -- nombre de hash uniques
  sessions_by_type JSONB DEFAULT '{}'::jsonb, -- {"scan": 5, "music": 10, "breath": 3}
  sessions_by_hour JSONB DEFAULT '{}'::jsonb, -- {"09": 5, "10": 8, ...}
  avg_duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(org_id, date, team_id)
);

-- 5. Données agrégées hebdomadaires (anonymisées)
CREATE TABLE IF NOT EXISTS public.org_weekly_aggregates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  team_id UUID,
  total_sessions INTEGER DEFAULT 0,
  unique_users_hash_count INTEGER DEFAULT 0,
  adoption_rate DECIMAL(5,2), -- pourcentage d'utilisation
  sessions_by_type JSONB DEFAULT '{}'::jsonb,
  peak_usage_hours JSONB DEFAULT '[]'::jsonb,
  most_used_features JSONB DEFAULT '[]'::jsonb,
  trend_vs_previous_week DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(org_id, week_start, team_id)
);

-- 6. Table des événements bien-être B2B
CREATE TABLE IF NOT EXISTS public.org_wellness_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL DEFAULT 'session', -- session, workshop, challenge
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT, -- RRULE format
  created_by UUID,
  status TEXT DEFAULT 'scheduled', -- scheduled, ongoing, completed, cancelled
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Teams B2B (si pas déjà existante)
CREATE TABLE IF NOT EXISTS public.org_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  manager_id UUID,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(org_id, name)
);

-- 8. Charte éthique / Disclaimers
CREATE TABLE IF NOT EXISTS public.org_ethical_disclaimers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  accepted_by UUID,
  accepted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  disclaimer_version TEXT NOT NULL DEFAULT '1.0',
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 9. Rapports mensuels B2B
CREATE TABLE IF NOT EXISTS public.org_monthly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  report_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  generated_by UUID,
  status TEXT DEFAULT 'draft', -- draft, final
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(org_id, month, year)
);

-- 10. Indices pour performance
CREATE INDEX IF NOT EXISTS idx_org_access_codes_org ON org_access_codes(org_id);
CREATE INDEX IF NOT EXISTS idx_org_access_codes_code ON org_access_codes(code);
CREATE INDEX IF NOT EXISTS idx_b2b_sessions_org ON b2b_anonymous_sessions(org_id);
CREATE INDEX IF NOT EXISTS idx_b2b_sessions_date ON b2b_anonymous_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_org_daily_agg_org_date ON org_daily_aggregates(org_id, date);
CREATE INDEX IF NOT EXISTS idx_org_weekly_agg_org_week ON org_weekly_aggregates(org_id, week_start);
CREATE INDEX IF NOT EXISTS idx_org_teams_org ON org_teams(org_id);
CREATE INDEX IF NOT EXISTS idx_org_events_org_date ON org_wellness_events(org_id, event_date);

-- 11. RLS pour organisations
ALTER TABLE org_access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_anonymous_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_daily_aggregates ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_weekly_aggregates ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_wellness_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_ethical_disclaimers ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_monthly_reports ENABLE ROW LEVEL SECURITY;

-- 12. Function pour vérifier appartenance à une org
CREATE OR REPLACE FUNCTION public.is_org_member(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM org_memberships
    WHERE user_id = _user_id AND org_id = _org_id
  )
$$;

-- 13. Function pour vérifier admin org
CREATE OR REPLACE FUNCTION public.is_org_admin(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM org_memberships
    WHERE user_id = _user_id 
    AND org_id = _org_id 
    AND role IN ('admin', 'manager', 'owner')
  )
$$;

-- 14. RLS Policies
-- org_access_codes: admins can manage
CREATE POLICY "org_access_codes_admin_all" ON org_access_codes
  FOR ALL TO authenticated
  USING (public.is_org_admin(auth.uid(), org_id))
  WITH CHECK (public.is_org_admin(auth.uid(), org_id));

-- b2b_anonymous_sessions: insert only via service role, select by org members
CREATE POLICY "b2b_sessions_insert" ON b2b_anonymous_sessions
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "b2b_sessions_select_admin" ON b2b_anonymous_sessions
  FOR SELECT TO authenticated
  USING (public.is_org_admin(auth.uid(), org_id));

-- org_daily_aggregates: read by org members
CREATE POLICY "org_daily_agg_select" ON org_daily_aggregates
  FOR SELECT TO authenticated
  USING (public.is_org_member(auth.uid(), org_id));

-- org_weekly_aggregates: read by org members
CREATE POLICY "org_weekly_agg_select" ON org_weekly_aggregates
  FOR SELECT TO authenticated
  USING (public.is_org_member(auth.uid(), org_id));

-- org_wellness_events: manage by admins, read by members
CREATE POLICY "org_events_select" ON org_wellness_events
  FOR SELECT TO authenticated
  USING (public.is_org_member(auth.uid(), org_id));

CREATE POLICY "org_events_manage" ON org_wellness_events
  FOR ALL TO authenticated
  USING (public.is_org_admin(auth.uid(), org_id))
  WITH CHECK (public.is_org_admin(auth.uid(), org_id));

-- org_teams: manage by admins, read by members
CREATE POLICY "org_teams_select" ON org_teams
  FOR SELECT TO authenticated
  USING (public.is_org_member(auth.uid(), org_id));

CREATE POLICY "org_teams_manage" ON org_teams
  FOR ALL TO authenticated
  USING (public.is_org_admin(auth.uid(), org_id))
  WITH CHECK (public.is_org_admin(auth.uid(), org_id));

-- org_ethical_disclaimers: insert by anyone, select by org members
CREATE POLICY "org_disclaimers_insert" ON org_ethical_disclaimers
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "org_disclaimers_select" ON org_ethical_disclaimers
  FOR SELECT TO authenticated
  USING (public.is_org_member(auth.uid(), org_id));

-- org_monthly_reports: manage by admins
CREATE POLICY "org_reports_select" ON org_monthly_reports
  FOR SELECT TO authenticated
  USING (public.is_org_member(auth.uid(), org_id));

CREATE POLICY "org_reports_manage" ON org_monthly_reports
  FOR ALL TO authenticated
  USING (public.is_org_admin(auth.uid(), org_id))
  WITH CHECK (public.is_org_admin(auth.uid(), org_id));