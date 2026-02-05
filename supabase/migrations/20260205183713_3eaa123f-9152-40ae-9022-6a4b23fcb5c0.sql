-- Create breathing_sessions table for tracking breathing exercises
CREATE TABLE IF NOT EXISTS public.breathing_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  protocol TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  feedback TEXT CHECK (feedback IN ('better', 'same', 'worse')),
  completed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for faster user queries
CREATE INDEX IF NOT EXISTS idx_breathing_sessions_user_id 
  ON public.breathing_sessions(user_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.breathing_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own breathing sessions"
  ON public.breathing_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own breathing sessions"
  ON public.breathing_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own breathing sessions"
  ON public.breathing_sessions FOR UPDATE
  USING (auth.uid() = user_id);