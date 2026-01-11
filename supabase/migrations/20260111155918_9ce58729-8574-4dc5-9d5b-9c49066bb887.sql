-- Ajouter les colonnes manquantes à bubble_beat_sessions
ALTER TABLE public.bubble_beat_sessions 
ADD COLUMN IF NOT EXISTS game_mode text DEFAULT 'relax',
ADD COLUMN IF NOT EXISTS average_heart_rate numeric,
ADD COLUMN IF NOT EXISTS target_heart_rate numeric,
ADD COLUMN IF NOT EXISTS biometrics jsonb DEFAULT '{}';

-- Créer la table mood_mixer_presets si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.mood_mixer_presets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  category text DEFAULT 'custom',
  components jsonb NOT NULL DEFAULT '[]',
  is_favorite boolean DEFAULT false,
  use_count integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Activer RLS si pas encore activé
ALTER TABLE public.mood_mixer_presets ENABLE ROW LEVEL SECURITY;

-- Vérifier et créer les politiques (ignore si existent déjà)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'mood_mixer_presets' AND policyname = 'Users can view their own presets'
  ) THEN
    CREATE POLICY "Users can view their own presets" ON public.mood_mixer_presets FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'mood_mixer_presets' AND policyname = 'Users can create their own presets'
  ) THEN
    CREATE POLICY "Users can create their own presets" ON public.mood_mixer_presets FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'mood_mixer_presets' AND policyname = 'Users can update their own presets'
  ) THEN
    CREATE POLICY "Users can update their own presets" ON public.mood_mixer_presets FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'mood_mixer_presets' AND policyname = 'Users can delete their own presets'
  ) THEN
    CREATE POLICY "Users can delete their own presets" ON public.mood_mixer_presets FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_mood_mixer_presets_user ON public.mood_mixer_presets(user_id);
CREATE INDEX IF NOT EXISTS idx_story_synth_stories_user ON public.story_synth_stories(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_mixer_sessions_user ON public.mood_mixer_sessions(user_id);