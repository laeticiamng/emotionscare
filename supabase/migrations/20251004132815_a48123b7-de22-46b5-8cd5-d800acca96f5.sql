-- Phase 1A : Table mood_tracking seulement

CREATE TABLE IF NOT EXISTS public.mood_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_score INTEGER NOT NULL CHECK (mood_score BETWEEN 1 AND 10),
  emotions JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  context TEXT,
  triggers JSONB DEFAULT '[]'::jsonb,
  coping_strategies JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mood_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mood tracking"
  ON public.mood_tracking FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mood tracking"
  ON public.mood_tracking FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood tracking"
  ON public.mood_tracking FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood tracking"
  ON public.mood_tracking FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all mood tracking"
  ON public.mood_tracking FOR ALL
  USING ((auth.jwt() ->> 'role') = 'service_role')
  WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

CREATE INDEX idx_mood_tracking_user_created ON public.mood_tracking(user_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.update_mood_tracking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_mood_tracking_updated_at
  BEFORE UPDATE ON public.mood_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_mood_tracking_updated_at();