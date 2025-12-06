-- ============================================
-- JOUR 3 - VAGUE 1 : MIGRATION SÉCURITÉ CRITIQUE (v2)
-- Création table user_roles + fonction has_role()
-- ============================================

-- 1. Créer l'enum des rôles applicatifs (incluant b2c existant)
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user', 'b2c');

-- 2. Créer la table user_roles (stockage sécurisé des rôles)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  notes TEXT,
  UNIQUE (user_id, role)
);

-- 3. Activer RLS sur user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Créer la fonction SECURITY DEFINER pour éviter récursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 5. Policy : Users peuvent voir leurs propres rôles
CREATE POLICY "user_roles_select_own"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- 6. Policy : Seulement admins peuvent créer/modifier des rôles
CREATE POLICY "user_roles_admin_manage"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 7. Policy : Service role peut tout gérer
CREATE POLICY "user_roles_service_role"
ON public.user_roles
FOR ALL
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- 8. Migrer les rôles existants depuis profiles
INSERT INTO public.user_roles (user_id, role, created_at)
SELECT id, role::public.app_role, created_at
FROM profiles 
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- 9. Créer index pour performances
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);

-- 10. Commenter la table et fonction
COMMENT ON TABLE public.user_roles IS 'Table sécurisée pour stockage des rôles utilisateur - évite récursion RLS';
COMMENT ON FUNCTION public.has_role IS 'Fonction SECURITY DEFINER pour vérifier rôles sans récursion RLS';
