-- ═══════════════════════════════════════════════════════════════
-- GROUP MEDITATION TABLES
-- ═══════════════════════════════════════════════════════════════

-- 1. Sessions de méditation de groupe
CREATE TABLE IF NOT EXISTS public.group_meditation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  technique TEXT NOT NULL DEFAULT 'mindfulness',
  duration_minutes INTEGER NOT NULL DEFAULT 10,
  max_participants INTEGER DEFAULT 20,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'paused', 'completed', 'cancelled')),
  is_public BOOLEAN DEFAULT true,
  join_code TEXT UNIQUE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Participants aux sessions de groupe
CREATE TABLE IF NOT EXISTS public.group_meditation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.group_meditation_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  status TEXT NOT NULL DEFAULT 'joined' CHECK (status IN ('joined', 'ready', 'meditating', 'paused', 'left', 'completed')),
  mood_before INTEGER CHECK (mood_before BETWEEN 1 AND 10),
  mood_after INTEGER CHECK (mood_after BETWEEN 1 AND 10),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  left_at TIMESTAMPTZ,
  meditation_duration_seconds INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  UNIQUE(session_id, user_id)
);

-- 3. Messages de chat en temps réel
CREATE TABLE IF NOT EXISTS public.group_meditation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.group_meditation_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'emoji', 'encouragement')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Invitations aux sessions privées
CREATE TABLE IF NOT EXISTS public.group_meditation_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.group_meditation_sessions(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL,
  invited_user_id UUID,
  invited_email TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  token TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_group_med_sessions_host ON public.group_meditation_sessions(host_id);
CREATE INDEX IF NOT EXISTS idx_group_med_sessions_status ON public.group_meditation_sessions(status);
CREATE INDEX IF NOT EXISTS idx_group_med_sessions_scheduled ON public.group_meditation_sessions(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_group_med_sessions_join_code ON public.group_meditation_sessions(join_code);

CREATE INDEX IF NOT EXISTS idx_group_med_participants_session ON public.group_meditation_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_group_med_participants_user ON public.group_meditation_participants(user_id);

CREATE INDEX IF NOT EXISTS idx_group_med_messages_session ON public.group_meditation_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_group_med_messages_created ON public.group_meditation_messages(created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- RLS POLICIES
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.group_meditation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_meditation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_meditation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_meditation_invitations ENABLE ROW LEVEL SECURITY;

-- Sessions: lecture publique, écriture par host
CREATE POLICY "Public sessions are viewable by everyone"
  ON public.group_meditation_sessions FOR SELECT
  USING (is_public = true OR host_id = auth.uid());

CREATE POLICY "Users can create their own sessions"
  ON public.group_meditation_sessions FOR INSERT
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their own sessions"
  ON public.group_meditation_sessions FOR UPDATE
  USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their own sessions"
  ON public.group_meditation_sessions FOR DELETE
  USING (auth.uid() = host_id);

-- Participants: visible par les membres de la session
CREATE POLICY "Participants are viewable by session members"
  ON public.group_meditation_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.group_meditation_sessions s
      WHERE s.id = session_id AND (s.is_public = true OR s.host_id = auth.uid())
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Users can join sessions"
  ON public.group_meditation_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participation"
  ON public.group_meditation_participants FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can leave sessions"
  ON public.group_meditation_participants FOR DELETE
  USING (auth.uid() = user_id);

-- Messages: visible par les participants
CREATE POLICY "Messages are viewable by session participants"
  ON public.group_meditation_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.group_meditation_participants p
      WHERE p.session_id = group_meditation_messages.session_id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Participants can send messages"
  ON public.group_meditation_messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.group_meditation_participants p
      WHERE p.session_id = group_meditation_messages.session_id
      AND p.user_id = auth.uid()
    )
  );

-- Invitations
CREATE POLICY "Users can view their invitations"
  ON public.group_meditation_invitations FOR SELECT
  USING (invited_user_id = auth.uid() OR invited_by = auth.uid());

CREATE POLICY "Session hosts can create invitations"
  ON public.group_meditation_invitations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.group_meditation_sessions s
      WHERE s.id = session_id AND s.host_id = auth.uid()
    )
  );

CREATE POLICY "Invited users can update invitation status"
  ON public.group_meditation_invitations FOR UPDATE
  USING (invited_user_id = auth.uid());

-- ═══════════════════════════════════════════════════════════════
-- TRIGGERS
-- ═══════════════════════════════════════════════════════════════

-- Mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION public.update_group_meditation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_group_meditation_sessions_updated
  BEFORE UPDATE ON public.group_meditation_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_group_meditation_timestamp();

-- Générer un code de join unique
CREATE OR REPLACE FUNCTION public.generate_join_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.join_code IS NULL THEN
    NEW.join_code := upper(substr(md5(random()::text), 1, 6));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_group_meditation_join_code
  BEFORE INSERT ON public.group_meditation_sessions
  FOR EACH ROW EXECUTE FUNCTION public.generate_join_code();

-- ═══════════════════════════════════════════════════════════════
-- REALTIME
-- ═══════════════════════════════════════════════════════════════

ALTER PUBLICATION supabase_realtime ADD TABLE public.group_meditation_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_meditation_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_meditation_messages;