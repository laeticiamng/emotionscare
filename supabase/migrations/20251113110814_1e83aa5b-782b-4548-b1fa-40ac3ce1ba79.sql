-- Créer table automix_playlists
CREATE TABLE IF NOT EXISTS public.automix_playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  context_rules JSONB NOT NULL DEFAULT '{}'::jsonb,
  tempo_range JSONB DEFAULT '{"min": 60, "max": 140}'::jsonb,
  generated_tracks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour performances
CREATE INDEX idx_automix_playlists_user ON public.automix_playlists(user_id);
CREATE INDEX idx_automix_playlists_active ON public.automix_playlists(is_active) WHERE is_active = true;

-- RLS
ALTER TABLE public.automix_playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own playlists"
  ON public.automix_playlists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users create own playlists"
  ON public.automix_playlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own playlists"
  ON public.automix_playlists FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own playlists"
  ON public.automix_playlists FOR DELETE
  USING (auth.uid() = user_id);

-- Créer table user_context_preferences
CREATE TABLE IF NOT EXISTS public.user_context_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  morning_mood TEXT,
  afternoon_mood TEXT,
  evening_mood TEXT,
  weather_sensitivity BOOLEAN DEFAULT true,
  feedback_summary JSONB DEFAULT '{
    "total_likes": 0,
    "total_dislikes": 0,
    "preferred_moods": [],
    "avoided_moods": [],
    "preferred_tempos": [],
    "weather_correlations": {}
  }'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS pour user_context_preferences
ALTER TABLE public.user_context_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own preferences"
  ON public.user_context_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users create own preferences"
  ON public.user_context_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own preferences"
  ON public.user_context_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Créer table automix_feedback
CREATE TABLE IF NOT EXISTS public.automix_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  playlist_id UUID NOT NULL REFERENCES public.automix_playlists(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating IN (-1, 1)),
  context_snapshot JSONB NOT NULL,
  feedback_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour performances
CREATE INDEX idx_automix_feedback_user ON public.automix_feedback(user_id);
CREATE INDEX idx_automix_feedback_playlist ON public.automix_feedback(playlist_id);
CREATE INDEX idx_automix_feedback_created ON public.automix_feedback(created_at DESC);

-- RLS pour automix_feedback
ALTER TABLE public.automix_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own feedback"
  ON public.automix_feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users create own feedback"
  ON public.automix_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own feedback"
  ON public.automix_feedback FOR UPDATE
  USING (auth.uid() = user_id);