-- ============================================
-- JOUR 3 - VAGUE 1 : MIGRATION SÉCURITÉ (v2)
-- Remplacer profiles.role par has_role() dans les politiques
-- ============================================

-- 1. Remplacer la fonction is_admin() pour utiliser has_role()
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;

COMMENT ON FUNCTION public.is_admin IS 'Vérifie si l''utilisateur connecté est admin via user_roles';

-- 2. Recréer les politiques admin_changelog
DROP POLICY IF EXISTS "Admin role only changelog access" ON public.admin_changelog;

CREATE POLICY "admin_changelog_admin_access"
ON public.admin_changelog
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. Recréer les politiques cleanup_history
DROP POLICY IF EXISTS "Admins can manage cleanup history" ON public.cleanup_history;
DROP POLICY IF EXISTS "Admins can view cleanup history" ON public.cleanup_history;

CREATE POLICY "cleanup_history_admin_access"
ON public.cleanup_history
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Fonction helper pour vérifier les rôles d'organisation
CREATE OR REPLACE FUNCTION public.has_org_role(_user_id UUID, _org_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.org_memberships
    WHERE user_id = _user_id
      AND org_id = _org_id
      AND role = _role
  )
$$;

COMMENT ON FUNCTION public.has_org_role IS 'Vérifie le rôle d''un utilisateur dans une organisation';

-- 5. Créer index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_org_memberships_lookup 
ON public.org_memberships(user_id, org_id, role);

-- 6. Ajouter des commentaires pour la documentation
COMMENT ON POLICY "admin_changelog_admin_access" ON public.admin_changelog 
IS 'Seuls les admins peuvent gérer le changelog admin';

COMMENT ON POLICY "cleanup_history_admin_access" ON public.cleanup_history 
IS 'Seuls les admins peuvent gérer l''historique de nettoyage';