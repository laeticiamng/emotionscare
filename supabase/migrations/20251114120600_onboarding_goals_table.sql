-- Migration: Create onboarding goals table
-- Created: 2025-11-14
-- Description: Store user onboarding goals and module recommendations

-- Create table for onboarding goals
CREATE TABLE IF NOT EXISTS public.onboarding_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  objectives TEXT[] NOT NULL DEFAULT '{}',
  module_suggestions JSONB DEFAULT '[]'::jsonb,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.onboarding_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own goals"
  ON public.onboarding_goals
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals"
  ON public.onboarding_goals
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
  ON public.onboarding_goals
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
  ON public.onboarding_goals
  FOR DELETE
  USING (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_onboarding_goals_user_id
  ON public.onboarding_goals(user_id);

CREATE INDEX IF NOT EXISTS idx_onboarding_goals_completed
  ON public.onboarding_goals(completed_at) WHERE completed_at IS NOT NULL;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_onboarding_goals_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_onboarding_goals_updated
BEFORE UPDATE ON public.onboarding_goals
FOR EACH ROW EXECUTE FUNCTION update_onboarding_goals_updated_at();

-- Function to generate module recommendations based on objectives
CREATE OR REPLACE FUNCTION generate_module_recommendations(user_objectives TEXT[])
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recommendations JSONB := '[]'::jsonb;
BEGIN
  -- Recommendation logic based on objectives
  IF 'focus' = ANY(user_objectives) THEN
    recommendations := recommendations || jsonb_build_array(jsonb_build_object(
      'module', 'breathwork',
      'reason', 'La cohérence cardiaque améliore la concentration',
      'priority', 'high'
    ));
  END IF;

  IF 'energy' = ANY(user_objectives) THEN
    recommendations := recommendations || jsonb_build_array(jsonb_build_object(
      'module', 'vr_nebula',
      'reason', 'Les sessions VR augmentent la vitalité',
      'priority', 'high'
    ));
  END IF;

  IF 'resilience' = ANY(user_objectives) THEN
    recommendations := recommendations || jsonb_build_array(jsonb_build_object(
      'module', 'emotion_scan',
      'reason', 'La reconnaissance émotionnelle renforce la résilience',
      'priority', 'medium'
    ));
    recommendations := recommendations || jsonb_build_array(jsonb_build_object(
      'module', 'ai_coach',
      'reason', 'Le coaching IA vous accompagne dans vos défis',
      'priority', 'high'
    ));
  END IF;

  IF 'sleep' = ANY(user_objectives) THEN
    recommendations := recommendations || jsonb_build_array(jsonb_build_object(
      'module', 'breathwork',
      'reason', 'Les exercices de respiration favorisent l''endormissement',
      'priority', 'high'
    ));
    recommendations := recommendations || jsonb_build_array(jsonb_build_object(
      'module', 'adaptive_music',
      'reason', 'La musique adaptative améliore la qualité du sommeil',
      'priority', 'medium'
    ));
  END IF;

  IF 'ambition' = ANY(user_objectives) THEN
    recommendations := recommendations || jsonb_build_array(jsonb_build_object(
      'module', 'ai_coach',
      'reason', 'Le coaching IA vous aide à définir et atteindre vos objectifs',
      'priority', 'high'
    ));
    recommendations := recommendations || jsonb_build_array(jsonb_build_object(
      'module', 'vr_dome',
      'reason', 'Les sessions collectives développent la collaboration',
      'priority', 'medium'
    ));
  END IF;

  -- Always recommend journal for self-reflection
  recommendations := recommendations || jsonb_build_array(jsonb_build_object(
    'module', 'voice_journal',
    'reason', 'Le journal vocal permet de suivre votre progression',
    'priority', 'medium'
  ));

  RETURN recommendations;
END;
$$;

-- Comments
COMMENT ON TABLE public.onboarding_goals IS
'Stores user onboarding goals and personalized module recommendations';

COMMENT ON COLUMN public.onboarding_goals.objectives IS
'User selected objectives: focus, energy, resilience, sleep, ambition';

COMMENT ON COLUMN public.onboarding_goals.module_suggestions IS
'AI-generated module recommendations based on objectives';

COMMENT ON FUNCTION generate_module_recommendations(TEXT[]) IS
'Generates personalized module recommendations based on user objectives';
