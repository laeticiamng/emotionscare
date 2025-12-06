-- Create flash_lite_sessions table
CREATE TABLE IF NOT EXISTS public.flash_lite_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('quick', 'timed', 'practice', 'exam')),
  category TEXT,
  cards_total INTEGER NOT NULL DEFAULT 0,
  cards_completed INTEGER NOT NULL DEFAULT 0,
  cards_correct INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  average_response_time NUMERIC,
  accuracy_percentage NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.flash_lite_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own flash lite sessions"
  ON public.flash_lite_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own flash lite sessions"
  ON public.flash_lite_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own flash lite sessions"
  ON public.flash_lite_sessions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own flash lite sessions"
  ON public.flash_lite_sessions
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all flash lite sessions"
  ON public.flash_lite_sessions
  FOR ALL
  USING ((auth.jwt() ->> 'role') = 'service_role')
  WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Create flash_lite_cards table
CREATE TABLE IF NOT EXISTS public.flash_lite_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.flash_lite_sessions(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  user_answer TEXT,
  is_correct BOOLEAN,
  response_time_ms INTEGER,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.flash_lite_cards ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view cards of their sessions"
  ON public.flash_lite_cards
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.flash_lite_sessions
    WHERE flash_lite_sessions.id = flash_lite_cards.session_id
    AND flash_lite_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can create cards for their sessions"
  ON public.flash_lite_cards
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.flash_lite_sessions
    WHERE flash_lite_sessions.id = flash_lite_cards.session_id
    AND flash_lite_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can update cards of their sessions"
  ON public.flash_lite_cards
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.flash_lite_sessions
    WHERE flash_lite_sessions.id = flash_lite_cards.session_id
    AND flash_lite_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Service role can manage all flash lite cards"
  ON public.flash_lite_cards
  FOR ALL
  USING ((auth.jwt() ->> 'role') = 'service_role')
  WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Create indexes
CREATE INDEX idx_flash_lite_sessions_user_id ON public.flash_lite_sessions(user_id);
CREATE INDEX idx_flash_lite_sessions_started_at ON public.flash_lite_sessions(started_at);
CREATE INDEX idx_flash_lite_cards_session_id ON public.flash_lite_cards(session_id);

-- Create updated_at trigger
CREATE TRIGGER update_flash_lite_sessions_updated_at
  BEFORE UPDATE ON public.flash_lite_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_module_progress_updated_at();