-- Table pour stocker les métadonnées des callbacks Suno (pas l'audio brut)
CREATE TABLE IF NOT EXISTS public.suno_callbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id TEXT NOT NULL UNIQUE,
  callback_type TEXT NOT NULL,
  status TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index pour recherche rapide par task_id
CREATE INDEX IF NOT EXISTS idx_suno_callbacks_task_id ON public.suno_callbacks(task_id);
CREATE INDEX IF NOT EXISTS idx_suno_callbacks_created_at ON public.suno_callbacks(created_at DESC);

-- RLS: Les callbacks sont gérés par le service role uniquement
ALTER TABLE public.suno_callbacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage suno callbacks"
ON public.suno_callbacks
FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Table pour lier les générations musicales aux utilisateurs (métadonnées uniquement)
CREATE TABLE IF NOT EXISTS public.user_music_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  task_id TEXT NOT NULL,
  emotion_state JSONB NOT NULL,
  emotion_badge TEXT,
  suno_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (task_id) REFERENCES public.suno_callbacks(task_id) ON DELETE CASCADE
);

-- Index
CREATE INDEX IF NOT EXISTS idx_user_music_gen_user_id ON public.user_music_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_music_gen_created_at ON public.user_music_generations(created_at DESC);

-- RLS: Les utilisateurs peuvent voir et créer leurs propres générations
ALTER TABLE public.user_music_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own music generations"
ON public.user_music_generations
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own music generations"
ON public.user_music_generations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all music generations"
ON public.user_music_generations
FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');