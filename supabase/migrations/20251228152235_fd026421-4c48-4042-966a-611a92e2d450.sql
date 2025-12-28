-- Table pour le feedback des pistes musicales
CREATE TABLE IF NOT EXISTS public.music_track_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL,
  session_id UUID REFERENCES public.music_generation_sessions(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_type TEXT CHECK (feedback_type IN ('like', 'dislike', 'skip', 'complete', 'report')),
  emotion_match BOOLEAN,
  notes TEXT,
  context JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_music_track_feedback_user_id ON public.music_track_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_music_track_feedback_track_id ON public.music_track_feedback(track_id);
CREATE INDEX IF NOT EXISTS idx_music_track_feedback_created_at ON public.music_track_feedback(created_at DESC);

-- Activer RLS
ALTER TABLE public.music_track_feedback ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Users can view their own feedback"
  ON public.music_track_feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback"
  ON public.music_track_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback"
  ON public.music_track_feedback FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own feedback"
  ON public.music_track_feedback FOR DELETE
  USING (auth.uid() = user_id);