-- Table pour les défis personnalisés créés par les admins
CREATE TABLE IF NOT EXISTS custom_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  objective TEXT NOT NULL,
  target_value INTEGER DEFAULT 1,
  reward_type TEXT NOT NULL,
  reward_value JSONB NOT NULL,
  emotional_profile TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les badges utilisateur
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  badge_icon TEXT,
  badge_category TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress JSONB,
  unlocked BOOLEAN DEFAULT false,
  shared_on_social BOOLEAN DEFAULT false,
  UNIQUE(user_id, badge_id)
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_custom_challenges_active ON custom_challenges(is_active);
CREATE INDEX IF NOT EXISTS idx_custom_challenges_dates ON custom_challenges(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_unlocked ON user_badges(user_id, unlocked);

-- RLS policies pour custom_challenges
ALTER TABLE custom_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can create custom challenges"
ON custom_challenges FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Admins can update custom challenges"
ON custom_challenges FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Everyone can view active custom challenges"
ON custom_challenges FOR SELECT
TO authenticated
USING (is_active = true OR created_by = auth.uid());

-- RLS policies pour user_badges
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own badges"
ON user_badges FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own badges"
ON user_badges FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own badges"
ON user_badges FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_custom_challenges_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_custom_challenges_timestamp
BEFORE UPDATE ON custom_challenges
FOR EACH ROW
EXECUTE FUNCTION update_custom_challenges_updated_at();
