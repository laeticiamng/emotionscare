-- Table Mood Presets pour le module Mood Mixer
CREATE TABLE IF NOT EXISTS public.mood_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  softness INTEGER NOT NULL DEFAULT 50 CHECK (softness BETWEEN 0 AND 100),
  clarity INTEGER NOT NULL DEFAULT 50 CHECK (clarity BETWEEN 0 AND 100),
  blend JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pour accélérer la récupération des presets d'un utilisateur
CREATE INDEX IF NOT EXISTS idx_mood_presets_user_created_at
  ON public.mood_presets(user_id, created_at DESC);

-- Activation de la RLS
ALTER TABLE public.mood_presets ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité
CREATE POLICY "Users can read their mood presets"
  ON public.mood_presets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their mood presets"
  ON public.mood_presets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their mood presets"
  ON public.mood_presets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their mood presets"
  ON public.mood_presets FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER trg_mood_presets_updated_at
  BEFORE UPDATE ON public.mood_presets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
