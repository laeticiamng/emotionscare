-- Ajouter une policy pour permettre aux utilisateurs anonymes de vérifier les codes d'accès
CREATE POLICY "Anyone can verify access codes"
ON public.org_access_codes
FOR SELECT
USING (is_active = true);