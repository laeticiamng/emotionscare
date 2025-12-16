-- Create moods table
CREATE TABLE IF NOT EXISTS public.moods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  valence NUMERIC NOT NULL CHECK (valence >= -1 AND valence <= 1),
  arousal NUMERIC NOT NULL CHECK (arousal >= -1 AND arousal <= 1),
  score NUMERIC GENERATED ALWAYS AS ((valence + 1) * 50) STORED,
  note TEXT,
  tags TEXT[] DEFAULT '{}',
  context JSONB DEFAULT '{}',
  ts TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on moods
ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;

-- RLS policies for moods
CREATE POLICY "Users can view own moods" ON public.moods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own moods" ON public.moods
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own moods" ON public.moods
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own moods" ON public.moods
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for moods
CREATE INDEX IF NOT EXISTS moods_user_id_idx ON public.moods(user_id);
CREATE INDEX IF NOT EXISTS moods_ts_idx ON public.moods(ts DESC);
CREATE INDEX IF NOT EXISTS moods_created_at_idx ON public.moods(created_at DESC);

-- Create in_app_notifications table
CREATE TABLE IF NOT EXISTS public.in_app_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('badge_progress', 'badge_unlocked', 'challenge_near_completion', 'new_challenge', 'system', 'info')),
  title TEXT NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on in_app_notifications
ALTER TABLE public.in_app_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for in_app_notifications
CREATE POLICY "Users can view own notifications" ON public.in_app_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.in_app_notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications" ON public.in_app_notifications
  FOR DELETE USING (auth.uid() = user_id);

-- Service role can insert notifications
CREATE POLICY "Service can insert notifications" ON public.in_app_notifications
  FOR INSERT WITH CHECK (true);

-- Create indexes for in_app_notifications
CREATE INDEX IF NOT EXISTS in_app_notifications_user_id_idx ON public.in_app_notifications(user_id);
CREATE INDEX IF NOT EXISTS in_app_notifications_read_idx ON public.in_app_notifications(user_id, read);
CREATE INDEX IF NOT EXISTS in_app_notifications_created_at_idx ON public.in_app_notifications(created_at DESC);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.in_app_notifications;