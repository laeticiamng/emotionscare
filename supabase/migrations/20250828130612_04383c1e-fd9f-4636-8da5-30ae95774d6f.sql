-- Tables pour Ambition Arcade
CREATE TABLE IF NOT EXISTS ambition_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  objective TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  metadata JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS ambition_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES ambition_runs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  flavor TEXT,
  est_minutes INTEGER DEFAULT 15,
  xp_reward INTEGER DEFAULT 25,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  result TEXT, -- 'success' or 'fail'
  notes TEXT
);

CREATE TABLE IF NOT EXISTS ambition_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES ambition_runs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rarity TEXT DEFAULT 'common',
  description TEXT,
  icon TEXT,
  obtained_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tables pour Bounce-Back Battle
CREATE TABLE IF NOT EXISTS bounce_battles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mode TEXT DEFAULT 'standard',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  status TEXT DEFAULT 'created'
);

CREATE TABLE IF NOT EXISTS bounce_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  battle_id UUID REFERENCES bounce_battles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  event_data JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS bounce_coping_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  battle_id UUID REFERENCES bounce_battles(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  response_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bounce_pair_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  battle_id UUID REFERENCES bounce_battles(id) ON DELETE CASCADE,
  pair_token TEXT NOT NULL,
  tip_content TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  received_tip TEXT
);

-- RLS Policies pour Ambition Arcade
ALTER TABLE ambition_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambition_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambition_artifacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own ambition runs" ON ambition_runs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage quests for their runs" ON ambition_quests
  FOR ALL USING (EXISTS (
    SELECT 1 FROM ambition_runs 
    WHERE ambition_runs.id = ambition_quests.run_id 
    AND ambition_runs.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage artifacts for their runs" ON ambition_artifacts
  FOR ALL USING (EXISTS (
    SELECT 1 FROM ambition_runs 
    WHERE ambition_runs.id = ambition_artifacts.run_id 
    AND ambition_runs.user_id = auth.uid()
  ));

-- RLS Policies pour Bounce-Back Battle
ALTER TABLE bounce_battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bounce_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bounce_coping_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bounce_pair_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own bounce battles" ON bounce_battles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage events for their battles" ON bounce_events
  FOR ALL USING (EXISTS (
    SELECT 1 FROM bounce_battles 
    WHERE bounce_battles.id = bounce_events.battle_id 
    AND bounce_battles.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage responses for their battles" ON bounce_coping_responses
  FOR ALL USING (EXISTS (
    SELECT 1 FROM bounce_battles 
    WHERE bounce_battles.id = bounce_coping_responses.battle_id 
    AND bounce_battles.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage tips for their battles" ON bounce_pair_tips
  FOR ALL USING (EXISTS (
    SELECT 1 FROM bounce_battles 
    WHERE bounce_battles.id = bounce_pair_tips.battle_id 
    AND bounce_battles.user_id = auth.uid()
  ));

-- Service role policies
CREATE POLICY "Service role can manage all ambition data" ON ambition_runs
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage all ambition quests" ON ambition_quests  
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage all ambition artifacts" ON ambition_artifacts
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage all bounce battles" ON bounce_battles
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage all bounce events" ON bounce_events
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage all bounce responses" ON bounce_coping_responses
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage all bounce tips" ON bounce_pair_tips
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');