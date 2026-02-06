
-- =============================================
-- FIX 1: Replace RLS policies that query auth.users directly
-- =============================================

-- monitoring_events
DROP POLICY IF EXISTS "Admin users can view all monitoring events" ON public.monitoring_events;
CREATE POLICY "Admin users can view all monitoring events"
  ON public.monitoring_events FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- invitations
DROP POLICY IF EXISTS "Admins can insert invitations" ON public.invitations;
CREATE POLICY "Admins can insert invitations"
  ON public.invitations FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update invitations" ON public.invitations;
CREATE POLICY "Admins can update invitations"
  ON public.invitations FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can view invitations" ON public.invitations;
CREATE POLICY "Admins can view invitations"
  ON public.invitations FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- pseudonymization_keys
DROP POLICY IF EXISTS "Admins can manage pseudonymization keys" ON public.pseudonymization_keys;
CREATE POLICY "Admins can manage pseudonymization keys"
  ON public.pseudonymization_keys FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- pseudonymization_rules
DROP POLICY IF EXISTS "Admins can manage pseudonymization rules" ON public.pseudonymization_rules;
CREATE POLICY "Admins can manage pseudonymization rules"
  ON public.pseudonymization_rules FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- pseudonymization_log
DROP POLICY IF EXISTS "Admins can view pseudonymization logs" ON public.pseudonymization_log;
CREATE POLICY "Admins can view pseudonymization logs"
  ON public.pseudonymization_log FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- pseudonymization_stats
DROP POLICY IF EXISTS "Admins can view pseudonymization stats" ON public.pseudonymization_stats;
CREATE POLICY "Admins can view pseudonymization stats"
  ON public.pseudonymization_stats FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- tournaments
DROP POLICY IF EXISTS "Admins can manage tournaments" ON public.tournaments;
CREATE POLICY "Admins can manage tournaments"
  ON public.tournaments FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- biovida_analyses
DROP POLICY IF EXISTS "Users access own biovida analyses by email" ON public.biovida_analyses;
CREATE POLICY "Users access own biovida analyses by email"
  ON public.biovida_analyses FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.email = biovida_analyses.email
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.email = biovida_analyses.email
  ));

-- =============================================
-- FIX 2: Add missing edn_items.specialty column
-- =============================================
ALTER TABLE public.edn_items
  ADD COLUMN IF NOT EXISTS specialty text;
