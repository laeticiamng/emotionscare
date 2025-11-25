-- Date: 20250612
-- Ticket: Complete API backend integration
-- Migration: Create/update tables for API routes

-- ============================================================================
-- BREATHWORK SESSIONS TABLE (new table for API)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.breathwork_sessions (
  id                  uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid          NOT NULL,
  technique_type      text          NOT NULL,
  duration            int           NOT NULL DEFAULT 180,
  target_bpm          real,
  actual_bpm          real,
  coherence_score     real,
  stress_level_before int           CHECK (stress_level_before >= 1 AND stress_level_before <= 10),
  stress_level_after  int           CHECK (stress_level_after >= 1 AND stress_level_after <= 10),
  session_data        jsonb         DEFAULT '{}',
  created_at          timestamptz   NOT NULL DEFAULT now(),
  updated_at          timestamptz   NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_breathwork_user_created
  ON public.breathwork_sessions(user_id, created_at DESC);

DO $$ BEGIN
  ALTER TABLE breathwork_sessions ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN NULL; END $$;

DROP POLICY IF EXISTS p_breathwork_rw ON breathwork_sessions;
CREATE POLICY p_breathwork_rw ON breathwork_sessions
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- VR SESSIONS - Add missing columns to existing table
-- ============================================================================
DO $$ BEGIN
  ALTER TABLE public.vr_sessions ADD COLUMN IF NOT EXISTS experience_type text;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.vr_sessions ADD COLUMN IF NOT EXISTS duration_seconds int DEFAULT 300;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.vr_sessions ADD COLUMN IF NOT EXISTS vr_tier text;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.vr_sessions ADD COLUMN IF NOT EXISTS profile jsonb DEFAULT '{}';
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.vr_sessions ADD COLUMN IF NOT EXISTS mood_before int;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.vr_sessions ADD COLUMN IF NOT EXISTS mood_after int;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.vr_sessions ADD COLUMN IF NOT EXISTS session_data jsonb DEFAULT '{}';
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.vr_sessions ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
EXCEPTION WHEN others THEN NULL; END $$;

-- ============================================================================
-- EMOTION SCANS - Add missing columns to existing table
-- ============================================================================
DO $$ BEGIN
  ALTER TABLE public.emotion_scans ADD COLUMN IF NOT EXISTS dominant_emotion text;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.emotion_scans ADD COLUMN IF NOT EXISTS confidence_score real;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.emotion_scans ADD COLUMN IF NOT EXISTS context jsonb DEFAULT '{}';
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.emotion_scans ADD COLUMN IF NOT EXISTS notes text;
EXCEPTION WHEN others THEN NULL; END $$;

-- ============================================================================
-- COACH API SESSIONS TABLE (separate from existing coach_sessions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.coach_api_sessions (
  id                  uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid          NOT NULL,
  title               text          NOT NULL DEFAULT 'Session de coaching',
  coach_mode          text          NOT NULL DEFAULT 'empathetic' CHECK (coach_mode IN ('empathetic', 'motivational', 'analytical')),
  topic               text,
  mood_before         int           CHECK (mood_before >= 1 AND mood_before <= 10),
  mood_after          int           CHECK (mood_after >= 1 AND mood_after <= 10),
  satisfaction_rating int           CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  duration_minutes    int,
  created_at          timestamptz   NOT NULL DEFAULT now(),
  updated_at          timestamptz   NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_coach_api_sessions_user_created
  ON public.coach_api_sessions(user_id, created_at DESC);

DO $$ BEGIN
  ALTER TABLE coach_api_sessions ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN NULL; END $$;

DROP POLICY IF EXISTS p_coach_api_sessions_rw ON coach_api_sessions;
CREATE POLICY p_coach_api_sessions_rw ON coach_api_sessions
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- COACH API MESSAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.coach_api_messages (
  id                uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id        uuid          NOT NULL REFERENCES public.coach_api_sessions(id) ON DELETE CASCADE,
  user_id           uuid          NOT NULL,
  sender            text          NOT NULL CHECK (sender IN ('user', 'coach')),
  content           text          NOT NULL,
  message_type      text          NOT NULL DEFAULT 'text',
  emotions_detected jsonb         DEFAULT '{}',
  created_at        timestamptz   NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_coach_api_messages_session
  ON public.coach_api_messages(session_id, created_at ASC);

DO $$ BEGIN
  ALTER TABLE coach_api_messages ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN NULL; END $$;

DROP POLICY IF EXISTS p_coach_api_messages_rw ON coach_api_messages;
CREATE POLICY p_coach_api_messages_rw ON coach_api_messages
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- PERSONAL GOALS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.personal_goals (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid          NOT NULL,
  title           text          NOT NULL,
  description     text,
  category        text,
  target_date     date,
  target_value    real,
  current_value   real          DEFAULT 0,
  unit            text,
  completed       boolean       NOT NULL DEFAULT false,
  completed_at    timestamptz,
  created_at      timestamptz   NOT NULL DEFAULT now(),
  updated_at      timestamptz   NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_personal_goals_user_created
  ON public.personal_goals(user_id, created_at DESC);

ALTER TABLE personal_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_personal_goals_rw ON personal_goals
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- ASSESSMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.assessments (
  id            uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid          NOT NULL,
  instrument    text          NOT NULL,
  score_json    jsonb         DEFAULT '{}',
  submitted_at  timestamptz,
  ts            timestamptz   NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_assessments_user_ts
  ON public.assessments(user_id, ts DESC);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_assessments_rw ON assessments
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- CLINICAL INSTRUMENTS TABLE (reference data)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.clinical_instruments (
  id            uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  code          text          NOT NULL UNIQUE,
  name          text          NOT NULL,
  description   text,
  questions     jsonb         NOT NULL DEFAULT '[]',
  scoring       jsonb         DEFAULT '{}',
  thresholds    jsonb         DEFAULT '{}',
  category      text,
  created_at    timestamptz   NOT NULL DEFAULT now()
);

-- Insert default clinical instruments
INSERT INTO public.clinical_instruments (code, name, description, questions, scoring, category) VALUES
('WHO-5', 'WHO-5 Well-Being Index', 'Index de bien-etre OMS en 5 questions',
 '[{"id":"q1","text":"Je me suis senti(e) gai(e) et de bonne humeur","min":0,"max":5},{"id":"q2","text":"Je me suis senti(e) calme et detendu(e)","min":0,"max":5},{"id":"q3","text":"Je me suis senti(e) actif(ve) et vigoureux(se)","min":0,"max":5},{"id":"q4","text":"Je me suis reveille(e) frais(che) et repose(e)","min":0,"max":5},{"id":"q5","text":"Ma vie quotidienne a ete remplie de choses interessantes","min":0,"max":5}]',
 '{"method":"sum","multiplier":4,"max":100}',
 'wellbeing'),
('PHQ-9', 'Patient Health Questionnaire-9', 'Questionnaire de sante du patient pour la depression',
 '[{"id":"q1","text":"Peu d''interet ou de plaisir a faire les choses","min":0,"max":3},{"id":"q2","text":"Se sentir triste, deprime(e) ou desespere(e)","min":0,"max":3},{"id":"q3","text":"Difficultes a s''endormir ou a rester endormi(e), ou trop dormir","min":0,"max":3},{"id":"q4","text":"Se sentir fatigue(e) ou avoir peu d''energie","min":0,"max":3},{"id":"q5","text":"Peu d''appetit ou trop manger","min":0,"max":3},{"id":"q6","text":"Mauvaise perception de soi-meme","min":0,"max":3},{"id":"q7","text":"Difficultes a se concentrer","min":0,"max":3},{"id":"q8","text":"Bouger ou parler si lentement que les autres l''ont remarque","min":0,"max":3},{"id":"q9","text":"Penser qu''il vaudrait mieux mourir ou se faire du mal","min":0,"max":3}]',
 '{"method":"sum","max":27}',
 'depression'),
('GAD-7', 'Generalized Anxiety Disorder-7', 'Echelle d''anxiete generalisee en 7 questions',
 '[{"id":"q1","text":"Se sentir nerveux(se), anxieux(se) ou tendu(e)","min":0,"max":3},{"id":"q2","text":"Etre incapable d''arreter de s''inquieter ou de controler ses inquietudes","min":0,"max":3},{"id":"q3","text":"S''inquieter trop a propos de differentes choses","min":0,"max":3},{"id":"q4","text":"Avoir du mal a se detendre","min":0,"max":3},{"id":"q5","text":"Etre si agite(e) qu''il est difficile de rester tranquille","min":0,"max":3},{"id":"q6","text":"Devenir facilement contrarie(e) ou irritable","min":0,"max":3},{"id":"q7","text":"Avoir peur que quelque chose de terrible puisse arriver","min":0,"max":3}]',
 '{"method":"sum","max":21}',
 'anxiety'),
('PSS-10', 'Perceived Stress Scale-10', 'Echelle de stress percu en 10 questions',
 '[{"id":"q1","text":"Avez-vous ete derange(e) par un evenement inattendu?","min":0,"max":4},{"id":"q2","text":"Avez-vous eu l''impression de ne pas pouvoir controler les choses importantes?","min":0,"max":4},{"id":"q3","text":"Vous etes-vous senti(e) nerveux(se) et stresse(e)?","min":0,"max":4},{"id":"q4","text":"Avez-vous ete confiant(e) en votre capacite a gerer vos problemes?","min":0,"max":4,"reverse":true},{"id":"q5","text":"Avez-vous senti que les choses allaient comme vous le vouliez?","min":0,"max":4,"reverse":true},{"id":"q6","text":"Avez-vous trouve que vous ne pouviez pas faire face a tout?","min":0,"max":4},{"id":"q7","text":"Avez-vous pu maitriser les irritations de votre vie?","min":0,"max":4,"reverse":true},{"id":"q8","text":"Avez-vous senti que vous controliez la situation?","min":0,"max":4,"reverse":true},{"id":"q9","text":"Avez-vous ete irrite(e) par des choses hors de votre controle?","min":0,"max":4},{"id":"q10","text":"Avez-vous trouve que les difficultes s''accumulaient trop?","min":0,"max":4}]',
 '{"method":"sum_with_reverse","max":40}',
 'stress')
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- BREATH WEEKLY METRICS VIEW/TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.breath_weekly_metrics (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid          NOT NULL,
  week_start      date          NOT NULL,
  total_sessions  int           NOT NULL DEFAULT 0,
  total_duration  int           NOT NULL DEFAULT 0,
  avg_coherence   real,
  techniques_used jsonb         DEFAULT '{}',
  created_at      timestamptz   NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_breath_weekly_user_week
  ON public.breath_weekly_metrics(user_id, week_start);

ALTER TABLE breath_weekly_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_breath_weekly_rw ON breath_weekly_metrics
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
