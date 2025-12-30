-- Add missing columns to story_synth_sessions
ALTER TABLE public.story_synth_sessions 
ADD COLUMN IF NOT EXISTS theme text,
ADD COLUMN IF NOT EXISTS tone text,
ADD COLUMN IF NOT EXISTS reading_duration_seconds integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_favorite boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS user_context text,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_story_synth_user_id ON public.story_synth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_story_synth_created_at ON public.story_synth_sessions(created_at DESC);

-- Create trigger for updated_at if not exists
CREATE OR REPLACE FUNCTION public.handle_story_synth_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS story_synth_updated_at ON public.story_synth_sessions;
CREATE TRIGGER story_synth_updated_at
  BEFORE UPDATE ON public.story_synth_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_story_synth_updated_at();