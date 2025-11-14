-- Add new columns to existing user_music_preferences table
ALTER TABLE public.user_music_preferences 
ADD COLUMN IF NOT EXISTS favorite_genres TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS preferred_tempos JSONB DEFAULT '{"min": 80, "max": 140}'::jsonb,
ADD COLUMN IF NOT EXISTS favorite_moods TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS listening_contexts TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS preferred_energy_level INTEGER CHECK (preferred_energy_level BETWEEN 0 AND 100),
ADD COLUMN IF NOT EXISTS instrumental_preference TEXT CHECK (instrumental_preference IN ('instrumental', 'vocal', 'both'));

-- Create GIN indexes for array columns if they don't exist
CREATE INDEX IF NOT EXISTS idx_user_music_prefs_genres ON public.user_music_preferences USING GIN(favorite_genres);
CREATE INDEX IF NOT EXISTS idx_user_music_prefs_moods ON public.user_music_preferences USING GIN(favorite_moods);
CREATE INDEX IF NOT EXISTS idx_user_music_prefs_contexts ON public.user_music_preferences USING GIN(listening_contexts);

-- Ensure RLS is enabled
ALTER TABLE public.user_music_preferences ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own music preferences" ON public.user_music_preferences;
DROP POLICY IF EXISTS "Users can insert their own music preferences" ON public.user_music_preferences;
DROP POLICY IF EXISTS "Users can update their own music preferences" ON public.user_music_preferences;
DROP POLICY IF EXISTS "Users can delete their own music preferences" ON public.user_music_preferences;

CREATE POLICY "Users can view their own music preferences"
  ON public.user_music_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own music preferences"
  ON public.user_music_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own music preferences"
  ON public.user_music_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own music preferences"
  ON public.user_music_preferences
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add helpful comments
COMMENT ON COLUMN public.user_music_preferences.favorite_genres IS 'Array of preferred music genres (ambient, classical, electronic, etc.)';
COMMENT ON COLUMN public.user_music_preferences.preferred_tempos IS 'JSON object with min and max BPM range';
COMMENT ON COLUMN public.user_music_preferences.favorite_moods IS 'Array of preferred moods (calm, energetic, etc.)';
COMMENT ON COLUMN public.user_music_preferences.listening_contexts IS 'Array of listening contexts (work, study, exercise, etc.)';
COMMENT ON COLUMN public.user_music_preferences.preferred_energy_level IS 'Preferred energy level from 0 (calm) to 100 (high energy)';
COMMENT ON COLUMN public.user_music_preferences.instrumental_preference IS 'Preference for instrumental, vocal, or both types of music';