-- Supprimer et recréer la fonction RPC get_user_listening_stats
DROP FUNCTION IF EXISTS public.get_user_listening_stats(UUID);

CREATE OR REPLACE FUNCTION public.get_user_listening_stats(p_user_id UUID)
RETURNS TABLE (
  total_listens BIGINT,
  total_duration_seconds BIGINT,
  top_emotion TEXT,
  unique_tracks BIGINT,
  streak_days INT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_listens,
    COALESCE(SUM(COALESCE(listen_duration, 180)), 0)::BIGINT as total_duration_seconds,
    COALESCE(
      (SELECT mh.emotion 
       FROM music_history mh 
       WHERE mh.user_id = p_user_id AND mh.emotion IS NOT NULL
       GROUP BY mh.emotion 
       ORDER BY COUNT(*) DESC 
       LIMIT 1),
      'calm'
    ) as top_emotion,
    COUNT(DISTINCT track_id)::BIGINT as unique_tracks,
    (
      SELECT COUNT(DISTINCT DATE(played_at))::INT
      FROM music_history mh2
      WHERE mh2.user_id = p_user_id 
        AND played_at >= CURRENT_DATE - INTERVAL '30 days'
    ) as streak_days
  FROM music_history
  WHERE user_id = p_user_id;
END;
$$;

-- Créer la table music_listening_sessions si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.music_listening_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  track_id TEXT,
  duration_seconds INTEGER DEFAULT 0,
  emotion_before TEXT,
  emotion_after TEXT,
  session_type TEXT DEFAULT 'listening',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- RLS pour music_listening_sessions
ALTER TABLE public.music_listening_sessions ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'music_listening_sessions' 
    AND policyname = 'Users can view their own listening sessions'
  ) THEN
    CREATE POLICY "Users can view their own listening sessions"
      ON public.music_listening_sessions FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'music_listening_sessions' 
    AND policyname = 'Users can insert their own listening sessions'
  ) THEN
    CREATE POLICY "Users can insert their own listening sessions"
      ON public.music_listening_sessions FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'music_listening_sessions' 
    AND policyname = 'Users can update their own listening sessions'
  ) THEN
    CREATE POLICY "Users can update their own listening sessions"
      ON public.music_listening_sessions FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_music_listening_sessions_user_id ON public.music_listening_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_music_listening_sessions_created_at ON public.music_listening_sessions(created_at DESC);