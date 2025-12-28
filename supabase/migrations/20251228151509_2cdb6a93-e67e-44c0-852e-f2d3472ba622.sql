-- Music Generation Sessions table
CREATE TABLE IF NOT EXISTS public.music_generation_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  task_id TEXT NOT NULL,
  emotion_state JSONB NOT NULL,
  emotion_badge TEXT NOT NULL,
  suno_config JSONB NOT NULL,
  result JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.music_generation_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own music sessions"
  ON public.music_generation_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own music sessions"
  ON public.music_generation_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own music sessions"
  ON public.music_generation_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own music sessions"
  ON public.music_generation_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Index for fast lookup by task_id
CREATE INDEX idx_music_sessions_task_id ON public.music_generation_sessions(task_id);
CREATE INDEX idx_music_sessions_user_status ON public.music_generation_sessions(user_id, status);

-- Suno Generated Tracks cache table
CREATE TABLE IF NOT EXISTS public.suno_generated_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  vinyl_id TEXT NOT NULL,
  category TEXT,
  title TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  task_id TEXT,
  is_fallback BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'completed',
  duration INTEGER,
  model TEXT,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, vinyl_id)
);

-- Enable RLS
ALTER TABLE public.suno_generated_tracks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own generated tracks"
  ON public.suno_generated_tracks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own generated tracks"
  ON public.suno_generated_tracks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generated tracks"
  ON public.suno_generated_tracks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generated tracks"
  ON public.suno_generated_tracks FOR DELETE
  USING (auth.uid() = user_id);

-- Service role policy for suno-callback edge function
CREATE POLICY "Service role can manage all tracks"
  ON public.suno_generated_tracks FOR ALL
  USING (true)
  WITH CHECK (true);

-- Index for vinyl lookup
CREATE INDEX idx_suno_tracks_vinyl ON public.suno_generated_tracks(vinyl_id);
CREATE INDEX idx_suno_tracks_user ON public.suno_generated_tracks(user_id);

-- Add realtime for suno_callbacks table
ALTER PUBLICATION supabase_realtime ADD TABLE public.suno_callbacks;