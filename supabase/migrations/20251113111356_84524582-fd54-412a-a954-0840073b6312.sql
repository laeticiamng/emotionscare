-- Table pour liens de partage publics de playlists
CREATE TABLE IF NOT EXISTS public.shared_playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID NOT NULL REFERENCES public.automix_playlists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  share_token TEXT NOT NULL UNIQUE,
  is_public BOOLEAN DEFAULT true,
  qr_code_url TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_shared_playlists_token ON public.shared_playlists(share_token);
CREATE INDEX idx_shared_playlists_user ON public.shared_playlists(user_id);

ALTER TABLE public.shared_playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public shared playlists"
  ON public.shared_playlists FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users manage own shares"
  ON public.shared_playlists FOR ALL
  USING (auth.uid() = user_id);

-- Table statistiques d'écoute par playlist
CREATE TABLE IF NOT EXISTS public.playlist_listen_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID NOT NULL REFERENCES public.automix_playlists(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  track_index INTEGER,
  listened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  duration_seconds INTEGER,
  completed BOOLEAN DEFAULT false
);

CREATE INDEX idx_playlist_stats_playlist ON public.playlist_listen_stats(playlist_id);
CREATE INDEX idx_playlist_stats_listened ON public.playlist_listen_stats(listened_at DESC);

ALTER TABLE public.playlist_listen_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own stats"
  ON public.playlist_listen_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users create own stats"
  ON public.playlist_listen_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Table sessions Focus Flow collaboratives
CREATE TABLE IF NOT EXISTS public.focus_team_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name TEXT NOT NULL,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('work', 'study', 'meditation')),
  duration_minutes INTEGER NOT NULL,
  current_phase TEXT DEFAULT 'waiting' CHECK (current_phase IN ('waiting', 'active', 'break', 'completed')),
  phase_started_at TIMESTAMPTZ,
  playlist_id UUID REFERENCES public.automix_playlists(id),
  participant_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.focus_team_sessions;

CREATE INDEX idx_team_sessions_creator ON public.focus_team_sessions(creator_id);
CREATE INDEX idx_team_sessions_phase ON public.focus_team_sessions(current_phase);

ALTER TABLE public.focus_team_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active team sessions"
  ON public.focus_team_sessions FOR SELECT
  USING (current_phase IN ('waiting', 'active', 'break'));

CREATE POLICY "Creators manage own sessions"
  ON public.focus_team_sessions FOR ALL
  USING (auth.uid() = creator_id);

-- Table participants sessions d'équipe
CREATE TABLE IF NOT EXISTS public.team_session_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.focus_team_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  pomodoros_completed INTEGER DEFAULT 0,
  UNIQUE(session_id, user_id)
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.team_session_participants;

CREATE INDEX idx_participants_session ON public.team_session_participants(session_id);
CREATE INDEX idx_participants_user ON public.team_session_participants(user_id);

ALTER TABLE public.team_session_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view participants"
  ON public.team_session_participants FOR SELECT
  USING (true);

CREATE POLICY "Users manage own participation"
  ON public.team_session_participants FOR ALL
  USING (auth.uid() = user_id);

-- Table challenges d'équipe
CREATE TABLE IF NOT EXISTS public.team_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('pomodoros', 'minutes', 'sessions')),
  goal_value INTEGER NOT NULL,
  current_value INTEGER DEFAULT 0,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.team_challenges;

CREATE INDEX idx_challenges_active ON public.team_challenges(is_active, ends_at);

ALTER TABLE public.team_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active challenges"
  ON public.team_challenges FOR SELECT
  USING (is_active = true);

CREATE POLICY "Creators manage own challenges"
  ON public.team_challenges FOR ALL
  USING (auth.uid() = created_by);

-- Table leaderboard
CREATE TABLE IF NOT EXISTS public.focus_leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_pomodoros INTEGER DEFAULT 0,
  total_minutes INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_session_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.focus_leaderboard;

CREATE INDEX idx_leaderboard_pomodoros ON public.focus_leaderboard(total_pomodoros DESC);
CREATE INDEX idx_leaderboard_minutes ON public.focus_leaderboard(total_minutes DESC);

ALTER TABLE public.focus_leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view leaderboard"
  ON public.focus_leaderboard FOR SELECT
  USING (true);

CREATE POLICY "Users update own stats"
  ON public.focus_leaderboard FOR ALL
  USING (auth.uid() = user_id);

-- Table chat pour pauses
CREATE TABLE IF NOT EXISTS public.team_session_chat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.focus_team_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.team_session_chat;

CREATE INDEX idx_chat_session ON public.team_session_chat(session_id, created_at DESC);

ALTER TABLE public.team_session_chat ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view chat"
  ON public.team_session_chat FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.team_session_participants
      WHERE session_id = team_session_chat.session_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Participants can send messages"
  ON public.team_session_chat FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.team_session_participants
      WHERE session_id = team_session_chat.session_id
      AND user_id = auth.uid()
    )
  );