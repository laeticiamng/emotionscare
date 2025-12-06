-- Tables pour analytics Focus Flow (avec vérifications d'existence)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'focus_sessions') THEN
    CREATE TABLE public.focus_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      mode TEXT NOT NULL CHECK (mode IN ('work', 'study', 'meditation')),
      duration_minutes INTEGER NOT NULL,
      completed BOOLEAN DEFAULT false,
      performance_score INTEGER CHECK (performance_score >= 0 AND performance_score <= 100),
      avg_tempo INTEGER,
      interruptions_count INTEGER DEFAULT 0,
      started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      completed_at TIMESTAMPTZ,
      hour_of_day INTEGER CHECK (hour_of_day >= 0 AND hour_of_day < 24),
      day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week < 7),
      metadata JSONB
    );

    CREATE INDEX idx_focus_sessions_user ON public.focus_sessions(user_id);
    CREATE INDEX idx_focus_sessions_mode ON public.focus_sessions(mode);
    CREATE INDEX idx_focus_sessions_started ON public.focus_sessions(started_at DESC);
    CREATE INDEX idx_focus_sessions_hour ON public.focus_sessions(hour_of_day);

    ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users view own focus sessions"
      ON public.focus_sessions FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "Users create own focus sessions"
      ON public.focus_sessions FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users update own focus sessions"
      ON public.focus_sessions FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;