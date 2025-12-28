-- Complete missing Exchange Hub Tables

-- Time Market Rates Table (if not exists)
CREATE TABLE IF NOT EXISTS public.time_market_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL UNIQUE,
  current_rate INTEGER NOT NULL DEFAULT 1,
  demand_index INTEGER NOT NULL DEFAULT 50,
  supply_count INTEGER NOT NULL DEFAULT 0,
  trend TEXT NOT NULL DEFAULT 'stable',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

DO $$ BEGIN
  ALTER TABLE public.time_market_rates ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DROP POLICY IF EXISTS "Market rates are viewable by everyone" ON public.time_market_rates;
CREATE POLICY "Market rates are viewable by everyone" ON public.time_market_rates FOR SELECT USING (true);

-- Insert default market rates
INSERT INTO public.time_market_rates (category, current_rate, demand_index, supply_count, trend) VALUES
  ('tech', 3, 75, 150, 'up'),
  ('music', 2, 60, 80, 'stable'),
  ('coaching', 4, 85, 120, 'up'),
  ('medicine', 5, 90, 50, 'up'),
  ('art', 2, 55, 100, 'stable'),
  ('language', 2, 65, 200, 'stable'),
  ('business', 3, 70, 90, 'up')
ON CONFLICT (category) DO NOTHING;

-- Emotion Assets Table (if not exists)
CREATE TABLE IF NOT EXISTS public.emotion_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  emotion_type TEXT NOT NULL,
  description TEXT,
  intensity INTEGER NOT NULL DEFAULT 50,
  music_config JSONB,
  ambient_config JSONB,
  base_price INTEGER NOT NULL DEFAULT 100,
  current_price INTEGER NOT NULL DEFAULT 100,
  demand_score INTEGER NOT NULL DEFAULT 50,
  total_purchases INTEGER NOT NULL DEFAULT 0,
  creator_id UUID,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

DO $$ BEGIN
  ALTER TABLE public.emotion_assets ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DROP POLICY IF EXISTS "Emotion assets are viewable by everyone" ON public.emotion_assets;
CREATE POLICY "Emotion assets are viewable by everyone" ON public.emotion_assets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create assets" ON public.emotion_assets;
CREATE POLICY "Authenticated users can create assets" ON public.emotion_assets FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Insert default emotion assets
INSERT INTO public.emotion_assets (name, emotion_type, description, base_price, current_price, demand_score, is_premium) VALUES
  ('Calme Profond', 'calm', 'Une expérience de sérénité absolue', 100, 120, 75, false),
  ('Focus Intense', 'focus', 'Concentration maximale pour vos tâches', 150, 180, 85, false),
  ('Énergie Pure', 'energy', 'Boost d''énergie naturel et durable', 120, 140, 70, false),
  ('Joie Radieuse', 'joy', 'Un moment de bonheur pur', 130, 155, 80, false),
  ('Créativité Libre', 'creativity', 'Libérez votre potentiel créatif', 180, 200, 65, true),
  ('Confiance Absolue', 'confidence', 'Renforcez votre assurance intérieure', 160, 185, 72, true)
ON CONFLICT DO NOTHING;

-- Emotion Portfolio Table
CREATE TABLE IF NOT EXISTS public.emotion_portfolio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  asset_id UUID NOT NULL REFERENCES public.emotion_assets(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  acquired_price INTEGER NOT NULL,
  acquired_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, asset_id)
);

DO $$ BEGIN
  ALTER TABLE public.emotion_portfolio ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DROP POLICY IF EXISTS "Users can view their own portfolio" ON public.emotion_portfolio;
CREATE POLICY "Users can view their own portfolio" ON public.emotion_portfolio FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own portfolio" ON public.emotion_portfolio;
CREATE POLICY "Users can manage their own portfolio" ON public.emotion_portfolio FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own portfolio" ON public.emotion_portfolio;
CREATE POLICY "Users can update their own portfolio" ON public.emotion_portfolio FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete from their own portfolio" ON public.emotion_portfolio;
CREATE POLICY "Users can delete from their own portfolio" ON public.emotion_portfolio FOR DELETE USING (auth.uid() = user_id);

-- Emotion Transactions Table
CREATE TABLE IF NOT EXISTS public.emotion_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  asset_id UUID NOT NULL REFERENCES public.emotion_assets(id),
  transaction_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price_per_unit INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

DO $$ BEGIN
  ALTER TABLE public.emotion_transactions ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DROP POLICY IF EXISTS "Users can view their own emotion transactions" ON public.emotion_transactions;
CREATE POLICY "Users can view their own emotion transactions" ON public.emotion_transactions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own emotion transactions" ON public.emotion_transactions;
CREATE POLICY "Users can create their own emotion transactions" ON public.emotion_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Exchange Profiles Table
CREATE TABLE IF NOT EXISTS public.exchange_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  total_xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  improvement_rank INTEGER,
  trust_rank INTEGER,
  time_rank INTEGER,
  emotion_rank INTEGER,
  badges TEXT[] DEFAULT '{}',
  achievements TEXT[] DEFAULT '{}',
  stats JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

DO $$ BEGIN
  ALTER TABLE public.exchange_profiles ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DROP POLICY IF EXISTS "Exchange profiles are viewable by everyone" ON public.exchange_profiles;
CREATE POLICY "Exchange profiles are viewable by everyone" ON public.exchange_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own exchange profile" ON public.exchange_profiles;
CREATE POLICY "Users can insert their own exchange profile" ON public.exchange_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own exchange profile" ON public.exchange_profiles;
CREATE POLICY "Users can update their own exchange profile" ON public.exchange_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Exchange Leaderboards Table
CREATE TABLE IF NOT EXISTS public.exchange_leaderboards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  market_type TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  rank INTEGER,
  period TEXT NOT NULL DEFAULT 'weekly',
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

DO $$ BEGIN
  ALTER TABLE public.exchange_leaderboards ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DROP POLICY IF EXISTS "Leaderboards are viewable by everyone" ON public.exchange_leaderboards;
CREATE POLICY "Leaderboards are viewable by everyone" ON public.exchange_leaderboards FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_emotion_assets_type ON public.emotion_assets(emotion_type);
CREATE INDEX IF NOT EXISTS idx_emotion_transactions_user ON public.emotion_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_exchange_leaderboards_market ON public.exchange_leaderboards(market_type, period);