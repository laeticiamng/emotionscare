-- ================================================
-- Migration: Compléter le système musical
-- Ajoute les tables manquantes pour la musique
-- ================================================

-- Table playlist_tracks pour lier playlists et pistes
CREATE TABLE IF NOT EXISTS public.playlist_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id UUID NOT NULL REFERENCES public.user_playlists(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.generated_music_tracks(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(playlist_id, track_id)
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist ON public.playlist_tracks(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_track ON public.playlist_tracks(track_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_position ON public.playlist_tracks(playlist_id, position);

-- Enable RLS
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;

-- Policies pour playlist_tracks
CREATE POLICY "Users can view tracks in their playlists" 
ON public.playlist_tracks 
FOR SELECT 
USING (
  playlist_id IN (SELECT id FROM public.user_playlists WHERE user_id = auth.uid())
);

CREATE POLICY "Users can add tracks to their playlists" 
ON public.playlist_tracks 
FOR INSERT 
WITH CHECK (
  playlist_id IN (SELECT id FROM public.user_playlists WHERE user_id = auth.uid())
);

CREATE POLICY "Users can remove tracks from their playlists" 
ON public.playlist_tracks 
FOR DELETE 
USING (
  playlist_id IN (SELECT id FROM public.user_playlists WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update track positions in their playlists" 
ON public.playlist_tracks 
FOR UPDATE 
USING (
  playlist_id IN (SELECT id FROM public.user_playlists WHERE user_id = auth.uid())
);

-- Table music_play_history pour l'historique d'écoute
CREATE TABLE IF NOT EXISTS public.music_play_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  track_id UUID NOT NULL REFERENCES public.generated_music_tracks(id) ON DELETE CASCADE,
  played_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  duration_listened INTEGER DEFAULT 0,
  mood_before TEXT,
  mood_after TEXT,
  completed BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Index pour optimiser les requêtes d'historique
CREATE INDEX IF NOT EXISTS idx_music_play_history_user ON public.music_play_history(user_id);
CREATE INDEX IF NOT EXISTS idx_music_play_history_track ON public.music_play_history(track_id);
CREATE INDEX IF NOT EXISTS idx_music_play_history_played_at ON public.music_play_history(user_id, played_at DESC);

-- Enable RLS
ALTER TABLE public.music_play_history ENABLE ROW LEVEL SECURITY;

-- Policies pour music_play_history
CREATE POLICY "Users can view their own play history" 
ON public.music_play_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can record their own plays" 
ON public.music_play_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own play records" 
ON public.music_play_history 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Ajouter colonne is_public aux pistes si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'generated_music_tracks' 
    AND column_name = 'is_public'
  ) THEN
    ALTER TABLE public.generated_music_tracks ADD COLUMN is_public BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Index sur is_public pour les requêtes de pistes publiques
CREATE INDEX IF NOT EXISTS idx_generated_music_tracks_public 
ON public.generated_music_tracks(is_public) 
WHERE is_public = true;