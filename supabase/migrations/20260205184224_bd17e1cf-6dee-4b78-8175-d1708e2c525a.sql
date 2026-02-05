-- Add emotion and intensity columns to journal_entries for emotional journal feature
ALTER TABLE public.journal_entries 
ADD COLUMN IF NOT EXISTS emotion TEXT,
ADD COLUMN IF NOT EXISTS intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10);

-- Create index for filtering by emotion
CREATE INDEX IF NOT EXISTS idx_journal_entries_emotion 
  ON public.journal_entries(user_id, emotion, created_at DESC);

-- Verify RLS is enabled (should already be)
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- Ensure RLS policies exist for user access
DO $$
BEGIN
  -- Check if select policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'journal_entries' AND policyname = 'Users can view own journal entries'
  ) THEN
    CREATE POLICY "Users can view own journal entries"
      ON public.journal_entries FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
  
  -- Check if insert policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'journal_entries' AND policyname = 'Users can create own journal entries'
  ) THEN
    CREATE POLICY "Users can create own journal entries"
      ON public.journal_entries FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
  
  -- Check if update policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'journal_entries' AND policyname = 'Users can update own journal entries'
  ) THEN
    CREATE POLICY "Users can update own journal entries"
      ON public.journal_entries FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
  
  -- Check if delete policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'journal_entries' AND policyname = 'Users can delete own journal entries'
  ) THEN
    CREATE POLICY "Users can delete own journal entries"
      ON public.journal_entries FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;