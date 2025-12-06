/**
 * AR Sessions & Experience Tables - Phase 4.5
 * Tracking pour les expériences de réalité augmentée
 */

-- Table pour les sessions AR
CREATE TABLE IF NOT EXISTS public.ar_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Session info
  experience_type TEXT NOT NULL CHECK (experience_type IN ('aura', 'breathing', 'bubbles', 'music')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INT,

  -- Device info
  device_type TEXT,
  has_ar_support BOOLEAN NOT NULL DEFAULT true,
  xr_mode TEXT CHECK (xr_mode IN ('immersive-ar', 'immersive-vr', 'inline', 'fallback')),

  -- Performance
  avg_fps FLOAT,
  memory_usage_mb FLOAT,

  -- Metrics
  user_engagement_score INT CHECK (user_engagement_score >= 0 AND user_engagement_score <= 100),
  mood_before TEXT,
  mood_after TEXT,

  -- Additional data
  custom_settings JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les logs des expériences AR
CREATE TABLE IF NOT EXISTS public.ar_experience_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ar_session_id UUID NOT NULL REFERENCES public.ar_sessions(id) ON DELETE CASCADE,

  -- Event tracking
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  -- Device state
  device_position JSONB, -- {x, y, z}
  device_rotation JSONB, -- {x, y, z}

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour l'historique des auras émotionnelles
CREATE TABLE IF NOT EXISTS public.emotional_aura_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ar_session_id UUID REFERENCES public.ar_sessions(id) ON DELETE SET NULL,

  -- Emotion data
  dominant_emotion TEXT NOT NULL,
  emotion_scores JSONB NOT NULL DEFAULT '{}', -- {joy, calm, focus, energy, love}

  -- Aura visualization
  aura_color_rgb TEXT, -- #RRGGBB
  aura_intensity INT CHECK (aura_intensity >= 1 AND aura_intensity <= 5),
  aura_size_multiplier FLOAT CHECK (aura_size_multiplier > 0),

  -- Biometric correlation (if available)
  heart_rate INT,
  heart_rate_variability FLOAT,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les sessions breathing AR
CREATE TABLE IF NOT EXISTS public.breathing_ar_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ar_session_id UUID NOT NULL UNIQUE REFERENCES public.ar_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Breathing pattern
  pattern_type TEXT NOT NULL CHECK (pattern_type IN ('4-4-4', '4-7-8', 'box', 'coherent')),
  cycles_completed INT DEFAULT 0,
  total_planned_cycles INT,

  -- Performance metrics
  avg_breath_depth FLOAT,
  avg_breath_duration FLOAT,
  consistency_score INT CHECK (consistency_score >= 0 AND consistency_score <= 100),

  -- HRV tracking
  hrv_before FLOAT,
  hrv_after FLOAT,

  -- User feedback
  difficulty_rating INT CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  enjoyment_rating INT CHECK (enjoyment_rating >= 1 AND enjoyment_rating <= 5),

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les sessions musique AR
CREATE TABLE IF NOT EXISTS public.music_ar_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ar_session_id UUID NOT NULL UNIQUE REFERENCES public.ar_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Music info
  playlist_id UUID REFERENCES public.playlists(id) ON DELETE SET NULL,
  track_ids UUID[] DEFAULT '{}',
  visual_theme TEXT NOT NULL CHECK (visual_theme IN ('galaxy', 'waves', 'particles')),

  -- Performance
  time_watched_seconds INT,
  average_fps FLOAT,

  -- Engagement
  track_interactions INT DEFAULT 0,
  visual_interaction_count INT DEFAULT 0,

  -- Feedback
  immersion_rating INT CHECK (immersion_rating >= 1 AND immersion_rating <= 5),
  visual_quality_rating INT CHECK (visual_quality_rating >= 1 AND visual_quality_rating <= 5),

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les performances AR metrics
CREATE TABLE IF NOT EXISTS public.ar_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ar_session_id UUID NOT NULL REFERENCES public.ar_sessions(id) ON DELETE CASCADE,

  -- Frame timing
  frame_time_ms FLOAT,
  gpu_time_ms FLOAT,
  cpu_time_ms FLOAT,

  -- Memory
  memory_used_mb FLOAT,
  texture_memory_mb FLOAT,
  geometry_memory_mb FLOAT,

  -- Rendering
  triangle_count INT,
  draw_call_count INT,

  -- Sampling
  sampled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_ar_sessions_user_id ON public.ar_sessions(user_id);
CREATE INDEX idx_ar_sessions_experience_type ON public.ar_sessions(experience_type);
CREATE INDEX idx_ar_sessions_started_at ON public.ar_sessions(started_at DESC);

CREATE INDEX idx_ar_experience_logs_session_id ON public.ar_experience_logs(ar_session_id);
CREATE INDEX idx_ar_experience_logs_timestamp ON public.ar_experience_logs(timestamp);

CREATE INDEX idx_emotional_aura_user_id ON public.emotional_aura_history(user_id);
CREATE INDEX idx_emotional_aura_session_id ON public.emotional_aura_history(ar_session_id);
CREATE INDEX idx_emotional_aura_created_at ON public.emotional_aura_history(created_at DESC);

CREATE INDEX idx_breathing_ar_user_id ON public.breathing_ar_sessions(user_id);
CREATE INDEX idx_breathing_ar_session_id ON public.breathing_ar_sessions(ar_session_id);

CREATE INDEX idx_music_ar_user_id ON public.music_ar_sessions(user_id);
CREATE INDEX idx_music_ar_session_id ON public.music_ar_sessions(ar_session_id);

CREATE INDEX idx_ar_performance_metrics_session_id ON public.ar_performance_metrics(ar_session_id);

-- RLS Policies
ALTER TABLE public.ar_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ar_experience_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotional_aura_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breathing_ar_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_ar_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ar_performance_metrics ENABLE ROW LEVEL SECURITY;

-- ar_sessions policies
CREATE POLICY "Users can view own AR sessions"
  ON public.ar_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own AR sessions"
  ON public.ar_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AR sessions"
  ON public.ar_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- ar_experience_logs policies
CREATE POLICY "Users can view own AR logs"
  ON public.ar_experience_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.ar_sessions
      WHERE id = ar_session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own AR logs"
  ON public.ar_experience_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ar_sessions
      WHERE id = ar_session_id AND user_id = auth.uid()
    )
  );

-- emotional_aura_history policies
CREATE POLICY "Users can view own aura history"
  ON public.emotional_aura_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own aura history"
  ON public.emotional_aura_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- breathing_ar_sessions policies
CREATE POLICY "Users can view own breathing sessions"
  ON public.breathing_ar_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own breathing sessions"
  ON public.breathing_ar_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own breathing sessions"
  ON public.breathing_ar_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- music_ar_sessions policies
CREATE POLICY "Users can view own music AR sessions"
  ON public.music_ar_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own music AR sessions"
  ON public.music_ar_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own music AR sessions"
  ON public.music_ar_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- ar_performance_metrics policies
CREATE POLICY "Users can view own performance metrics"
  ON public.ar_performance_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.ar_sessions
      WHERE id = ar_session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own performance metrics"
  ON public.ar_performance_metrics FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ar_sessions
      WHERE id = ar_session_id AND user_id = auth.uid()
    )
  );

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_ar_sessions_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ar_sessions_timestamp
  BEFORE UPDATE ON public.ar_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ar_sessions_timestamp();

CREATE TRIGGER breathing_ar_sessions_timestamp
  BEFORE UPDATE ON public.breathing_ar_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ar_sessions_timestamp();

CREATE TRIGGER music_ar_sessions_timestamp
  BEFORE UPDATE ON public.music_ar_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ar_sessions_timestamp();
