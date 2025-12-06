-- Migration simplifiée pour EmotionMusic (évite les contraintes existantes)

-- 1) Table emotion_generations
CREATE TABLE IF NOT EXISTS public.emotion_generations (
  task_id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt text,
  status text NOT NULL DEFAULT 'creating' CHECK (status IN ('creating','first','complete','failed')),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2) Ajouter user_id à emotion_tracks si manquant
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='emotion_tracks' AND column_name='user_id'
  ) THEN
    ALTER TABLE public.emotion_tracks ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Index
CREATE INDEX IF NOT EXISTS idx_emogen_user ON public.emotion_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_emogen_status ON public.emotion_generations(status);
CREATE INDEX IF NOT EXISTS idx_emotracks_user ON public.emotion_tracks(user_id);
CREATE INDEX IF NOT EXISTS idx_emotracks_created ON public.emotion_tracks(created_at DESC);

-- RLS emotion_generations
ALTER TABLE public.emotion_generations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own emotion generations" ON public.emotion_generations;
DROP POLICY IF EXISTS "Users can insert own emotion generations" ON public.emotion_generations;
DROP POLICY IF EXISTS "Users can update own emotion generations" ON public.emotion_generations;
DROP POLICY IF EXISTS "Service role can manage all emotion generations" ON public.emotion_generations;

CREATE POLICY "Users can read own emotion generations"
  ON public.emotion_generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emotion generations"
  ON public.emotion_generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own emotion generations"
  ON public.emotion_generations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all emotion generations"
  ON public.emotion_generations FOR ALL
  USING (auth.role() = 'service_role');

-- RLS emotion_tracks
DROP POLICY IF EXISTS "Users can read own emotion tracks" ON public.emotion_tracks;
DROP POLICY IF EXISTS "Users can insert own emotion tracks" ON public.emotion_tracks;
DROP POLICY IF EXISTS "Users can update own emotion tracks" ON public.emotion_tracks;
DROP POLICY IF EXISTS "Service role can manage all emotion tracks" ON public.emotion_tracks;

CREATE POLICY "Users can read own emotion tracks"
  ON public.emotion_tracks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emotion tracks"
  ON public.emotion_tracks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own emotion tracks"
  ON public.emotion_tracks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all emotion tracks"
  ON public.emotion_tracks FOR ALL
  USING (auth.role() = 'service_role');