-- Permettre aux utilisateurs de lire les organisations qui ont des codes d'accès actifs
CREATE POLICY "Anyone can view organizations with active access codes"
ON public.organizations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.org_access_codes
    WHERE org_access_codes.org_id = organizations.id
    AND org_access_codes.is_active = true
  )
);