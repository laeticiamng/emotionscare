-- Create clinical assessments table for WHO-5, PHQ-9, etc.
CREATE TABLE IF NOT EXISTS public.clinical_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('WHO5', 'PHQ9', 'GAD7', 'STAI6')),
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clinical_assessments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own clinical assessments"
  ON public.clinical_assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own clinical assessments"
  ON public.clinical_assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own clinical assessments"
  ON public.clinical_assessments FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for efficient queries
CREATE INDEX idx_clinical_assessments_user_type 
  ON public.clinical_assessments(user_id, type, created_at DESC);