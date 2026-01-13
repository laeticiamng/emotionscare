-- =====================================================
-- TOP 20 ENRICHISSEMENTS - Tables manquantes
-- =====================================================

-- 1. Table guilds (manquante pour useGuildChat)
CREATE TABLE IF NOT EXISTS public.guilds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  banner_emoji TEXT DEFAULT '🏰',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  leader_id UUID NOT NULL,
  member_count INTEGER DEFAULT 1,
  max_members INTEGER DEFAULT 50,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  is_public BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}'::TEXT[]
);

-- 2. Table tournament_participants (manquante pour useTournamentBrackets)
CREATE TABLE IF NOT EXISTS public.tournament_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  display_name TEXT NOT NULL,
  avatar_emoji TEXT DEFAULT '🎮',
  seed INTEGER DEFAULT 1,
  is_eliminated BOOLEAN DEFAULT false,
  current_round INTEGER DEFAULT 1,
  total_score INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Table community_presets (manquante pour useMoodMixerPresets)
CREATE TABLE IF NOT EXISTS public.community_presets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  creator_name TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  preset_data JSONB NOT NULL DEFAULT '{}'::JSONB,
  category TEXT DEFAULT 'mood',
  tags TEXT[] DEFAULT '{}'::TEXT[],
  likes_count INTEGER DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Table preset_likes (pour les likes des presets)
CREATE TABLE IF NOT EXISTS public.preset_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  preset_id UUID NOT NULL REFERENCES public.community_presets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(preset_id, user_id)
);

-- 5. Table weekly_challenges (défis hebdomadaires)
CREATE TABLE IF NOT EXISTS public.weekly_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge_type TEXT NOT NULL,
  target_value INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 100,
  badge_reward TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Table user_weekly_progress (progression défis hebdo)
CREATE TABLE IF NOT EXISTS public.user_weekly_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  challenge_id UUID NOT NULL REFERENCES public.weekly_challenges(id) ON DELETE CASCADE,
  current_value INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.guilds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preset_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_weekly_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for guilds
CREATE POLICY "Guilds are viewable by everyone" ON public.guilds FOR SELECT USING (true);
CREATE POLICY "Users can create guilds" ON public.guilds FOR INSERT WITH CHECK (auth.uid() = leader_id);
CREATE POLICY "Leaders can update their guilds" ON public.guilds FOR UPDATE USING (auth.uid() = leader_id);
CREATE POLICY "Leaders can delete their guilds" ON public.guilds FOR DELETE USING (auth.uid() = leader_id);

-- RLS Policies for tournament_participants
CREATE POLICY "Participants viewable by all" ON public.tournament_participants FOR SELECT USING (true);
CREATE POLICY "Users can register themselves" ON public.tournament_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their participation" ON public.tournament_participants FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for community_presets
CREATE POLICY "Public presets viewable by all" ON public.community_presets FOR SELECT USING (is_public = true OR auth.uid() = creator_id);
CREATE POLICY "Users can create presets" ON public.community_presets FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update their presets" ON public.community_presets FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Creators can delete their presets" ON public.community_presets FOR DELETE USING (auth.uid() = creator_id);

-- RLS Policies for preset_likes
CREATE POLICY "Likes viewable by all" ON public.preset_likes FOR SELECT USING (true);
CREATE POLICY "Users can like presets" ON public.preset_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike their likes" ON public.preset_likes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for weekly_challenges
CREATE POLICY "Challenges viewable by all" ON public.weekly_challenges FOR SELECT USING (true);

-- RLS Policies for user_weekly_progress
CREATE POLICY "Users view own progress" ON public.user_weekly_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own progress" ON public.user_weekly_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own progress" ON public.user_weekly_progress FOR UPDATE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tournament_participants_tournament ON public.tournament_participants(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_user ON public.tournament_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_community_presets_category ON public.community_presets(category);
CREATE INDEX IF NOT EXISTS idx_community_presets_featured ON public.community_presets(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_weekly_challenges_active ON public.weekly_challenges(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_weekly_progress_user ON public.user_weekly_progress(user_id);