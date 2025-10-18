-- Create journal_notes table for storing user journal entries
CREATE TABLE public.journal_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  text TEXT NOT NULL CHECK (char_length(text) >= 1 AND char_length(text) <= 5000),
  tags TEXT[] DEFAULT '{}',
  summary TEXT,
  mode TEXT CHECK (mode IN ('text', 'voice')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_favorite BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false
);

-- Add constraints
ALTER TABLE public.journal_notes
  ADD CONSTRAINT journal_notes_tags_length CHECK (array_length(tags, 1) IS NULL OR array_length(tags, 1) <= 8);

-- Create indexes for performance
CREATE INDEX idx_journal_notes_user_id ON public.journal_notes(user_id);
CREATE INDEX idx_journal_notes_created_at ON public.journal_notes(created_at DESC);
CREATE INDEX idx_journal_notes_tags ON public.journal_notes USING GIN(tags);
CREATE INDEX idx_journal_notes_user_created ON public.journal_notes(user_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.journal_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own notes"
  ON public.journal_notes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes"
  ON public.journal_notes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON public.journal_notes
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON public.journal_notes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_journal_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_journal_notes_updated_at
  BEFORE UPDATE ON public.journal_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_journal_notes_updated_at();

-- Add comment on table
COMMENT ON TABLE public.journal_notes IS 'Stores journal entries with text, voice transcriptions, tags, and metadata';
