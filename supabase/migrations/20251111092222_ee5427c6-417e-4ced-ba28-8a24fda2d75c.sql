-- Create leaderboard table with anonymous pseudonyms
CREATE TABLE IF NOT EXISTS public.user_leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pseudo_anonyme TEXT NOT NULL,
  zones_completed JSONB NOT NULL DEFAULT '[]',
  total_badges INTEGER NOT NULL DEFAULT 0,
  rank INTEGER,
  monthly_badge BOOLEAN DEFAULT false,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_leaderboard ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all leaderboard entries
CREATE POLICY "Anyone can view leaderboard"
ON public.user_leaderboard
FOR SELECT
TO authenticated
USING (true);

-- Policy: Users can insert their own entry
CREATE POLICY "Users can insert their own leaderboard entry"
ON public.user_leaderboard
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own entry
CREATE POLICY "Users can update their own leaderboard entry"
ON public.user_leaderboard
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Create daily challenges table
CREATE TABLE IF NOT EXISTS public.daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_date DATE NOT NULL DEFAULT CURRENT_DATE,
  type TEXT NOT NULL CHECK (type IN ('visit', 'streak', 'zone_complete', 'social', 'time_spent')),
  objective TEXT NOT NULL,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('badge_boost', 'theme_unlock', 'avatar_unlock')),
  reward_value JSONB NOT NULL,
  emotional_profile TEXT CHECK (emotional_profile IN ('stress', 'energy', 'creativity', 'calm', 'social', 'all')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(challenge_date, type, emotional_profile)
);

-- Enable RLS
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read challenges
CREATE POLICY "Anyone can view daily challenges"
ON public.daily_challenges
FOR SELECT
TO authenticated
USING (true);

-- Create user challenges progress table
CREATE TABLE IF NOT EXISTS public.user_challenges_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge_id UUID REFERENCES public.daily_challenges(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  streak_days INTEGER DEFAULT 0,
  progress JSONB NOT NULL DEFAULT '{"current": 0, "target": 1}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Enable RLS
ALTER TABLE public.user_challenges_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own progress
CREATE POLICY "Users can view their own challenge progress"
ON public.user_challenges_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Users can insert their own progress
CREATE POLICY "Users can insert their own challenge progress"
ON public.user_challenges_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own progress
CREATE POLICY "Users can update their own challenge progress"
ON public.user_challenges_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user_challenges_progress
CREATE TRIGGER update_user_challenges_progress_updated_at
BEFORE UPDATE ON public.user_challenges_progress
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_user_leaderboard_rank ON public.user_leaderboard(rank);
CREATE INDEX idx_user_leaderboard_badges ON public.user_leaderboard(total_badges DESC);
CREATE INDEX idx_daily_challenges_date ON public.daily_challenges(challenge_date DESC);
CREATE INDEX idx_user_challenges_user_id ON public.user_challenges_progress(user_id);

-- Create function to generate random anonymous pseudonym
CREATE OR REPLACE FUNCTION generate_anonymous_pseudo()
RETURNS TEXT AS $$
DECLARE
  adjectives TEXT[] := ARRAY['Brave', 'Calm', 'Joyful', 'Wise', 'Swift', 'Noble', 'Bright', 'Peaceful', 'Strong', 'Gentle'];
  nouns TEXT[] := ARRAY['Phoenix', 'Tiger', 'Dolphin', 'Eagle', 'Wolf', 'Owl', 'Dragon', 'Lion', 'Butterfly', 'Swan'];
  random_adjective TEXT;
  random_noun TEXT;
  random_number INTEGER;
BEGIN
  random_adjective := adjectives[floor(random() * array_length(adjectives, 1) + 1)];
  random_noun := nouns[floor(random() * array_length(nouns, 1) + 1)];
  random_number := floor(random() * 999 + 1);
  RETURN random_adjective || random_noun || random_number;
END;
$$ LANGUAGE plpgsql;