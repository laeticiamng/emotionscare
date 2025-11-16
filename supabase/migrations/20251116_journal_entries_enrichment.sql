-- Migration: Journal Entries Enrichment
-- Created: 2025-11-16
-- Description: Ajouter les colonnes manquantes pour supporter le contrat API complet

-- Add new columns to journal_entries (if they don't exist)
DO $$
BEGIN
  -- Add title column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='journal_entries' AND column_name='title') THEN
    ALTER TABLE public.journal_entries
      ADD COLUMN title TEXT NOT NULL DEFAULT 'Untitled';
  END IF;

  -- Add content column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='journal_entries' AND column_name='content') THEN
    ALTER TABLE public.journal_entries
      ADD COLUMN content TEXT;
    -- Migrate existing text to content
    UPDATE public.journal_entries SET content = text WHERE content IS NULL;
    ALTER TABLE public.journal_entries ALTER COLUMN content SET NOT NULL;
  END IF;

  -- Add mood column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='journal_entries' AND column_name='mood') THEN
    ALTER TABLE public.journal_entries
      ADD COLUMN mood TEXT NOT NULL DEFAULT 'neutral';
  END IF;

  -- Add mood_score column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='journal_entries' AND column_name='mood_score') THEN
    ALTER TABLE public.journal_entries
      ADD COLUMN mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10);
  END IF;

  -- Add emotion column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='journal_entries' AND column_name='emotion') THEN
    ALTER TABLE public.journal_entries
      ADD COLUMN emotion TEXT;
  END IF;

  -- Add date column (distinct from created_at for user-specified dates)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='journal_entries' AND column_name='date') THEN
    ALTER TABLE public.journal_entries
      ADD COLUMN date TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;

  -- Add ai_feedback column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='journal_entries' AND column_name='ai_feedback') THEN
    ALTER TABLE public.journal_entries
      ADD COLUMN ai_feedback TEXT;
  END IF;
END $$;

-- Create additional indexes for new columns
CREATE INDEX IF NOT EXISTS idx_journal_entries_mood ON public.journal_entries(mood);
CREATE INDEX IF NOT EXISTS idx_journal_entries_mood_score ON public.journal_entries(mood_score);
CREATE INDEX IF NOT EXISTS idx_journal_entries_date ON public.journal_entries(date DESC);

-- Update comment
COMMENT ON TABLE public.journal_entries IS 'User journal entries with mood tracking and AI feedback support';

-- Add column comments
COMMENT ON COLUMN public.journal_entries.title IS 'Entry title';
COMMENT ON COLUMN public.journal_entries.content IS 'Full entry content';
COMMENT ON COLUMN public.journal_entries.text IS 'Legacy text field (kept for backwards compatibility)';
COMMENT ON COLUMN public.journal_entries.mood IS 'Mood descriptor (e.g., happy, sad, anxious)';
COMMENT ON COLUMN public.journal_entries.mood_score IS 'Numerical mood rating from 1-10';
COMMENT ON COLUMN public.journal_entries.emotion IS 'Primary emotion detected or selected';
COMMENT ON COLUMN public.journal_entries.date IS 'User-specified entry date (may differ from created_at)';
COMMENT ON COLUMN public.journal_entries.ai_feedback IS 'AI-generated feedback on the entry';
COMMENT ON COLUMN public.journal_entries.tags IS 'User-defined tags for categorization';
