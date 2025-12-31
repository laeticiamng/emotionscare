-- Créer le type enum pour les rôles B2B
CREATE TYPE public.b2b_role AS ENUM ('b2b_admin', 'b2b_manager', 'b2b_member', 'b2b_viewer');

-- Table des rôles utilisateurs B2B
CREATE TABLE public.b2b_user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    org_id UUID NOT NULL,
    role b2b_role NOT NULL DEFAULT 'b2b_member',
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    UNIQUE (user_id, org_id, role)
);

-- Enable RLS
ALTER TABLE public.b2b_user_roles ENABLE ROW LEVEL SECURITY;

-- Index pour performances
CREATE INDEX idx_b2b_user_roles_user_id ON public.b2b_user_roles(user_id);
CREATE INDEX idx_b2b_user_roles_org_id ON public.b2b_user_roles(org_id);

-- Fonction SECURITY DEFINER pour vérifier les rôles (évite récursion RLS)
CREATE OR REPLACE FUNCTION public.has_b2b_role(_user_id UUID, _org_id UUID, _role b2b_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.b2b_user_roles
    WHERE user_id = _user_id
      AND org_id = _org_id
      AND role = _role
      AND (expires_at IS NULL OR expires_at > now())
  )
$$;

-- Fonction pour vérifier si l'utilisateur a au moins un rôle dans l'org
CREATE OR REPLACE FUNCTION public.has_any_b2b_role(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.b2b_user_roles
    WHERE user_id = _user_id
      AND org_id = _org_id
      AND (expires_at IS NULL OR expires_at > now())
  )
$$;

-- Fonction pour obtenir le rôle le plus élevé d'un utilisateur
CREATE OR REPLACE FUNCTION public.get_highest_b2b_role(_user_id UUID, _org_id UUID)
RETURNS b2b_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.b2b_user_roles
  WHERE user_id = _user_id
    AND org_id = _org_id
    AND (expires_at IS NULL OR expires_at > now())
  ORDER BY 
    CASE role
      WHEN 'b2b_admin' THEN 1
      WHEN 'b2b_manager' THEN 2
      WHEN 'b2b_member' THEN 3
      WHEN 'b2b_viewer' THEN 4
    END
  LIMIT 1
$$;

-- Policies RLS pour b2b_user_roles
CREATE POLICY "Users can view their own roles"
ON public.b2b_user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles in their org"
ON public.b2b_user_roles
FOR SELECT
USING (public.has_b2b_role(auth.uid(), org_id, 'b2b_admin'));

CREATE POLICY "Admins can manage roles in their org"
ON public.b2b_user_roles
FOR ALL
USING (public.has_b2b_role(auth.uid(), org_id, 'b2b_admin'));

-- Table des logs d'audit B2B (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS public.b2b_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    user_id UUID NOT NULL,
    user_email TEXT,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS sur audit logs
ALTER TABLE public.b2b_audit_logs ENABLE ROW LEVEL SECURITY;

-- Index pour audit logs
CREATE INDEX IF NOT EXISTS idx_b2b_audit_logs_org_id ON public.b2b_audit_logs(org_id);
CREATE INDEX IF NOT EXISTS idx_b2b_audit_logs_created_at ON public.b2b_audit_logs(created_at DESC);

-- Policies pour audit logs
CREATE POLICY "Admins and managers can view audit logs"
ON public.b2b_audit_logs
FOR SELECT
USING (
  public.has_b2b_role(auth.uid(), org_id, 'b2b_admin') OR 
  public.has_b2b_role(auth.uid(), org_id, 'b2b_manager')
);

-- Table des rapports B2B (enrichie)
CREATE TABLE IF NOT EXISTS public.b2b_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL,
    period TEXT NOT NULL,
    title TEXT,
    narrative TEXT,
    metrics JSONB DEFAULT '{"avgWellness": 0, "engagement": 0, "participation": 0, "alerts": 0}',
    report_type TEXT DEFAULT 'monthly',
    content JSONB,
    generated_by UUID,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.b2b_reports ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_b2b_reports_org_period ON public.b2b_reports(org_id, period DESC);

CREATE POLICY "Org members can view reports"
ON public.b2b_reports
FOR SELECT
USING (public.has_any_b2b_role(auth.uid(), org_id));

CREATE POLICY "Admins can manage reports"
ON public.b2b_reports
FOR ALL
USING (public.has_b2b_role(auth.uid(), org_id, 'b2b_admin'));