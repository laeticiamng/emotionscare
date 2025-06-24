-- B2B core schema for organizations, teams, achievements

-- Organizations table
CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  domain varchar(255) UNIQUE,
  subscription_plan varchar(50) DEFAULT 'basic',
  max_users integer DEFAULT 50,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Extend profiles with organization fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES organizations(id),
  ADD COLUMN IF NOT EXISTS department varchar(100),
  ADD COLUMN IF NOT EXISTS position varchar(100),
  ADD COLUMN IF NOT EXISTS manager_id uuid REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- Teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  name varchar(255) NOT NULL,
  description text,
  admin_id uuid REFERENCES profiles(id) NOT NULL,
  member_count integer DEFAULT 0,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Team members association
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role varchar(50) DEFAULT 'member',
  joined_at timestamptz DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Achievements
CREATE TABLE IF NOT EXISTS public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  description text,
  icon varchar(100),
  points integer DEFAULT 0,
  category varchar(50),
  criteria jsonb NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  achievement_id uuid REFERENCES achievements(id) NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  progress jsonb DEFAULT '{}',
  UNIQUE(user_id, achievement_id)
);

-- Audit logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  organization_id uuid REFERENCES organizations(id),
  action varchar(100) NOT NULL,
  resource_type varchar(100),
  resource_id uuid,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id
  ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id_created_at
  ON public.audit_logs(user_id, created_at DESC);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
