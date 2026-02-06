
-- =====================================================
-- FIX: Replace auth.users references with public.profiles
-- in 9 RLS policies across 5 tables
-- =====================================================

-- 1. "Digital Medicine" - ALL policy
DROP POLICY IF EXISTS "Users can manage their own digital medicine subscription" ON public."Digital Medicine";
CREATE POLICY "Users can manage their own digital medicine subscription"
  ON public."Digital Medicine" FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.email = "Digital Medicine".email))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.email = "Digital Medicine".email));

-- 2. abonnement_biovida - ALL policy
DROP POLICY IF EXISTS "Users can manage their own biovida subscription" ON public.abonnement_biovida;
CREATE POLICY "Users can manage their own biovida subscription"
  ON public.abonnement_biovida FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.email = abonnement_biovida.email))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.email = abonnement_biovida.email));

-- 3. abonnement_fiches - SELECT policy
DROP POLICY IF EXISTS "Users can read their own fiches subscription" ON public.abonnement_fiches;
CREATE POLICY "Users can read their own fiches subscription"
  ON public.abonnement_fiches FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.email = abonnement_fiches.email));

-- 4. abonnement_fiches - INSERT policy
DROP POLICY IF EXISTS "Users can insert their own fiches subscription" ON public.abonnement_fiches;
CREATE POLICY "Users can insert their own fiches subscription"
  ON public.abonnement_fiches FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.email = abonnement_fiches.email));

-- 5. biovida_analyses - SELECT policy
DROP POLICY IF EXISTS "Users can select their own medical analyses" ON public.biovida_analyses;
CREATE POLICY "Users can select their own medical analyses"
  ON public.biovida_analyses FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.email = biovida_analyses.email));

-- 6. biovida_analyses - INSERT policy
DROP POLICY IF EXISTS "Users can insert their own medical analyses" ON public.biovida_analyses;
CREATE POLICY "Users can insert their own medical analyses"
  ON public.biovida_analyses FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.email = biovida_analyses.email));

-- 7. biovida_analyses - UPDATE policy
DROP POLICY IF EXISTS "Users can update their own medical analyses" ON public.biovida_analyses;
CREATE POLICY "Users can update their own medical analyses"
  ON public.biovida_analyses FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.email = biovida_analyses.email))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.email = biovida_analyses.email));

-- 8. biovida_analyses - DELETE policy
DROP POLICY IF EXISTS "Users can delete their own medical analyses" ON public.biovida_analyses;
CREATE POLICY "Users can delete their own medical analyses"
  ON public.biovida_analyses FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.email = biovida_analyses.email));

-- 9. notification_filter_templates - SELECT policy (fix shared_with_team check)
DROP POLICY IF EXISTS "Users can view accessible templates" ON public.notification_filter_templates;
CREATE POLICY "Users can view accessible templates"
  ON public.notification_filter_templates FOR SELECT
  USING (
    (auth.uid() = user_id)
    OR (is_shared = true)
    OR (shared_with_team = true AND EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid()))
    OR ((auth.uid())::text = ANY (shared_with_users))
  );
