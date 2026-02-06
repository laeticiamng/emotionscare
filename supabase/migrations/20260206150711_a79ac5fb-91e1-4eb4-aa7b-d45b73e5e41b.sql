-- Ajouter la colonne valence a mood_entries
ALTER TABLE public.mood_entries
  ADD COLUMN IF NOT EXISTS valence numeric DEFAULT 50;

-- Ajouter la colonne preferred_activities a user_preferences
ALTER TABLE public.user_preferences
  ADD COLUMN IF NOT EXISTS preferred_activities text[] DEFAULT '{}';