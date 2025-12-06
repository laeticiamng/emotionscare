
-- ============================================================================
-- EMOTIONSCARE EXCHANGE V2.0 - Database Schema
-- ============================================================================

-- 1. IMPROVEMENT MARKET
-- ============================================================================

-- User improvement goals and tracking
CREATE TABLE public.improvement_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  goal_type TEXT NOT NULL, -- 'sleep', 'stress', 'productivity', 'study', 'fitness', 'meditation'
  title TEXT NOT NULL,
  description TEXT,
  target_value NUMERIC DEFAULT 100,
  current_value NUMERIC DEFAULT 0,
  improvement_score NUMERIC DEFAULT 50, -- 0-100 market value
  ai_analysis JSONB,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  target_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'paused', 'abandoned'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Improvement progress logs
CREATE TABLE public.improvement_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID REFERENCES public.improvement_goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  value_change NUMERIC NOT NULL,
  new_value NUMERIC NOT NULL,
  ai_feedback TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Improvement market history (for charts)
CREATE TABLE public.improvement_market_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_type TEXT NOT NULL,
  avg_score NUMERIC NOT NULL,
  participants_count INTEGER DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. TRUST MARKET
-- ============================================================================

-- User trust scores
CREATE TABLE public.trust_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  trust_score NUMERIC DEFAULT 50, -- 0-100
  total_given NUMERIC DEFAULT 0,
  total_received NUMERIC DEFAULT 0,
  verified_actions INTEGER DEFAULT 0,
  level TEXT DEFAULT 'newcomer', -- 'newcomer', 'trusted', 'verified', 'expert', 'legend'
  badges JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Trust transactions
CREATE TABLE public.trust_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID NOT NULL,
  to_user_id UUID,
  to_project_id UUID,
  amount NUMERIC NOT NULL,
  reason TEXT,
  transaction_type TEXT NOT NULL, -- 'give', 'receive', 'earn', 'stake'
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Trust market projects
CREATE TABLE public.trust_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  trust_pool NUMERIC DEFAULT 0,
  backers_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. TIME EXCHANGE MARKET
-- ============================================================================

-- Time offers (skills available)
CREATE TABLE public.time_offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  skill_category TEXT NOT NULL, -- 'tech', 'music', 'coaching', 'medicine', 'art', 'language', 'business'
  skill_name TEXT NOT NULL,
  description TEXT,
  hours_available NUMERIC NOT NULL DEFAULT 1,
  time_value NUMERIC DEFAULT 1.0, -- market value multiplier
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'available', -- 'available', 'reserved', 'completed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Time exchanges
CREATE TABLE public.time_exchanges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id UUID REFERENCES public.time_offers(id),
  requester_id UUID NOT NULL,
  provider_id UUID NOT NULL,
  hours_exchanged NUMERIC NOT NULL,
  exchange_for_offer_id UUID REFERENCES public.time_offers(id),
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'completed', 'cancelled'
  rating_given NUMERIC,
  rating_received NUMERIC,
  feedback TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Time market rates by category
CREATE TABLE public.time_market_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL UNIQUE,
  current_rate NUMERIC DEFAULT 1.0,
  demand_index NUMERIC DEFAULT 50,
  supply_count INTEGER DEFAULT 0,
  trend TEXT DEFAULT 'stable', -- 'up', 'down', 'stable'
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. EMOTION EXCHANGE MARKET
-- ============================================================================

-- Emotion assets (purchasable emotion packs)
CREATE TABLE public.emotion_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  emotion_type TEXT NOT NULL, -- 'calm', 'focus', 'energy', 'joy', 'creativity', 'confidence'
  description TEXT,
  intensity NUMERIC DEFAULT 50, -- 0-100
  music_config JSONB, -- AI music generation params
  ambient_config JSONB, -- light, color, ambiance settings
  base_price NUMERIC DEFAULT 10,
  current_price NUMERIC DEFAULT 10,
  demand_score NUMERIC DEFAULT 50,
  total_purchases INTEGER DEFAULT 0,
  creator_id UUID,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User emotion portfolio
CREATE TABLE public.emotion_portfolio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  asset_id UUID REFERENCES public.emotion_assets(id),
  quantity INTEGER DEFAULT 1,
  acquired_price NUMERIC,
  acquired_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_used_at TIMESTAMP WITH TIME ZONE
);

-- Emotion market transactions
CREATE TABLE public.emotion_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  asset_id UUID REFERENCES public.emotion_assets(id),
  transaction_type TEXT NOT NULL, -- 'buy', 'sell', 'use', 'gift'
  quantity INTEGER DEFAULT 1,
  price_per_unit NUMERIC,
  total_price NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Emotion market history
CREATE TABLE public.emotion_market_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID REFERENCES public.emotion_assets(id),
  price NUMERIC NOT NULL,
  volume INTEGER DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. EXCHANGE HUB - Unified scoring and gamification
-- ============================================================================

-- User exchange profile (unified across all markets)
CREATE TABLE public.exchange_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  improvement_rank INTEGER,
  trust_rank INTEGER,
  time_rank INTEGER,
  emotion_rank INTEGER,
  badges JSONB DEFAULT '[]',
  achievements JSONB DEFAULT '[]',
  stats JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Leaderboards
CREATE TABLE public.exchange_leaderboards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  market_type TEXT NOT NULL, -- 'improvement', 'trust', 'time', 'emotion', 'global'
  score NUMERIC NOT NULL,
  rank INTEGER,
  period TEXT DEFAULT 'weekly', -- 'daily', 'weekly', 'monthly', 'alltime'
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.improvement_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.improvement_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.improvement_market_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_exchanges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_market_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotion_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotion_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotion_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotion_market_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_leaderboards ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Improvement Goals
CREATE POLICY "Users can view their own goals" ON public.improvement_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own goals" ON public.improvement_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals" ON public.improvement_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goals" ON public.improvement_goals FOR DELETE USING (auth.uid() = user_id);

-- Improvement Logs
CREATE POLICY "Users can view their own logs" ON public.improvement_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own logs" ON public.improvement_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Market History (public read)
CREATE POLICY "Anyone can view market history" ON public.improvement_market_history FOR SELECT USING (true);

-- Trust Profiles
CREATE POLICY "Anyone can view trust profiles" ON public.trust_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own trust profile" ON public.trust_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own trust profile" ON public.trust_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trust Transactions
CREATE POLICY "Users can view their transactions" ON public.trust_transactions FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
CREATE POLICY "Users can create transactions" ON public.trust_transactions FOR INSERT WITH CHECK (auth.uid() = from_user_id);

-- Trust Projects
CREATE POLICY "Anyone can view projects" ON public.trust_projects FOR SELECT USING (true);
CREATE POLICY "Users can create projects" ON public.trust_projects FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update their projects" ON public.trust_projects FOR UPDATE USING (auth.uid() = creator_id);

-- Time Offers
CREATE POLICY "Anyone can view available offers" ON public.time_offers FOR SELECT USING (true);
CREATE POLICY "Users can create their offers" ON public.time_offers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their offers" ON public.time_offers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their offers" ON public.time_offers FOR DELETE USING (auth.uid() = user_id);

-- Time Exchanges
CREATE POLICY "Users can view their exchanges" ON public.time_exchanges FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = provider_id);
CREATE POLICY "Users can create exchanges" ON public.time_exchanges FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Participants can update exchanges" ON public.time_exchanges FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = provider_id);

-- Time Market Rates (public read)
CREATE POLICY "Anyone can view market rates" ON public.time_market_rates FOR SELECT USING (true);

-- Emotion Assets (public read)
CREATE POLICY "Anyone can view emotion assets" ON public.emotion_assets FOR SELECT USING (true);
CREATE POLICY "Creators can create assets" ON public.emotion_assets FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Emotion Portfolio
CREATE POLICY "Users can view their portfolio" ON public.emotion_portfolio FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their portfolio" ON public.emotion_portfolio FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their portfolio" ON public.emotion_portfolio FOR UPDATE USING (auth.uid() = user_id);

-- Emotion Transactions
CREATE POLICY "Users can view their transactions" ON public.emotion_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create transactions" ON public.emotion_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Emotion Market History (public read)
CREATE POLICY "Anyone can view emotion market history" ON public.emotion_market_history FOR SELECT USING (true);

-- Exchange Profiles
CREATE POLICY "Anyone can view exchange profiles" ON public.exchange_profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage their exchange profile" ON public.exchange_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their exchange profile" ON public.exchange_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Leaderboards (public read)
CREATE POLICY "Anyone can view leaderboards" ON public.exchange_leaderboards FOR SELECT USING (true);
CREATE POLICY "System can manage leaderboards" ON public.exchange_leaderboards FOR INSERT WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_improvement_goals_user ON public.improvement_goals(user_id);
CREATE INDEX idx_improvement_goals_type ON public.improvement_goals(goal_type);
CREATE INDEX idx_trust_profiles_score ON public.trust_profiles(trust_score DESC);
CREATE INDEX idx_time_offers_category ON public.time_offers(skill_category);
CREATE INDEX idx_time_offers_status ON public.time_offers(status);
CREATE INDEX idx_emotion_assets_type ON public.emotion_assets(emotion_type);
CREATE INDEX idx_emotion_portfolio_user ON public.emotion_portfolio(user_id);
CREATE INDEX idx_exchange_leaderboards_market ON public.exchange_leaderboards(market_type, period);

-- Insert default time market rates
INSERT INTO public.time_market_rates (category, current_rate, demand_index) VALUES
  ('tech', 1.5, 75),
  ('music', 1.2, 60),
  ('coaching', 1.3, 65),
  ('medicine', 2.0, 85),
  ('art', 1.0, 50),
  ('language', 1.1, 55),
  ('business', 1.4, 70);

-- Insert default emotion assets
INSERT INTO public.emotion_assets (name, emotion_type, description, intensity, base_price, current_price, music_config, ambient_config) VALUES
  ('Deep Calm', 'calm', 'Une sérénité profonde pour apaiser l''esprit', 80, 15, 15, '{"tempo": 60, "genre": "ambient", "mood": "peaceful"}', '{"color": "#4A90D9", "light": 30}'),
  ('Laser Focus', 'focus', 'Concentration maximale pour la productivité', 90, 20, 22, '{"tempo": 80, "genre": "lofi", "mood": "focused"}', '{"color": "#9B59B6", "light": 50}'),
  ('Pure Energy', 'energy', 'Un boost d''énergie pour démarrer la journée', 95, 18, 20, '{"tempo": 120, "genre": "electronic", "mood": "energetic"}', '{"color": "#E74C3C", "light": 80}'),
  ('Joy Burst', 'joy', 'Une explosion de bonheur et de positivité', 85, 16, 18, '{"tempo": 110, "genre": "pop", "mood": "happy"}', '{"color": "#F1C40F", "light": 70}'),
  ('Creative Flow', 'creativity', 'Libérez votre potentiel créatif', 75, 22, 25, '{"tempo": 90, "genre": "experimental", "mood": "creative"}', '{"color": "#1ABC9C", "light": 60}'),
  ('Inner Confidence', 'confidence', 'Renforcez votre confiance intérieure', 88, 19, 21, '{"tempo": 100, "genre": "cinematic", "mood": "empowering"}', '{"color": "#E67E22", "light": 65}');

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_exchange_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_improvement_goals_updated_at BEFORE UPDATE ON public.improvement_goals FOR EACH ROW EXECUTE FUNCTION update_exchange_updated_at();
CREATE TRIGGER update_trust_profiles_updated_at BEFORE UPDATE ON public.trust_profiles FOR EACH ROW EXECUTE FUNCTION update_exchange_updated_at();
CREATE TRIGGER update_trust_projects_updated_at BEFORE UPDATE ON public.trust_projects FOR EACH ROW EXECUTE FUNCTION update_exchange_updated_at();
CREATE TRIGGER update_time_offers_updated_at BEFORE UPDATE ON public.time_offers FOR EACH ROW EXECUTE FUNCTION update_exchange_updated_at();
CREATE TRIGGER update_emotion_assets_updated_at BEFORE UPDATE ON public.emotion_assets FOR EACH ROW EXECUTE FUNCTION update_exchange_updated_at();
CREATE TRIGGER update_exchange_profiles_updated_at BEFORE UPDATE ON public.exchange_profiles FOR EACH ROW EXECUTE FUNCTION update_exchange_updated_at();
