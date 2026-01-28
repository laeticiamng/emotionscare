-- Migration: Hardening RLS pwa_metrics + fix search_path
-- Date: 2026-01-29

-- 1. Drop overly permissive policies on pwa_metrics
DROP POLICY IF EXISTS "pwa_metrics_insert_public" ON public.pwa_metrics;
DROP POLICY IF EXISTS "Anyone can insert pwa_metrics" ON public.pwa_metrics;
DROP POLICY IF EXISTS "Anyone can update their own session metrics" ON public.pwa_metrics;

-- 2. Create secure owner-based policies
CREATE POLICY "pwa_metrics_owner_insert" ON public.pwa_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "pwa_metrics_owner_select" ON public.pwa_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "pwa_metrics_owner_update" ON public.pwa_metrics
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3. Allow service_role full access for analytics
CREATE POLICY "pwa_metrics_service_role" ON public.pwa_metrics
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- 4. Fix search_path on critical functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 5. RLS policies for breath_sessions (table exists)
ALTER TABLE public.breath_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "breath_sessions_owner_all" ON public.breath_sessions;
CREATE POLICY "breath_sessions_owner_all" ON public.breath_sessions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6. Index for performance
CREATE INDEX IF NOT EXISTS idx_breath_sessions_user_date 
  ON public.breath_sessions(user_id, started_at DESC);

-- 7. Trigger to update user_stats on breath session completion
CREATE OR REPLACE FUNCTION public.update_stats_on_breath_session()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total breath minutes in user_stats
  INSERT INTO public.user_stats (user_id, total_breath_minutes, updated_at)
  VALUES (NEW.user_id, COALESCE(NEW.duration_seconds, 0) / 60.0, now())
  ON CONFLICT (user_id) DO UPDATE SET
    total_breath_minutes = COALESCE(user_stats.total_breath_minutes, 0) + COALESCE(NEW.duration_seconds, 0) / 60.0,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS trg_breath_session_stats ON public.breath_sessions;
CREATE TRIGGER trg_breath_session_stats
  AFTER INSERT ON public.breath_sessions
  FOR EACH ROW
  WHEN (NEW.completed_at IS NOT NULL)
  EXECUTE FUNCTION public.update_stats_on_breath_session();