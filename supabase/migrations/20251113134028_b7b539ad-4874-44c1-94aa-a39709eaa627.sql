-- Création de la table de file d'attente pour les générations musicales
CREATE TABLE IF NOT EXISTS public.music_generation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  emotion TEXT NOT NULL,
  intensity DECIMAL(3,2) NOT NULL DEFAULT 0.5,
  user_context TEXT,
  mood TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  track_id UUID REFERENCES public.generated_music_tracks(id) ON DELETE SET NULL,
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_music_queue_status ON public.music_generation_queue(status);
CREATE INDEX idx_music_queue_user ON public.music_generation_queue(user_id);
CREATE INDEX idx_music_queue_created ON public.music_generation_queue(created_at DESC);

-- Table pour tracker le statut de l'API Suno
CREATE TABLE IF NOT EXISTS public.suno_api_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_available BOOLEAN NOT NULL DEFAULT true,
  last_check TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  response_time_ms INTEGER,
  error_message TEXT,
  consecutive_failures INTEGER NOT NULL DEFAULT 0
);

-- Insérer un statut initial
INSERT INTO public.suno_api_status (is_available) VALUES (true);

-- RLS pour music_generation_queue
ALTER TABLE public.music_generation_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own queue items"
  ON public.music_generation_queue
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own queue items"
  ON public.music_generation_queue
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS pour suno_api_status (lecture publique)
ALTER TABLE public.suno_api_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view API status"
  ON public.suno_api_status
  FOR SELECT
  USING (true);