
-- =====================================================
-- FIX: Récursion infinie RLS sur organization_members et org_memberships
-- Solution: Créer des fonctions SECURITY DEFINER pour éviter l'auto-référence
-- =====================================================

-- 1. Créer la fonction is_org_member() pour organization_members
CREATE OR REPLACE FUNCTION public.is_org_member(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE user_id = _user_id AND organization_id = _org_id
  )
$$;

-- 2. Créer la fonction is_org_admin_or_manager() pour les permissions élevées
CREATE OR REPLACE FUNCTION public.is_org_admin_or_manager(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE user_id = _user_id 
    AND organization_id = _org_id
    AND role IN ('admin', 'manager')
  )
$$;

-- 3. Créer la fonction is_org_membership_member() pour org_memberships
CREATE OR REPLACE FUNCTION public.is_org_membership_member(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.org_memberships
    WHERE user_id = _user_id AND org_id = _org_id
  )
$$;

-- 4. Créer la fonction is_org_membership_admin() pour org_memberships
CREATE OR REPLACE FUNCTION public.is_org_membership_admin(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.org_memberships
    WHERE user_id = _user_id 
    AND org_id = _org_id 
    AND role = 'admin'
  )
$$;

-- =====================================================
-- RÉÉCRITURE DES POLITIQUES RLS - organization_members
-- =====================================================

-- Supprimer les anciennes politiques problématiques
DROP POLICY IF EXISTS "Users can view members of their organizations" ON public.organization_members;
DROP POLICY IF EXISTS "Users can view their organization memberships" ON public.organization_members;

-- Recréer avec fonctions SECURITY DEFINER (sans récursion)
CREATE POLICY "Users can view members of their organizations"
ON public.organization_members
FOR SELECT
USING (
  public.is_org_member(auth.uid(), organization_id)
);

CREATE POLICY "Users can view their own membership"
ON public.organization_members
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage organization members"
ON public.organization_members
FOR ALL
USING (
  public.is_org_admin_or_manager(auth.uid(), organization_id)
)
WITH CHECK (
  public.is_org_admin_or_manager(auth.uid(), organization_id)
);

-- =====================================================
-- RÉÉCRITURE DES POLITIQUES RLS - org_memberships
-- =====================================================

-- Supprimer les anciennes politiques problématiques
DROP POLICY IF EXISTS "Admins can manage memberships" ON public.org_memberships;
DROP POLICY IF EXISTS "Managers can view team summaries" ON public.org_memberships;
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.org_memberships;
DROP POLICY IF EXISTS "Users can manage their own memberships" ON public.org_memberships;
DROP POLICY IF EXISTS "Service role can manage all memberships" ON public.org_memberships;

-- Recréer avec fonctions SECURITY DEFINER (sans récursion)
CREATE POLICY "Users can view their own org_membership"
ON public.org_memberships
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can view org_memberships of their org"
ON public.org_memberships
FOR SELECT
USING (
  public.is_org_membership_member(auth.uid(), org_id)
);

CREATE POLICY "Users can manage their own org_membership"
ON public.org_memberships
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all org_memberships"
ON public.org_memberships
FOR ALL
USING (
  public.is_org_membership_admin(auth.uid(), org_id)
)
WITH CHECK (
  public.is_org_membership_admin(auth.uid(), org_id)
);

CREATE POLICY "Service role full access on org_memberships"
ON public.org_memberships
FOR ALL
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- =====================================================
-- GRANT des permissions sur les nouvelles fonctions
-- =====================================================
GRANT EXECUTE ON FUNCTION public.is_org_member(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_admin_or_manager(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_membership_member(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_membership_admin(UUID, UUID) TO authenticated;
