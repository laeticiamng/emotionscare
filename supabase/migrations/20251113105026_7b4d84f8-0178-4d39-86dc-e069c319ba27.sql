-- Table pour les sessions Focus Flow
CREATE TABLE IF NOT EXISTS public.focus_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('work', 'study', 'meditation')),
  duration_minutes INTEGER NOT NULL DEFAULT 120,
  pomodoro_duration INTEGER NOT NULL DEFAULT 25,
  break_duration INTEGER NOT NULL DEFAULT 5,
  start_tempo INTEGER NOT NULL DEFAULT 80,
  peak_tempo INTEGER NOT NULL DEFAULT 100,
  end_tempo INTEGER NOT NULL DEFAULT 70,
  tracks_generated INTEGER DEFAULT 0,
  pomodoros_completed INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les tracks Focus (sans référence à music_generations)
CREATE TABLE IF NOT EXISTS public.focus_session_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.focus_sessions(id) ON DELETE CASCADE,
  track_title TEXT,
  track_url TEXT,
  suno_task_id TEXT,
  sequence_order INTEGER NOT NULL,
  target_tempo INTEGER NOT NULL,
  phase TEXT NOT NULL CHECK (phase IN ('warmup', 'peak', 'sustain', 'cooldown')),
  pomodoro_index INTEGER NOT NULL,
  duration_seconds INTEGER DEFAULT 240,
  emotion TEXT,
  generation_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user ON public.focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_started ON public.focus_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_focus_session_tracks_session ON public.focus_session_tracks(session_id);
CREATE INDEX IF NOT EXISTS idx_focus_session_tracks_order ON public.focus_session_tracks(session_id, sequence_order);

-- RLS pour focus_sessions
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own focus sessions"
  ON public.focus_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own focus sessions"
  ON public.focus_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own focus sessions"
  ON public.focus_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own focus sessions"
  ON public.focus_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- RLS pour focus_session_tracks
ALTER TABLE public.focus_session_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own focus session tracks"
  ON public.focus_session_tracks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.focus_sessions
      WHERE focus_sessions.id = focus_session_tracks.session_id
      AND focus_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own focus session tracks"
  ON public.focus_session_tracks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.focus_sessions
      WHERE focus_sessions.id = focus_session_tracks.session_id
      AND focus_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own focus session tracks"
  ON public.focus_session_tracks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.focus_sessions
      WHERE focus_sessions.id = focus_session_tracks.session_id
      AND focus_sessions.user_id = auth.uid()
    )
  );

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_focus_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_focus_sessions_updated_at
  BEFORE UPDATE ON public.focus_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_focus_sessions_updated_at();