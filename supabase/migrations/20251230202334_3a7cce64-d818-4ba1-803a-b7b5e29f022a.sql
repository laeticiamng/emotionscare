-- ============================================================================
-- SESSIONS TABLE - Table centrale pour interconnecter tous les modules
-- ============================================================================

-- Table sessions générique pour unifier toutes les activités
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN (
    'meditation', 'breathing', 'music_therapy', 'journal', 'coach', 
    'emotion_scan', 'vr_galaxy', 'ar_filter', 'mood_mixer', 'nyvee',
    'bubble_beat', 'flash_glow', 'story_synth', 'bounce_back', 'community'
  )),
  source_id UUID, -- ID de la session dans la table source (meditation_sessions, etc.)
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER DEFAULT 0,
  mood_before INTEGER CHECK (mood_before >= 0 AND mood_before <= 100),
  mood_after INTEGER CHECK (mood_after >= 0 AND mood_after <= 100),
  mood_delta INTEGER GENERATED ALWAYS AS (mood_after - mood_before) STORED,
  xp_earned INTEGER DEFAULT 0,
  achievements_unlocked TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_type ON public.sessions(session_type);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON public.sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_user_type_date ON public.sessions(user_id, session_type, created_at DESC);

-- RLS
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON public.sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions"
  ON public.sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON public.sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger pour updated_at
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- VUE AGRÉGÉE POUR STATISTIQUES CROSS-MODULE
-- ============================================================================

CREATE OR REPLACE VIEW public.user_session_stats AS
SELECT 
  user_id,
  session_type,
  COUNT(*) as total_sessions,
  SUM(duration_seconds) as total_duration,
  AVG(duration_seconds)::INTEGER as avg_duration,
  AVG(mood_delta)::INTEGER as avg_mood_impact,
  SUM(xp_earned) as total_xp,
  MAX(created_at) as last_session_at,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as sessions_last_7_days,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as sessions_last_30_days
FROM public.sessions
GROUP BY user_id, session_type;

-- ============================================================================
-- FONCTION POUR SYNCHRONISER LES SESSIONS DEPUIS LES MODULES
-- ============================================================================

CREATE OR REPLACE FUNCTION public.sync_session_from_module()
RETURNS TRIGGER AS $$
BEGIN
  -- Déterminer le type de session selon la table source
  DECLARE
    session_type_val TEXT;
    duration_val INTEGER := 0;
    mood_before_val INTEGER;
    mood_after_val INTEGER;
  BEGIN
    -- Mapper la table source vers le type de session
    CASE TG_TABLE_NAME
      WHEN 'meditation_sessions' THEN 
        session_type_val := 'meditation';
        duration_val := COALESCE(NEW.completed_duration, NEW.duration, 0);
        mood_before_val := NEW.mood_before;
        mood_after_val := NEW.mood_after;
      WHEN 'ai_coach_sessions' THEN 
        session_type_val := 'coach';
        duration_val := COALESCE(NEW.session_duration, 0);
      WHEN 'emotion_scans' THEN 
        session_type_val := 'emotion_scan';
        mood_after_val := NEW.mood_score;
      WHEN 'music_sessions' THEN 
        session_type_val := 'music_therapy';
        duration_val := COALESCE(NEW.duration_seconds, 0);
        mood_before_val := NEW.mood_before;
        mood_after_val := NEW.mood_after;
      WHEN 'bubble_beat_sessions' THEN 
        session_type_val := 'bubble_beat';
        duration_val := COALESCE(NEW.duration_seconds, 0);
      WHEN 'vr_nebula_sessions' THEN 
        session_type_val := 'vr_galaxy';
        duration_val := COALESCE(NEW.duration_seconds, 0);
      WHEN 'mood_mixer_sessions' THEN 
        session_type_val := 'mood_mixer';
        duration_val := COALESCE(NEW.duration_seconds, 0);
      WHEN 'nyvee_sessions' THEN 
        session_type_val := 'nyvee';
        duration_val := COALESCE(NEW.duration_seconds, 0);
      WHEN 'breathing_vr_sessions' THEN 
        session_type_val := 'breathing';
        duration_val := COALESCE(NEW.duration_seconds, 0);
      WHEN 'ar_filter_sessions' THEN 
        session_type_val := 'ar_filter';
        duration_val := COALESCE(NEW.duration_seconds, 0);
      ELSE 
        session_type_val := 'meditation';
    END CASE;

    -- Insérer dans la table sessions
    INSERT INTO public.sessions (
      user_id, session_type, source_id, started_at, ended_at,
      duration_seconds, mood_before, mood_after, metadata
    ) VALUES (
      NEW.user_id,
      session_type_val,
      NEW.id,
      COALESCE(NEW.created_at, NOW()),
      CASE WHEN NEW.completed_at IS NOT NULL THEN NEW.completed_at ELSE NULL END,
      duration_val,
      mood_before_val,
      mood_after_val,
      jsonb_build_object('source_table', TG_TABLE_NAME)
    )
    ON CONFLICT DO NOTHING;
    
    RETURN NEW;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGERS DE SYNCHRONISATION AUTOMATIQUE
-- ============================================================================

-- Meditation sessions sync
DROP TRIGGER IF EXISTS sync_meditation_to_sessions ON public.meditation_sessions;
CREATE TRIGGER sync_meditation_to_sessions
  AFTER INSERT OR UPDATE ON public.meditation_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_session_from_module();

-- AI Coach sessions sync
DROP TRIGGER IF EXISTS sync_coach_to_sessions ON public.ai_coach_sessions;
CREATE TRIGGER sync_coach_to_sessions
  AFTER INSERT OR UPDATE ON public.ai_coach_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_session_from_module();

-- Emotion scans sync
DROP TRIGGER IF EXISTS sync_emotion_scan_to_sessions ON public.emotion_scans;
CREATE TRIGGER sync_emotion_scan_to_sessions
  AFTER INSERT ON public.emotion_scans
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_session_from_module();

-- Music sessions sync
DROP TRIGGER IF EXISTS sync_music_to_sessions ON public.music_sessions;
CREATE TRIGGER sync_music_to_sessions
  AFTER INSERT OR UPDATE ON public.music_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_session_from_module();

-- VR sessions sync
DROP TRIGGER IF EXISTS sync_vr_to_sessions ON public.vr_nebula_sessions;
CREATE TRIGGER sync_vr_to_sessions
  AFTER INSERT OR UPDATE ON public.vr_nebula_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_session_from_module();

-- Mood mixer sessions sync
DROP TRIGGER IF EXISTS sync_mood_mixer_to_sessions ON public.mood_mixer_sessions;
CREATE TRIGGER sync_mood_mixer_to_sessions
  AFTER INSERT OR UPDATE ON public.mood_mixer_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_session_from_module();

-- Nyvee sessions sync
DROP TRIGGER IF EXISTS sync_nyvee_to_sessions ON public.nyvee_sessions;
CREATE TRIGGER sync_nyvee_to_sessions
  AFTER INSERT OR UPDATE ON public.nyvee_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_session_from_module();

-- Bubble beat sessions sync
DROP TRIGGER IF EXISTS sync_bubble_beat_to_sessions ON public.bubble_beat_sessions;
CREATE TRIGGER sync_bubble_beat_to_sessions
  AFTER INSERT OR UPDATE ON public.bubble_beat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_session_from_module();

-- AR filter sessions sync
DROP TRIGGER IF EXISTS sync_ar_to_sessions ON public.ar_filter_sessions;
CREATE TRIGGER sync_ar_to_sessions
  AFTER INSERT OR UPDATE ON public.ar_filter_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_session_from_module();

-- Breathing VR sessions sync
DROP TRIGGER IF EXISTS sync_breathing_to_sessions ON public.breathing_vr_sessions;
CREATE TRIGGER sync_breathing_to_sessions
  AFTER INSERT OR UPDATE ON public.breathing_vr_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_session_from_module();

-- ============================================================================
-- TABLE D'INTERCONNEXION MODULES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.module_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_module TEXT NOT NULL,
  target_module TEXT NOT NULL,
  connection_type TEXT NOT NULL CHECK (connection_type IN (
    'triggers', 'recommends', 'shares_data', 'unlocks', 'enhances'
  )),
  weight DECIMAL(3,2) DEFAULT 1.0 CHECK (weight >= 0 AND weight <= 1),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(source_module, target_module, connection_type)
);

-- Insérer les connexions entre modules
INSERT INTO public.module_connections (source_module, target_module, connection_type, weight) VALUES
  -- Emotion scan déclenche des recommandations
  ('emotion_scan', 'meditation', 'recommends', 0.9),
  ('emotion_scan', 'breathing', 'recommends', 0.85),
  ('emotion_scan', 'music_therapy', 'recommends', 0.8),
  ('emotion_scan', 'coach', 'recommends', 0.75),
  ('emotion_scan', 'journal', 'recommends', 0.7),
  
  -- Journal enrichit l'analyse
  ('journal', 'emotion_scan', 'enhances', 0.8),
  ('journal', 'coach', 'shares_data', 0.9),
  ('journal', 'achievements', 'triggers', 0.6),
  
  -- Méditation unlock d'autres modules
  ('meditation', 'vr_galaxy', 'unlocks', 0.7),
  ('meditation', 'breathing', 'enhances', 0.8),
  ('meditation', 'scores', 'triggers', 1.0),
  
  -- Coach partage des données
  ('coach', 'journal', 'shares_data', 0.85),
  ('coach', 'meditation', 'recommends', 0.8),
  ('coach', 'achievements', 'triggers', 0.7),
  
  -- Music therapy
  ('music_therapy', 'meditation', 'enhances', 0.75),
  ('music_therapy', 'mood_mixer', 'shares_data', 0.9),
  ('music_therapy', 'scores', 'triggers', 1.0),
  
  -- Sessions vers achievements
  ('meditation', 'achievements', 'triggers', 0.9),
  ('breathing', 'achievements', 'triggers', 0.85),
  ('coach', 'achievements', 'triggers', 0.8),
  ('music_therapy', 'achievements', 'triggers', 0.75),
  ('vr_galaxy', 'achievements', 'triggers', 0.7),
  
  -- Scores agrègent tout
  ('meditation', 'scores', 'shares_data', 1.0),
  ('coach', 'scores', 'shares_data', 1.0),
  ('journal', 'scores', 'shares_data', 0.9),
  ('emotion_scan', 'scores', 'shares_data', 1.0),
  ('breathing', 'scores', 'shares_data', 0.9)
ON CONFLICT (source_module, target_module, connection_type) DO NOTHING;

-- RLS pour module_connections (lecture publique)
ALTER TABLE public.module_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Module connections are readable by all"
  ON public.module_connections FOR SELECT
  USING (true);