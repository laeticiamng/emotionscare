-- Tables pour le système de spectateurs des tournois
CREATE TABLE IF NOT EXISTS public.tournament_spectators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  match_id UUID REFERENCES public.tournament_matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(tournament_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.match_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.tournament_matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.match_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.tournament_matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  predicted_winner UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reward_claimed BOOLEAN DEFAULT false,
  UNIQUE(match_id, user_id)
);

-- Tables pour le système de saisons compétitives
CREATE TABLE IF NOT EXISTS public.competitive_seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_number INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.season_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES public.competitive_seasons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  total_xp INTEGER NOT NULL DEFAULT 0,
  matches_won INTEGER DEFAULT 0,
  matches_played INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(season_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.season_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES public.competitive_seasons(id) ON DELETE CASCADE,
  rank_min INTEGER NOT NULL,
  rank_max INTEGER,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('title', 'avatar', 'theme', 'badge', 'xp_boost')),
  reward_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_season_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  season_id UUID NOT NULL REFERENCES public.competitive_seasons(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES public.season_rewards(id) ON DELETE CASCADE,
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, season_id, reward_id)
);

CREATE TABLE IF NOT EXISTS public.honorary_titles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  season_id UUID NOT NULL REFERENCES public.competitive_seasons(id) ON DELETE CASCADE,
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes
CREATE INDEX idx_tournament_spectators_tournament ON public.tournament_spectators(tournament_id);
CREATE INDEX idx_tournament_spectators_match ON public.tournament_spectators(match_id);
CREATE INDEX idx_match_chat_match ON public.match_chat_messages(match_id);
CREATE INDEX idx_match_chat_created ON public.match_chat_messages(created_at DESC);
CREATE INDEX idx_match_predictions_match ON public.match_predictions(match_id);
CREATE INDEX idx_season_rankings_season ON public.season_rankings(season_id);
CREATE INDEX idx_season_rankings_rank ON public.season_rankings(season_id, rank);
CREATE INDEX idx_user_season_rewards_user ON public.user_season_rewards(user_id);

-- RLS Policies
ALTER TABLE public.tournament_spectators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitive_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.season_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.season_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_season_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.honorary_titles ENABLE ROW LEVEL SECURITY;

-- Tournament spectators policies
CREATE POLICY "Users can view spectators" ON public.tournament_spectators FOR SELECT USING (true);
CREATE POLICY "Users can join as spectators" ON public.tournament_spectators FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave spectating" ON public.tournament_spectators FOR DELETE USING (auth.uid() = user_id);

-- Match chat policies
CREATE POLICY "Spectators can view chat" ON public.match_chat_messages FOR SELECT USING (true);
CREATE POLICY "Spectators can send messages" ON public.match_chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Match predictions policies
CREATE POLICY "Users can view predictions" ON public.match_predictions FOR SELECT USING (true);
CREATE POLICY "Users can make predictions" ON public.match_predictions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their predictions" ON public.match_predictions FOR UPDATE USING (auth.uid() = user_id);

-- Season policies
CREATE POLICY "Everyone can view seasons" ON public.competitive_seasons FOR SELECT USING (true);
CREATE POLICY "Everyone can view rankings" ON public.season_rankings FOR SELECT USING (true);
CREATE POLICY "Everyone can view rewards" ON public.season_rewards FOR SELECT USING (true);
CREATE POLICY "Users can view their season rewards" ON public.user_season_rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view honorary titles" ON public.honorary_titles FOR SELECT USING (true);