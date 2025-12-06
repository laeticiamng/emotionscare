-- Tables manquantes pour les modules

-- 1. Story Synth (Histoires génératives)
CREATE TABLE IF NOT EXISTS public.story_synth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  story_theme TEXT,
  story_content TEXT,
  choices_made JSONB DEFAULT '[]'::jsonb,
  emotion_tags TEXT[],
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.story_synth_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own story sessions"
ON public.story_synth_sessions FOR ALL
USING (auth.uid() = user_id);

-- 2. Mood Mixer (Mélangeur d'humeurs)
CREATE TABLE IF NOT EXISTS public.mood_mixer_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  mood_before TEXT,
  mood_after TEXT,
  activities_selected TEXT[],
  duration_seconds INTEGER DEFAULT 0,
  satisfaction_score INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.mood_mixer_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own mood mixer sessions"
ON public.mood_mixer_sessions FOR ALL
USING (auth.uid() = user_id);

-- 3. Bubble Beat (Rythme et bulles)
CREATE TABLE IF NOT EXISTS public.bubble_beat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  score INTEGER DEFAULT 0,
  bubbles_popped INTEGER DEFAULT 0,
  rhythm_accuracy NUMERIC,
  duration_seconds INTEGER DEFAULT 0,
  difficulty TEXT DEFAULT 'normal',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.bubble_beat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own bubble beat sessions"
ON public.bubble_beat_sessions FOR ALL
USING (auth.uid() = user_id);

-- 4. AR Filters (Filtres de réalité augmentée)
CREATE TABLE IF NOT EXISTS public.ar_filter_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  filter_type TEXT NOT NULL,
  duration_seconds INTEGER DEFAULT 0,
  photos_taken INTEGER DEFAULT 0,
  mood_impact TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.ar_filter_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own ar filter sessions"
ON public.ar_filter_sessions FOR ALL
USING (auth.uid() = user_id);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_story_synth_user_created ON public.story_synth_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mood_mixer_user_created ON public.mood_mixer_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bubble_beat_user_created ON public.bubble_beat_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ar_filter_user_created ON public.ar_filter_sessions(user_id, created_at DESC);