-- ============================================
-- JOUR 3 - VAGUE 1 : STEP 5 - Sécuriser api_integrations
-- Restreindre les accès admin uniquement (pas service_role)
-- ============================================

-- 1. Supprimer les anciennes politiques trop permissives
DROP POLICY IF EXISTS "Service role can manage API integrations" ON public.api_integrations;
DROP POLICY IF EXISTS "Service role can manage integrations" ON public.api_integrations;
DROP POLICY IF EXISTS "Public can view API integrations" ON public.api_integrations;

-- 2. Créer des politiques restrictives pour les admins
CREATE POLICY "api_integrations_admin_select"
ON public.api_integrations
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "api_integrations_admin_insert"
ON public.api_integrations
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "api_integrations_admin_update"
ON public.api_integrations
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "api_integrations_admin_delete"
ON public.api_integrations
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- 3. Ajouter des commentaires pour la documentation
COMMENT ON POLICY "api_integrations_admin_select" ON public.api_integrations 
IS 'Seuls les admins peuvent consulter les intégrations API';

COMMENT ON POLICY "api_integrations_admin_insert" ON public.api_integrations 
IS 'Seuls les admins peuvent créer des intégrations API';

COMMENT ON POLICY "api_integrations_admin_update" ON public.api_integrations 
IS 'Seuls les admins peuvent modifier les intégrations API';

COMMENT ON POLICY "api_integrations_admin_delete" ON public.api_integrations 
IS 'Seuls les admins peuvent supprimer les intégrations API';