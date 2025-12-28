-- Ajouter les colonnes manquantes à generated_music_tracks pour le flow Suno complet
ALTER TABLE public.generated_music_tracks 
ADD COLUMN IF NOT EXISTS emotion TEXT,
ADD COLUMN IF NOT EXISTS prompt TEXT;

-- Index pour recherche par émotion
CREATE INDEX IF NOT EXISTS idx_generated_music_tracks_emotion ON public.generated_music_tracks(emotion);
CREATE INDEX IF NOT EXISTS idx_generated_music_tracks_generation_status ON public.generated_music_tracks(generation_status);
CREATE INDEX IF NOT EXISTS idx_generated_music_tracks_user_id ON public.generated_music_tracks(user_id);

-- Commentaires
COMMENT ON COLUMN public.generated_music_tracks.emotion IS 'Émotion cible pour la génération';
COMMENT ON COLUMN public.generated_music_tracks.prompt IS 'Prompt utilisé pour la génération Suno';