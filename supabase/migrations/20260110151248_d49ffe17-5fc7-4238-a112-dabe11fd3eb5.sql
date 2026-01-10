-- ==============================================
-- FIX #1: Ajouter colonne generation_status à music_generation_queue
-- ==============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'music_generation_queue' 
    AND column_name = 'generation_status'
  ) THEN
    ALTER TABLE public.music_generation_queue 
    ADD COLUMN generation_status text DEFAULT 'pending';
  END IF;
END $$;

-- ==============================================
-- FIX #2: Créer table session_emotions si manquante
-- ==============================================
CREATE TABLE IF NOT EXISTS public.session_emotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id uuid,
  emotion text NOT NULL,
  intensity numeric DEFAULT 0.5,
  valence numeric,
  arousal numeric,
  detected_at timestamptz DEFAULT now(),
  source text DEFAULT 'manual',
  context jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.session_emotions ENABLE ROW LEVEL SECURITY;

-- RLS policies pour session_emotions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'session_emotions' AND policyname = 'Users can view own session_emotions'
  ) THEN
    CREATE POLICY "Users can view own session_emotions"
    ON public.session_emotions FOR SELECT
    USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'session_emotions' AND policyname = 'Users can insert own session_emotions'
  ) THEN
    CREATE POLICY "Users can insert own session_emotions"
    ON public.session_emotions FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_session_emotions_user_id ON public.session_emotions(user_id);
CREATE INDEX IF NOT EXISTS idx_session_emotions_session_id ON public.session_emotions(session_id);

-- ==============================================
-- FIX #3: Ajouter colonne started_at à user_quest_progress
-- ==============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_quest_progress' 
    AND column_name = 'started_at'
  ) THEN
    ALTER TABLE public.user_quest_progress 
    ADD COLUMN started_at timestamptz DEFAULT now();
  END IF;
END $$;