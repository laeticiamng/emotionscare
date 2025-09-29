-- Create journal_entries table for the voice/text journal feature
CREATE TABLE public.journal_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Entry type and content
  mode TEXT NOT NULL CHECK (mode IN ('voice', 'text')),
  text_content TEXT,
  transcript TEXT,
  
  -- Analysis results
  mood_bucket TEXT CHECK (mood_bucket IN ('clear', 'mixed', 'pressured')),
  summary TEXT,
  suggestion TEXT,
  
  -- File URLs (for voice entries)
  transcript_url TEXT,
  media_url TEXT,
  
  -- Processing status
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed'))
);

-- Enable RLS
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own journal entries
CREATE POLICY "Users can view their own journal entries"
ON public.journal_entries
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journal entries"
ON public.journal_entries
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
ON public.journal_entries
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all journal entries"
ON public.journal_entries
FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role');

-- Indexes for performance
CREATE INDEX idx_journal_entries_user_created ON public.journal_entries(user_id, created_at DESC);
CREATE INDEX idx_journal_entries_status ON public.journal_entries(status) WHERE status = 'processing';

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_journal_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_journal_entries_updated_at();