-- Création des tables pour le système de gamification complet

-- Table pour les statistiques utilisateur
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  level INTEGER DEFAULT 1,
  total_points INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  completed_challenges INTEGER DEFAULT 0,
  total_badges INTEGER DEFAULT 0,
  rank TEXT DEFAULT 'Novice',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les défis
CREATE TABLE IF NOT EXISTS challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('emotional', 'physical', 'mental', 'social')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('facile', 'moyen', 'difficile')),
  points INTEGER NOT NULL DEFAULT 0,
  progress INTEGER DEFAULT 0,
  target_value INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('count', 'duration', 'completion')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Table pour les définitions d'achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary', 'mythic')),
  icon TEXT,
  conditions JSONB NOT NULL DEFAULT '[]',
  rewards JSONB NOT NULL DEFAULT '{}',
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les achievements débloqués par les utilisateurs
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL REFERENCES achievements(id),
  progress INTEGER DEFAULT 0,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Table pour l'historique des points
CREATE TABLE IF NOT EXISTS points_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  challenge_id UUID REFERENCES challenges(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes pour performance
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_user_id ON challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_expires_at ON challenges(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_points_history_user_id ON points_history(user_id);

-- RLS Policies
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_history ENABLE ROW LEVEL SECURITY;

-- Politiques pour user_stats
CREATE POLICY "Users can view their own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques pour challenges
CREATE POLICY "Users can view their own challenges" ON challenges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenges" ON challenges
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all challenges" ON challenges
  FOR ALL USING ((auth.jwt() ->> 'role') = 'service_role');

-- Politiques pour achievements (lecture publique)
CREATE POLICY "Anyone can view achievements" ON achievements
  FOR SELECT USING (true);

-- Politiques pour user_achievements
CREATE POLICY "Users can view their own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" ON user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques pour points_history
CREATE POLICY "Users can view their own points history" ON points_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage points history" ON points_history
  FOR ALL USING ((auth.jwt() ->> 'role') = 'service_role');

-- Fonction pour mettre à jour les statistiques utilisateur
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour les stats quand un défi est complété
  IF NEW.completed = true AND OLD.completed = false THEN
    UPDATE user_stats 
    SET 
      total_points = total_points + NEW.points,
      completed_challenges = completed_challenges + 1,
      updated_at = now()
    WHERE user_id = NEW.user_id;
    
    -- Ajouter une entrée dans l'historique des points
    INSERT INTO points_history (user_id, points, reason, challenge_id)
    VALUES (NEW.user_id, NEW.points, 'Challenge completed: ' || NEW.title, NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour les stats automatiquement
CREATE TRIGGER trigger_update_user_stats
  AFTER UPDATE ON challenges
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();

-- Insérer quelques achievements de base
INSERT INTO achievements (name, description, category, rarity, icon, conditions, rewards) VALUES 
('Premier Scan', 'Effectuez votre premier scan émotionnel', 'emotional', 'common', '🎯', 
 '[{"type": "count", "target": 1, "description": "Effectuer 1 scan émotionnel"}]',
 '{"xp": 50}'),
('Explorateur Émotionnel', 'Identifiez 50 émotions différentes', 'emotional', 'rare', '🗺️',
 '[{"type": "count", "target": 50, "description": "Identifier 50 émotions uniques"}]',
 '{"xp": 250, "title": "Explorateur"}'),
('Guerrier Hebdomadaire', 'Maintenez une série de 7 jours', 'streak', 'common', '🔥',
 '[{"type": "streak", "target": 7, "description": "Série de 7 jours consécutifs"}]',
 '{"xp": 200}'),
('Champion Mensuel', 'Maintenez une série de 30 jours', 'streak', 'epic', '🏆',
 '[{"type": "streak", "target": 30, "description": "Série de 30 jours consécutifs"}]',
 '{"xp": 1000, "title": "Champion"}')
ON CONFLICT DO NOTHING;