-- =====================================================
-- AMÉLIORATION 1: Tables manquantes identifiées lors de l'audit
-- =====================================================

-- 1. Table mood_presets (MoodMixer - score 8/20 → cible 15/20)
CREATE TABLE IF NOT EXISTS public.mood_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  mood_config JSONB NOT NULL DEFAULT '{}',
  color_scheme TEXT,
  audio_settings JSONB,
  is_public BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Table music_listening_history (Music Therapy tracking)
CREATE TABLE IF NOT EXISTS public.music_listening_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  track_id TEXT NOT NULL,
  track_title TEXT,
  artist TEXT,
  duration_seconds INTEGER,
  listened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  mood_before TEXT,
  mood_after TEXT,
  completion_rate NUMERIC(3,2),
  source TEXT DEFAULT 'adaptive',
  metadata JSONB
);

-- 3. Table breath_sessions (Respiration - score 11/20 → cible 16/20)
CREATE TABLE IF NOT EXISTS public.breath_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  protocol TEXT NOT NULL, -- coherence, 478, box, triangle
  duration_seconds INTEGER NOT NULL,
  cycles_completed INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  hrv_before NUMERIC,
  hrv_after NUMERIC,
  stress_before INTEGER,
  stress_after INTEGER,
  notes TEXT,
  metadata JSONB
);

-- 4. Table discovery_log (Recommandations tracking)
CREATE TABLE IF NOT EXISTS public.discovery_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_name TEXT NOT NULL,
  action TEXT NOT NULL, -- viewed, started, completed, dismissed
  context JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Table seuil_sessions (Régulation proactive)
CREATE TABLE IF NOT EXISTS public.seuil_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id TEXT,
  trigger_type TEXT, -- stress_spike, scheduled, manual
  strategies_used TEXT[],
  effectiveness INTEGER CHECK (effectiveness >= 1 AND effectiveness <= 5),
  mood_before INTEGER,
  mood_after INTEGER,
  notes TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  metadata JSONB
);

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE public.mood_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_listening_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breath_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovery_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seuil_sessions ENABLE ROW LEVEL SECURITY;

-- mood_presets: Own data + public presets
CREATE POLICY "mood_presets_select_own_or_public" ON public.mood_presets
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "mood_presets_insert_own" ON public.mood_presets
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "mood_presets_update_own" ON public.mood_presets
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "mood_presets_delete_own" ON public.mood_presets
  FOR DELETE USING (auth.uid() = user_id);

-- music_listening_history: Own data only
CREATE POLICY "music_history_select_own" ON public.music_listening_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "music_history_insert_own" ON public.music_listening_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- breath_sessions: Own data only
CREATE POLICY "breath_sessions_select_own" ON public.breath_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "breath_sessions_insert_own" ON public.breath_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "breath_sessions_update_own" ON public.breath_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- discovery_log: Own data only
CREATE POLICY "discovery_log_select_own" ON public.discovery_log
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "discovery_log_insert_own" ON public.discovery_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- seuil_sessions: Own data only
CREATE POLICY "seuil_sessions_select_own" ON public.seuil_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "seuil_sessions_insert_own" ON public.seuil_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "seuil_sessions_update_own" ON public.seuil_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_mood_presets_user ON public.mood_presets(user_id);
CREATE INDEX IF NOT EXISTS idx_music_history_user ON public.music_listening_history(user_id);
CREATE INDEX IF NOT EXISTS idx_music_history_listened ON public.music_listening_history(listened_at DESC);
CREATE INDEX IF NOT EXISTS idx_breath_sessions_user ON public.breath_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_breath_sessions_started ON public.breath_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_discovery_log_user ON public.discovery_log(user_id);
CREATE INDEX IF NOT EXISTS idx_seuil_sessions_user ON public.seuil_sessions(user_id);

-- =====================================================
-- TRIGGERS pour updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS mood_presets_updated_at ON public.mood_presets;
CREATE TRIGGER mood_presets_updated_at
  BEFORE UPDATE ON public.mood_presets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();