-- ============================================================
-- MUSIC SECURITY SETUP - Phase 1
-- Tables: music_favorites, music_history avec RLS policies
-- ============================================================

-- Table: music_favorites
-- Permet aux utilisateurs de marquer des tracks comme favoris
CREATE TABLE IF NOT EXISTS public.music_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL,
  track_title TEXT,
  track_artist TEXT,
  track_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Contrainte unique : un utilisateur ne peut pas favoriser 2x le même track
  UNIQUE(user_id, track_id)
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_music_favorites_user_id ON public.music_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_music_favorites_created_at ON public.music_favorites(created_at DESC);

-- Enable RLS
ALTER TABLE public.music_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour music_favorites
CREATE POLICY "Users can view their own favorites"
  ON public.music_favorites
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites"
  ON public.music_favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON public.music_favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- Table: music_history
-- Historique d'écoute des utilisateurs
CREATE TABLE IF NOT EXISTS public.music_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL,
  track_title TEXT,
  track_artist TEXT,
  track_url TEXT,
  track_duration INTEGER, -- en secondes
  listen_duration INTEGER, -- durée réelle d'écoute en secondes
  completion_rate DECIMAL(5,2), -- pourcentage d'écoute (0-100)
  emotion TEXT, -- émotion associée
  mood TEXT, -- humeur associée
  played_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Metadata additionnelle
  device TEXT, -- device utilisé
  source TEXT, -- source de la lecture (vinyle, journey, playlist, etc.)
  metadata JSONB -- données additionnelles flexibles
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_music_history_user_id ON public.music_history(user_id);
CREATE INDEX IF NOT EXISTS idx_music_history_played_at ON public.music_history(played_at DESC);
CREATE INDEX IF NOT EXISTS idx_music_history_emotion ON public.music_history(emotion);
CREATE INDEX IF NOT EXISTS idx_music_history_track_id ON public.music_history(track_id);

-- Enable RLS
ALTER TABLE public.music_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour music_history
CREATE POLICY "Users can view their own history"
  ON public.music_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own history"
  ON public.music_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own history"
  ON public.music_history
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own history"
  ON public.music_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- Admin policies (role 'admin' peut voir toutes les données pour analytics)
CREATE POLICY "Admins can view all favorites"
  ON public.music_favorites
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view all history"
  ON public.music_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function: Get user's favorite tracks count
CREATE OR REPLACE FUNCTION public.get_user_favorites_count(p_user_id UUID DEFAULT auth.uid())
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM public.music_favorites
    WHERE user_id = p_user_id
  );
END;
$$;

-- Function: Get user's listening stats
CREATE OR REPLACE FUNCTION public.get_user_listening_stats(p_user_id UUID DEFAULT auth.uid())
RETURNS TABLE (
  total_listens BIGINT,
  total_duration_seconds BIGINT,
  avg_completion_rate DECIMAL,
  top_emotion TEXT,
  last_played_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_listens,
    COALESCE(SUM(listen_duration), 0)::BIGINT as total_duration_seconds,
    COALESCE(AVG(completion_rate), 0)::DECIMAL as avg_completion_rate,
    (
      SELECT emotion
      FROM public.music_history
      WHERE user_id = p_user_id AND emotion IS NOT NULL
      GROUP BY emotion
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as top_emotion,
    MAX(played_at) as last_played_at
  FROM public.music_history
  WHERE user_id = p_user_id;
END;
$$;

-- Comments pour documentation
COMMENT ON TABLE public.music_favorites IS 'User favorite music tracks';
COMMENT ON TABLE public.music_history IS 'User music listening history with analytics';
COMMENT ON FUNCTION public.get_user_favorites_count IS 'Returns the count of favorite tracks for a user';
COMMENT ON FUNCTION public.get_user_listening_stats IS 'Returns listening statistics for a user';