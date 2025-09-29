-- Migration: ECC-01 - Clinical Assessments Framework
-- Create tables for clinical assessments with strict RLS

-- Create assessments table for individual responses
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  instrument TEXT NOT NULL,
  score_json JSONB NOT NULL,
  ts TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create org_assess_rollups for B2B aggregations  
CREATE TABLE IF NOT EXISTS public.org_assess_rollups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  period TEXT NOT NULL, -- format: YYYY-MM or YYYY-WXX  
  instrument TEXT NOT NULL,
  n INTEGER NOT NULL,
  text_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT org_rollups_min_n CHECK (n >= 5)
);

-- Create clinical_instruments catalog
CREATE TABLE IF NOT EXISTS public.clinical_instruments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  questions JSONB NOT NULL,
  thresholds JSONB NOT NULL,
  min_score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  ttl_hours INTEGER NOT NULL DEFAULT 168, -- 1 week default
  cadence TEXT NOT NULL DEFAULT 'weekly',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create clinical_feature_flags for opt-in control
CREATE TABLE IF NOT EXISTS public.clinical_feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_name TEXT UNIQUE NOT NULL,
  instrument_domain TEXT,
  is_enabled BOOLEAN DEFAULT false,
  rollout_percentage INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create clinical_consents for opt-in tracking
CREATE TABLE IF NOT EXISTS public.clinical_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  instrument_code TEXT NOT NULL,
  granted_at TIMESTAMPTZ DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

-- Create clinical_responses for detailed tracking
CREATE TABLE IF NOT EXISTS public.clinical_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  instrument_code TEXT NOT NULL,
  responses JSONB NOT NULL,
  internal_score NUMERIC,
  internal_level INTEGER,
  cadence TEXT NOT NULL,
  tags TEXT[],
  context_data JSONB DEFAULT '{}',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create clinical_signals for orchestration
CREATE TABLE IF NOT EXISTS public.clinical_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_instrument TEXT NOT NULL,
  domain TEXT NOT NULL,
  level INTEGER NOT NULL,
  window_type TEXT NOT NULL,
  module_context TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_assess_rollups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_signals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assessments (users can only see their own)
CREATE POLICY "assessments_select_own" ON public.assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "assessments_insert_own" ON public.assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for org_assess_rollups (B2B access only)
CREATE POLICY "org_rollups_admin_access" ON public.org_assess_rollups
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'b2b_manager')
    )
  );

-- RLS Policies for clinical_instruments (public read)
CREATE POLICY "clinical_instruments_public_read" ON public.clinical_instruments
  FOR SELECT USING (true);

CREATE POLICY "clinical_instruments_service_manage" ON public.clinical_instruments
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- RLS Policies for clinical_feature_flags (public read)
CREATE POLICY "feature_flags_public_read" ON public.clinical_feature_flags
  FOR SELECT USING (true);

CREATE POLICY "feature_flags_service_manage" ON public.clinical_feature_flags
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- RLS Policies for clinical_consents (users manage own)
CREATE POLICY "consents_select_own" ON public.clinical_consents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "consents_manage_own" ON public.clinical_consents
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policies for clinical_responses (users manage own)
CREATE POLICY "responses_select_own" ON public.clinical_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "responses_manage_own" ON public.clinical_responses
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "responses_service_access" ON public.clinical_responses
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- RLS Policies for clinical_signals (users manage own)
CREATE POLICY "signals_select_own" ON public.clinical_signals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "signals_manage_own" ON public.clinical_signals
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "signals_service_access" ON public.clinical_signals
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Create function to calculate internal levels
CREATE OR REPLACE FUNCTION public.calculate_internal_level(
  instrument_code TEXT,
  score NUMERIC
) RETURNS INTEGER
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  thresholds JSONB;
  level INTEGER;
BEGIN
  -- Récupérer les seuils de l'instrument
  SELECT i.thresholds INTO thresholds
  FROM clinical_instruments i
  WHERE i.code = instrument_code;
  
  IF thresholds IS NULL THEN
    RETURN 2; -- Niveau neutre par défaut
  END IF;
  
  -- Calculer le niveau selon les seuils
  FOR level IN 0..4 LOOP
    IF score >= (thresholds->(level::TEXT)->0)::INTEGER 
       AND score <= (thresholds->(level::TEXT)->1)::INTEGER THEN
      RETURN level;
    END IF;
  END LOOP;
  
  RETURN 2; -- Fallback niveau neutre
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_assessments_user_instrument ON public.assessments(user_id, instrument);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON public.assessments(created_at);
CREATE INDEX IF NOT EXISTS idx_org_rollups_org_period ON public.org_assess_rollups(org_id, period);
CREATE INDEX IF NOT EXISTS idx_clinical_responses_user_instrument ON public.clinical_responses(user_id, instrument_code);
CREATE INDEX IF NOT EXISTS idx_clinical_signals_user_expires ON public.clinical_signals(user_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_clinical_consents_user_active ON public.clinical_consents(user_id, is_active);

-- Insert seed data for clinical instruments
INSERT INTO public.clinical_instruments (code, name, domain, questions, thresholds, min_score, max_score, ttl_hours, cadence) VALUES
('WHO5', 'WHO-5 Well-Being Index', 'wellbeing', 
 '{"items": [{"id": 1, "text": "I have felt cheerful and in good spirits"}, {"id": 2, "text": "I have felt calm and relaxed"}, {"id": 3, "text": "I have felt active and vigorous"}, {"id": 4, "text": "I woke up feeling fresh and rested"}, {"id": 5, "text": "My daily life has been filled with things that interest me"}], "scale": {"0": "At no time", "1": "Some of the time", "2": "Less than half of the time", "3": "More than half of the time", "4": "Most of the time", "5": "All of the time"}}',
 '{"0": [0, 8], "1": [9, 12], "2": [13, 16], "3": [17, 20], "4": [21, 25]}',
 0, 25, 168, 'weekly'),
 
('STAI6', 'State-Trait Anxiety Inventory (6-item)', 'anxiety',
 '{"items": [{"id": 1, "text": "I feel calm"}, {"id": 2, "text": "I am tense"}, {"id": 3, "text": "I feel upset"}, {"id": 4, "text": "I am relaxed"}, {"id": 5, "text": "I feel content"}, {"id": 6, "text": "I am worried"}], "scale": {"1": "Not at all", "2": "Somewhat", "3": "Moderately so", "4": "Very much so"}}',
 '{"0": [6, 10], "1": [11, 13], "2": [14, 16], "3": [17, 19], "4": [20, 24]}',
 6, 24, 24, 'contextual'),

('PANAS', 'Positive and Negative Affect Schedule', 'affect',
 '{"items": [{"id": 1, "text": "Enthusiastic", "valence": "positive"}, {"id": 2, "text": "Interested", "valence": "positive"}, {"id": 3, "text": "Determined", "valence": "positive"}, {"id": 4, "text": "Excited", "valence": "positive"}, {"id": 5, "text": "Inspired", "valence": "positive"}, {"id": 6, "text": "Alert", "valence": "positive"}, {"id": 7, "text": "Active", "valence": "positive"}, {"id": 8, "text": "Strong", "valence": "positive"}, {"id": 9, "text": "Proud", "valence": "positive"}, {"id": 10, "text": "Attentive", "valence": "positive"}, {"id": 11, "text": "Distressed", "valence": "negative"}, {"id": 12, "text": "Upset", "valence": "negative"}, {"id": 13, "text": "Guilty", "valence": "negative"}, {"id": 14, "text": "Scared", "valence": "negative"}, {"id": 15, "text": "Hostile", "valence": "negative"}, {"id": 16, "text": "Irritable", "valence": "negative"}, {"id": 17, "text": "Ashamed", "valence": "negative"}, {"id": 18, "text": "Nervous", "valence": "negative"}, {"id": 19, "text": "Jittery", "valence": "negative"}, {"id": 20, "text": "Afraid", "valence": "negative"}], "scale": {"1": "Very slightly or not at all", "2": "A little", "3": "Moderately", "4": "Quite a bit", "5": "Extremely"}}',
 '{"PA": {"0": [10, 23], "1": [24, 28], "2": [29, 33], "3": [34, 38], "4": [39, 50]}, "NA": {"0": [10, 15], "1": [16, 20], "2": [21, 25], "3": [26, 30], "4": [31, 50]}}',
 20, 100, 72, 'daily')

ON CONFLICT (code) DO NOTHING;

-- Insert seed feature flags
INSERT INTO public.clinical_feature_flags (flag_name, instrument_domain, is_enabled, rollout_percentage) VALUES
('FF_ASSESS_WHO5', 'wellbeing', true, 100),
('FF_ASSESS_STAI6', 'anxiety', true, 100),
('FF_ASSESS_PANAS', 'affect', true, 100),
('FF_ASSESS_PSS10', 'stress', false, 0),
('FF_ASSESS_UCLA3', 'loneliness', false, 0),
('FF_ASSESS_MSPSS', 'social_support', false, 0),
('FF_ASSESS_AAQ2', 'psychological_flexibility', false, 0),
('FF_ASSESS_POMS', 'mood', false, 0),
('FF_ASSESS_SSQ', 'simulator_sickness', false, 0),
('FF_ASSESS_ISI', 'insomnia', false, 0),
('FF_ASSESS_GAS', 'goal_attainment', false, 0),
('FF_ASSESS_GRITS', 'grit', false, 0),
('FF_ASSESS_BRS', 'resilience', false, 0),
('FF_ASSESS_WEMWBS', 'mental_wellbeing', false, 0),
('FF_ASSESS_UWES', 'work_engagement', false, 0),
('FF_ASSESS_CBI', 'burnout', false, 0),
('FF_ASSESS_CVSQ', 'computer_vision', false, 0)

ON CONFLICT (flag_name) DO NOTHING;