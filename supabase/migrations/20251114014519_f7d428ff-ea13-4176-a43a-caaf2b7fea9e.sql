-- Migration pour le système de leaderboard, guildes et récompenses premium

-- Table des duels entre utilisateurs
CREATE TABLE IF NOT EXISTS public.user_duels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenged_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')),
  duel_type TEXT NOT NULL CHECK (duel_type IN ('xp_race', 'quest_sprint', 'streak_battle')),
  duration_hours INTEGER NOT NULL DEFAULT 24,
  challenger_score INTEGER DEFAULT 0,
  challenged_score INTEGER DEFAULT 0,
  winner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reward_xp INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  CONSTRAINT different_users CHECK (challenger_id != challenged_id)
);

-- Table des guildes musicales
CREATE TABLE IF NOT EXISTS public.music_guilds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp BIGINT DEFAULT 0,
  member_count INTEGER DEFAULT 1,
  max_members INTEGER DEFAULT 50,
  is_public BOOLEAN DEFAULT true,
  music_genre TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table des membres de guildes
CREATE TABLE IF NOT EXISTS public.guild_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id UUID NOT NULL REFERENCES public.music_guilds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  contribution_xp BIGINT DEFAULT 0,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(guild_id, user_id)
);

-- Table des messages de chat de guilde
CREATE TABLE IF NOT EXISTS public.guild_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id UUID NOT NULL REFERENCES public.music_guilds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table des défis de guilde
CREATE TABLE IF NOT EXISTS public.guild_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id UUID NOT NULL REFERENCES public.music_guilds(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('collective_xp', 'quest_completion', 'streak_maintenance', 'music_listening')),
  target_value INTEGER NOT NULL,
  current_value INTEGER DEFAULT 0,
  reward_description TEXT,
  reward_xp INTEGER DEFAULT 500,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ
);

-- Table des récompenses premium
CREATE TABLE IF NOT EXISTS public.premium_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('theme', 'avatar', 'sound_effect', 'badge', 'feature')),
  rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  required_level INTEGER DEFAULT 1,
  required_xp INTEGER,
  cost_points INTEGER DEFAULT 0,
  data JSONB NOT NULL DEFAULT '{}',
  preview_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table des récompenses débloquées par utilisateur
CREATE TABLE IF NOT EXISTS public.user_premium_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES public.premium_rewards(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_equipped BOOLEAN DEFAULT false,
  UNIQUE(user_id, reward_id)
);

-- Enable RLS
ALTER TABLE public.user_duels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_guilds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guild_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guild_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guild_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_premium_rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour user_duels
CREATE POLICY "Users can view their own duels"
  ON public.user_duels FOR SELECT
  USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);

CREATE POLICY "Users can create duels"
  ON public.user_duels FOR INSERT
  WITH CHECK (auth.uid() = challenger_id);

CREATE POLICY "Users can update their duels"
  ON public.user_duels FOR UPDATE
  USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);

-- RLS Policies pour music_guilds
CREATE POLICY "Anyone can view public guilds"
  ON public.music_guilds FOR SELECT
  USING (is_public = true OR owner_id = auth.uid());

CREATE POLICY "Authenticated users can create guilds"
  ON public.music_guilds FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Guild owners can update their guild"
  ON public.music_guilds FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Guild owners can delete their guild"
  ON public.music_guilds FOR DELETE
  USING (auth.uid() = owner_id);

-- RLS Policies pour guild_members
CREATE POLICY "Users can view guild members"
  ON public.guild_members FOR SELECT
  USING (true);

CREATE POLICY "Users can join guilds"
  ON public.guild_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave guilds"
  ON public.guild_members FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies pour guild_messages
CREATE POLICY "Guild members can view messages"
  ON public.guild_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.guild_members
      WHERE guild_members.guild_id = guild_messages.guild_id
      AND guild_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Guild members can send messages"
  ON public.guild_messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.guild_members
      WHERE guild_members.guild_id = guild_messages.guild_id
      AND guild_members.user_id = auth.uid()
    )
  );

-- RLS Policies pour guild_challenges
CREATE POLICY "Anyone can view guild challenges"
  ON public.guild_challenges FOR SELECT
  USING (true);

CREATE POLICY "Guild owners can manage challenges"
  ON public.guild_challenges FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.music_guilds
      WHERE music_guilds.id = guild_challenges.guild_id
      AND music_guilds.owner_id = auth.uid()
    )
  );

-- RLS Policies pour premium_rewards
CREATE POLICY "Anyone can view active rewards"
  ON public.premium_rewards FOR SELECT
  USING (is_active = true);

-- RLS Policies pour user_premium_rewards
CREATE POLICY "Users can view their rewards"
  ON public.user_premium_rewards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock rewards"
  ON public.user_premium_rewards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can equip/unequip rewards"
  ON public.user_premium_rewards FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes pour performance
CREATE INDEX idx_user_duels_challenger ON public.user_duels(challenger_id);
CREATE INDEX idx_user_duels_challenged ON public.user_duels(challenged_id);
CREATE INDEX idx_user_duels_status ON public.user_duels(status);
CREATE INDEX idx_guild_members_guild ON public.guild_members(guild_id);
CREATE INDEX idx_guild_members_user ON public.guild_members(user_id);
CREATE INDEX idx_guild_messages_guild ON public.guild_messages(guild_id);
CREATE INDEX idx_guild_messages_created ON public.guild_messages(created_at DESC);
CREATE INDEX idx_guild_challenges_guild ON public.guild_challenges(guild_id);
CREATE INDEX idx_guild_challenges_status ON public.guild_challenges(status);
CREATE INDEX idx_premium_rewards_type ON public.premium_rewards(reward_type);
CREATE INDEX idx_user_premium_rewards_user ON public.user_premium_rewards(user_id);

-- Trigger pour mettre à jour updated_at sur music_guilds
CREATE OR REPLACE FUNCTION update_guild_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_guild_updated_at
  BEFORE UPDATE ON public.music_guilds
  FOR EACH ROW
  EXECUTE FUNCTION update_guild_updated_at();

-- Function pour mettre à jour le nombre de membres
CREATE OR REPLACE FUNCTION update_guild_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.music_guilds
    SET member_count = member_count + 1
    WHERE id = NEW.guild_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.music_guilds
    SET member_count = member_count - 1
    WHERE id = OLD.guild_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_guild_member_count
  AFTER INSERT OR DELETE ON public.guild_members
  FOR EACH ROW
  EXECUTE FUNCTION update_guild_member_count();

-- Ajouter quelques récompenses premium par défaut
INSERT INTO public.premium_rewards (name, description, reward_type, rarity, required_level, data) VALUES
('Dark Mode Midnight', 'Thème sombre élégant avec des tons de bleu nuit', 'theme', 'common', 5, '{"colors": {"primary": "hsl(220, 70%, 50%)", "background": "hsl(220, 15%, 10%)"}}'),
('Neon Dreams', 'Thème vibrant avec des couleurs néon', 'theme', 'rare', 10, '{"colors": {"primary": "hsl(300, 80%, 60%)", "accent": "hsl(180, 80%, 60%)"}}'),
('Golden Hour', 'Thème chaleureux aux tons dorés', 'theme', 'epic', 20, '{"colors": {"primary": "hsl(35, 80%, 50%)", "background": "hsl(35, 40%, 95%)"}}'),
('Aurora Borealis', 'Thème inspiré des aurores boréales', 'theme', 'legendary', 50, '{"colors": {"primary": "hsl(160, 70%, 50%)", "secondary": "hsl(270, 70%, 50%)"}}'),
('Dancing Avatar', 'Avatar animé qui danse sur la musique', 'avatar', 'rare', 15, '{"animation": "dance", "frames": 8}'),
('Glowing Avatar', 'Avatar avec effet de lueur pulsante', 'avatar', 'epic', 25, '{"animation": "glow", "color": "rainbow"}'),
('Victory Fanfare', 'Son de victoire épique', 'sound_effect', 'rare', 12, '{"sound": "victory_fanfare.mp3"}'),
('Level Up Chime', 'Son cristallin de montée de niveau', 'sound_effect', 'common', 8, '{"sound": "level_up.mp3"}');
