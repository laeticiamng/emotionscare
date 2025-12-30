-- =============================================
-- MODULE BUDDIES - Tables complètes
-- =============================================

-- Profils de buddy étendus
CREATE TABLE IF NOT EXISTS public.buddy_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  timezone TEXT,
  age_range TEXT, -- '18-25', '26-35', etc.
  interests TEXT[] DEFAULT '{}',
  goals TEXT[] DEFAULT '{}',
  availability_status TEXT DEFAULT 'offline', -- online, away, busy, offline
  availability_schedule JSONB DEFAULT '{}',
  looking_for TEXT[] DEFAULT '{}', -- 'support', 'motivation', 'accountability', 'friendship'
  languages TEXT[] DEFAULT ARRAY['fr'],
  mood_preference TEXT, -- 'calm', 'energetic', 'supportive'
  experience_level TEXT DEFAULT 'beginner', -- beginner, intermediate, advanced
  badges TEXT[] DEFAULT '{}',
  xp_points INTEGER DEFAULT 0,
  support_score INTEGER DEFAULT 0,
  response_rate DECIMAL(5,2) DEFAULT 100.00,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_verified BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Matches entre buddies
CREATE TABLE IF NOT EXISTS public.buddy_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 UUID NOT NULL,
  user_id_2 UUID NOT NULL,
  compatibility_score INTEGER DEFAULT 0 CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
  match_reason TEXT,
  mutual_interests TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending', -- pending, accepted, declined, blocked
  initiated_by UUID,
  matched_at TIMESTAMP WITH TIME ZONE,
  last_interaction_at TIMESTAMP WITH TIME ZONE,
  interaction_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id_1, user_id_2)
);

-- Messages entre buddies
CREATE TABLE IF NOT EXISTS public.buddy_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES public.buddy_matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- text, activity_invite, system, emoji, voice
  reply_to_id UUID REFERENCES public.buddy_messages(id),
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activités partagées entre buddies
CREATE TABLE IF NOT EXISTS public.buddy_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES public.buddy_matches(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  activity_type TEXT NOT NULL, -- meditation, exercise, reading, gaming, creative, call, challenge
  scheduled_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT DEFAULT 'planned', -- planned, in_progress, completed, cancelled
  xp_reward INTEGER DEFAULT 20,
  participants_mood_before JSONB DEFAULT '{}',
  participants_mood_after JSONB DEFAULT '{}',
  outcome_notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Demandes de buddy (requests)
CREATE TABLE IF NOT EXISTS public.buddy_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL,
  to_user_id UUID NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending', -- pending, accepted, declined, expired
  compatibility_score INTEGER,
  responded_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(from_user_id, to_user_id)
);

-- Sessions en direct entre buddies
CREATE TABLE IF NOT EXISTS public.buddy_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES public.buddy_matches(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL, -- voice_call, video_call, co_activity, focus_session
  started_by UUID NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  notes TEXT,
  xp_earned INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Statistiques buddy
CREATE TABLE IF NOT EXISTS public.buddy_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  total_buddies INTEGER DEFAULT 0,
  total_messages_sent INTEGER DEFAULT 0,
  total_messages_received INTEGER DEFAULT 0,
  total_activities_completed INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  total_session_minutes INTEGER DEFAULT 0,
  average_response_time_minutes INTEGER,
  longest_streak_days INTEGER DEFAULT 0,
  current_streak_days INTEGER DEFAULT 0,
  xp_from_buddies INTEGER DEFAULT 0,
  last_activity_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_buddy_profiles_user ON public.buddy_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_buddy_profiles_status ON public.buddy_profiles(availability_status);
CREATE INDEX IF NOT EXISTS idx_buddy_matches_users ON public.buddy_matches(user_id_1, user_id_2);
CREATE INDEX IF NOT EXISTS idx_buddy_matches_status ON public.buddy_matches(status);
CREATE INDEX IF NOT EXISTS idx_buddy_messages_match ON public.buddy_messages(match_id);
CREATE INDEX IF NOT EXISTS idx_buddy_messages_receiver ON public.buddy_messages(receiver_id, is_read);
CREATE INDEX IF NOT EXISTS idx_buddy_requests_to ON public.buddy_requests(to_user_id, status);

-- Enable RLS
ALTER TABLE public.buddy_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buddy_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buddy_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buddy_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buddy_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buddy_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buddy_stats ENABLE ROW LEVEL SECURITY;

-- Policies for buddy_profiles
CREATE POLICY "Profiles are viewable by authenticated users" ON public.buddy_profiles
  FOR SELECT USING (is_visible = true OR user_id = auth.uid());

CREATE POLICY "Users can create their own profile" ON public.buddy_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.buddy_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for buddy_matches
CREATE POLICY "Users can view their matches" ON public.buddy_matches
  FOR SELECT USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

CREATE POLICY "Users can create matches" ON public.buddy_matches
  FOR INSERT WITH CHECK (auth.uid() = user_id_1 OR auth.uid() = initiated_by);

CREATE POLICY "Users can update their matches" ON public.buddy_matches
  FOR UPDATE USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- Policies for buddy_messages
CREATE POLICY "Users can view their messages" ON public.buddy_messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON public.buddy_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update read status" ON public.buddy_messages
  FOR UPDATE USING (auth.uid() = receiver_id);

-- Policies for buddy_activities
CREATE POLICY "Participants can view activities" ON public.buddy_activities
  FOR SELECT USING (true);

CREATE POLICY "Users can create activities" ON public.buddy_activities
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update activities" ON public.buddy_activities
  FOR UPDATE USING (auth.uid() = created_by);

-- Policies for buddy_requests
CREATE POLICY "Users can view their requests" ON public.buddy_requests
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can send requests" ON public.buddy_requests
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Recipients can respond to requests" ON public.buddy_requests
  FOR UPDATE USING (auth.uid() = to_user_id);

-- Policies for buddy_sessions
CREATE POLICY "Participants can view sessions" ON public.buddy_sessions
  FOR SELECT USING (true);

CREATE POLICY "Users can create sessions" ON public.buddy_sessions
  FOR INSERT WITH CHECK (auth.uid() = started_by);

CREATE POLICY "Users can update sessions" ON public.buddy_sessions
  FOR UPDATE USING (auth.uid() = started_by);

-- Policies for buddy_stats
CREATE POLICY "Users can view their stats" ON public.buddy_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their stats" ON public.buddy_stats
  FOR ALL USING (auth.uid() = user_id);

-- Function to calculate compatibility score
CREATE OR REPLACE FUNCTION public.calculate_buddy_compatibility(user1_id UUID, user2_id UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 50;
  profile1 RECORD;
  profile2 RECORD;
  common_interests INTEGER;
  common_goals INTEGER;
BEGIN
  SELECT * INTO profile1 FROM public.buddy_profiles WHERE user_id = user1_id;
  SELECT * INTO profile2 FROM public.buddy_profiles WHERE user_id = user2_id;
  
  IF profile1 IS NULL OR profile2 IS NULL THEN
    RETURN 50;
  END IF;
  
  -- Common interests (+3 per match, max +30)
  SELECT COUNT(*) INTO common_interests 
  FROM unnest(profile1.interests) i1 
  JOIN unnest(profile2.interests) i2 ON i1 = i2;
  score := score + LEAST(common_interests * 3, 30);
  
  -- Common goals (+5 per match, max +20)
  SELECT COUNT(*) INTO common_goals 
  FROM unnest(profile1.goals) g1 
  JOIN unnest(profile2.goals) g2 ON g1 = g2;
  score := score + LEAST(common_goals * 5, 20);
  
  RETURN LEAST(score, 100);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to update stats on new message
CREATE OR REPLACE FUNCTION public.update_buddy_stats_on_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Update sender stats
  INSERT INTO public.buddy_stats (user_id, total_messages_sent, last_activity_at)
  VALUES (NEW.sender_id, 1, now())
  ON CONFLICT (user_id) DO UPDATE SET
    total_messages_sent = buddy_stats.total_messages_sent + 1,
    last_activity_at = now(),
    updated_at = now();
  
  -- Update receiver stats
  INSERT INTO public.buddy_stats (user_id, total_messages_received, last_activity_at)
  VALUES (NEW.receiver_id, 1, now())
  ON CONFLICT (user_id) DO UPDATE SET
    total_messages_received = buddy_stats.total_messages_received + 1,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER trigger_update_buddy_stats_message
AFTER INSERT ON public.buddy_messages
FOR EACH ROW EXECUTE FUNCTION public.update_buddy_stats_on_message();

-- Function to update match interaction
CREATE OR REPLACE FUNCTION public.update_match_interaction()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.buddy_matches
  SET 
    interaction_count = interaction_count + 1,
    last_interaction_at = now()
  WHERE id = NEW.match_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER trigger_update_match_interaction
AFTER INSERT ON public.buddy_messages
FOR EACH ROW EXECUTE FUNCTION public.update_match_interaction();