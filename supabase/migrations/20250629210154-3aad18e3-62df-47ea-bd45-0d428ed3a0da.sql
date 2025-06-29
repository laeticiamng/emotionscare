
-- Création des tables EmotionsCare pour la gestion des chansons en streaming
CREATE TABLE IF NOT EXISTS public.emotionscare_songs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  suno_audio_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  meta JSONB DEFAULT '{}',
  lyrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les likes des chansons EmotionsCare
CREATE TABLE IF NOT EXISTS public.emotionscare_song_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  song_id UUID NOT NULL REFERENCES public.emotionscare_songs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, song_id)
);

-- Table pour la bibliothèque utilisateur EmotionsCare
CREATE TABLE IF NOT EXISTS public.emotionscare_user_songs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  song_id UUID NOT NULL REFERENCES public.emotionscare_songs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, song_id)
);

-- Activation de RLS sur toutes les tables EmotionsCare
ALTER TABLE public.emotionscare_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotionscare_song_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotionscare_user_songs ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour emotionscare_songs (lecture publique, écriture restreinte)
CREATE POLICY "Anyone can view EmotionsCare songs" ON public.emotionscare_songs FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can create EmotionsCare songs" ON public.emotionscare_songs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Politiques RLS pour emotionscare_song_likes
CREATE POLICY "Users can view all EmotionsCare likes" ON public.emotionscare_song_likes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own EmotionsCare likes" ON public.emotionscare_song_likes FOR ALL USING (auth.uid() = user_id);

-- Politiques RLS pour emotionscare_user_songs
CREATE POLICY "Users can view their own EmotionsCare library" ON public.emotionscare_user_songs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own EmotionsCare library" ON public.emotionscare_user_songs FOR ALL USING (auth.uid() = user_id);

-- Trigger pour updated_at sur emotionscare_songs
CREATE OR REPLACE FUNCTION public.update_emotionscare_songs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_emotionscare_songs_updated_at
  BEFORE UPDATE ON public.emotionscare_songs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_emotionscare_songs_updated_at();
