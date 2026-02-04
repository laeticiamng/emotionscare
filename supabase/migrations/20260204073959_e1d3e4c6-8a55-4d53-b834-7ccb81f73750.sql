-- Correction: Supprimer et recréer is_owner avec le bon nom de paramètre
DROP FUNCTION IF EXISTS public.is_owner(uuid);

CREATE FUNCTION public.is_owner(record_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() = record_user_id;
$$;

-- Corriger les policies RLS permissives
DROP POLICY IF EXISTS "Allow insert pwa_metrics" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_insert_policy" ON public.pwa_metrics;
CREATE POLICY "Authenticated users can insert pwa_metrics"
ON public.pwa_metrics
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow insert user_feedback" ON public.user_feedback;
DROP POLICY IF EXISTS "user_feedback_insert_policy" ON public.user_feedback;
CREATE POLICY "Users can insert own feedback"
ON public.user_feedback
FOR INSERT
WITH CHECK (auth.uid() = user_id);