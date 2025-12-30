-- =====================================================
-- MIGRATION: Module Activities complet
-- =====================================================

-- 1. Table catalogue des activités
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('relaxation', 'physical', 'creative', 'social', 'mindfulness', 'nature')),
  duration_minutes INTEGER NOT NULL DEFAULT 10,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  icon TEXT,
  tags TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  instructions TEXT[] DEFAULT '{}',
  is_premium BOOLEAN DEFAULT false,
  image_url TEXT,
  audio_url TEXT,
  video_url TEXT,
  popularity_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Table favoris utilisateur
CREATE TABLE public.user_favorite_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, activity_id)
);

-- 3. Table sessions d'activités (historique détaillé)
CREATE TABLE public.activity_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_id UUID REFERENCES public.activities(id) ON DELETE SET NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  mood_before INTEGER CHECK (mood_before >= 1 AND mood_before <= 10),
  mood_after INTEGER CHECK (mood_after >= 1 AND mood_after <= 10),
  energy_before INTEGER CHECK (energy_before >= 1 AND energy_before <= 10),
  energy_after INTEGER CHECK (energy_after >= 1 AND energy_after <= 10),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  was_guided BOOLEAN DEFAULT false,
  completed BOOLEAN DEFAULT false,
  xp_earned INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'
);

-- 4. Table streaks/séries d'activités
CREATE TABLE public.activity_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  total_activities INTEGER DEFAULT 0,
  total_minutes INTEGER DEFAULT 0,
  weekly_goal INTEGER DEFAULT 5,
  weekly_progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- 5. Table rappels d'activités
CREATE TABLE public.activity_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE,
  reminder_time TIME NOT NULL,
  days_of_week INTEGER[] DEFAULT '{1,2,3,4,5}', -- 0=dimanche, 1=lundi...
  is_active BOOLEAN DEFAULT true,
  last_sent_at TIMESTAMP WITH TIME ZONE,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Table badges d'activités
CREATE TABLE public.activity_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  requirement_type TEXT NOT NULL, -- 'streak', 'total', 'category', 'duration'
  requirement_value INTEGER NOT NULL,
  requirement_category TEXT, -- pour les badges par catégorie
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  xp_reward INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Table badges gagnés
CREATE TABLE public.user_activity_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  badge_id UUID NOT NULL REFERENCES public.activity_badges(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  shared BOOLEAN DEFAULT false,
  UNIQUE(user_id, badge_id)
);

-- 8. Table recommandations d'activités
CREATE TABLE public.activity_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  score NUMERIC(3,2) DEFAULT 0.5,
  based_on TEXT, -- 'mood', 'history', 'time', 'weather', 'streak'
  is_active BOOLEAN DEFAULT true,
  clicked BOOLEAN DEFAULT false,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- INSERTION DES ACTIVITÉS DE BASE
-- =====================================================

INSERT INTO public.activities (title, description, category, duration_minutes, difficulty, icon, tags, benefits, instructions, is_premium) VALUES
-- Relaxation
('Respiration 4-7-8', 'Technique de respiration apaisante pour réduire le stress et favoriser le calme', 'relaxation', 5, 'easy', 'Wind', 
 ARRAY['respiration', 'stress', 'calme'], 
 ARRAY['Réduit l''anxiété', 'Améliore le sommeil', 'Calme le système nerveux'],
 ARRAY['Inspirez par le nez pendant 4 secondes', 'Retenez votre souffle pendant 7 secondes', 'Expirez lentement par la bouche pendant 8 secondes', 'Répétez 4 cycles'],
 false),
 
('Scan corporel relaxant', 'Parcourez mentalement chaque partie de votre corps pour libérer les tensions', 'relaxation', 15, 'easy', 'User', 
 ARRAY['body scan', 'relaxation', 'tension'], 
 ARRAY['Détend les muscles', 'Améliore la conscience corporelle', 'Réduit le stress physique'],
 ARRAY['Allongez-vous confortablement', 'Fermez les yeux et respirez profondément', 'Portez attention à vos pieds, détendez-les', 'Remontez progressivement jusqu''à la tête'],
 false),

('Méditation guidée du soir', 'Préparez votre esprit au repos avec cette méditation apaisante', 'relaxation', 20, 'medium', 'Moon', 
 ARRAY['méditation', 'sommeil', 'soir'], 
 ARRAY['Favorise l''endormissement', 'Calme les pensées', 'Améliore la qualité du sommeil'],
 ARRAY['Installez-vous au lit', 'Fermez les yeux', 'Suivez les instructions audio', 'Laissez-vous guider vers le sommeil'],
 true),

-- Physical
('Étirements matinaux', 'Réveillez votre corps en douceur avec une routine d''étirements', 'physical', 10, 'easy', 'Sunrise', 
 ARRAY['étirements', 'matin', 'réveil'], 
 ARRAY['Améliore la flexibilité', 'Booste l''énergie', 'Réduit les raideurs'],
 ARRAY['Étirez vos bras au-dessus de la tête', 'Penchez-vous vers vos orteils', 'Rotation douce du cou', 'Étirement des hanches'],
 false),

('Marche consciente', 'Transformez votre marche quotidienne en moment de pleine conscience', 'physical', 20, 'easy', 'Footprints', 
 ARRAY['marche', 'mindfulness', 'extérieur'], 
 ARRAY['Combine exercice et méditation', 'Réduit le stress', 'Améliore la concentration'],
 ARRAY['Marchez à un rythme confortable', 'Concentrez-vous sur chaque pas', 'Observez votre environnement', 'Respirez en rythme avec vos pas'],
 false),

('Yoga doux', 'Séance de yoga accessible pour tous les niveaux', 'physical', 30, 'medium', 'Activity', 
 ARRAY['yoga', 'flexibilité', 'force'], 
 ARRAY['Renforce le corps', 'Améliore l''équilibre', 'Calme l''esprit'],
 ARRAY['Commencez en position du chat-vache', 'Passez au chien tête en bas', 'Guerrier I et II', 'Terminez en savasana'],
 false),

-- Creative
('Journal de gratitude', 'Notez 3 choses positives de votre journée', 'creative', 10, 'easy', 'BookOpen', 
 ARRAY['écriture', 'gratitude', 'positif'], 
 ARRAY['Améliore l''humeur', 'Renforce l''optimisme', 'Réduit l''anxiété'],
 ARRAY['Prenez un carnet ou ouvrez une note', 'Écrivez 3 choses pour lesquelles vous êtes reconnaissant', 'Détaillez pourquoi chacune est importante', 'Relisez et souriez'],
 false),

('Coloriage anti-stress', 'Laissez votre créativité s''exprimer avec des mandalas apaisants', 'creative', 25, 'easy', 'Palette', 
 ARRAY['art', 'coloriage', 'détente'], 
 ARRAY['Réduit l''anxiété', 'Améliore la concentration', 'Exprime la créativité'],
 ARRAY['Choisissez un mandala', 'Sélectionnez vos couleurs', 'Coloriez lentement, zone par zone', 'Concentrez-vous sur le moment présent'],
 false),

('Écriture libre', 'Libérez vos pensées en écrivant sans filtre pendant 10 minutes', 'creative', 15, 'medium', 'PenTool', 
 ARRAY['écriture', 'expression', 'libération'], 
 ARRAY['Libère les émotions', 'Clarifie les pensées', 'Réduit le stress mental'],
 ARRAY['Réglez un timer de 10 minutes', 'Écrivez sans vous arrêter', 'Ne vous censurés pas', 'Ne relisez pas avant la fin'],
 false),

-- Social
('Appel bienveillant', 'Prenez des nouvelles d''un proche que vous n''avez pas contacté récemment', 'social', 15, 'easy', 'Phone', 
 ARRAY['connexion', 'famille', 'amis'], 
 ARRAY['Renforce les liens', 'Combat la solitude', 'Apporte de la joie'],
 ARRAY['Pensez à quelqu''un que vous appréciez', 'Appelez-le ou envoyez un message', 'Écoutez activement', 'Partagez un souvenir positif'],
 false),

('Acte de gentillesse', 'Réalisez un geste altruiste pour quelqu''un d''autre', 'social', 20, 'medium', 'Heart', 
 ARRAY['gentillesse', 'altruisme', 'bonheur'], 
 ARRAY['Booste le bien-être', 'Crée des connexions', 'Améliore l''estime de soi'],
 ARRAY['Choisissez un acte de gentillesse simple', 'Aidez un collègue, un voisin ou un inconnu', 'Faites-le sans attente de retour', 'Savourez le sentiment positif'],
 false),

-- Mindfulness
('Méditation de 5 minutes', 'Une pause méditative rapide pour recentrer votre esprit', 'mindfulness', 5, 'easy', 'Brain', 
 ARRAY['méditation', 'concentration', 'pause'], 
 ARRAY['Réduit le stress', 'Améliore la clarté mentale', 'Recharge l''énergie'],
 ARRAY['Asseyez-vous confortablement', 'Fermez les yeux', 'Concentrez-vous sur votre respiration', 'Ramenez doucement votre attention si elle s''égare'],
 false),

('Observation sensorielle', 'Éveillez vos 5 sens avec cet exercice de pleine conscience', 'mindfulness', 10, 'easy', 'Eye', 
 ARRAY['sens', 'présence', 'conscience'], 
 ARRAY['Ancre dans le présent', 'Réduit l''anxiété', 'Améliore la perception'],
 ARRAY['Nommez 5 choses que vous voyez', '4 choses que vous entendez', '3 choses que vous touchez', '2 que vous sentez, 1 que vous goûtez'],
 false),

('Méditation de compassion', 'Cultivez la bienveillance envers vous-même et les autres', 'mindfulness', 15, 'medium', 'HeartHandshake', 
 ARRAY['compassion', 'bienveillance', 'amour'], 
 ARRAY['Développe l''empathie', 'Réduit la critique interne', 'Améliore les relations'],
 ARRAY['Pensez à quelqu''un que vous aimez', 'Envoyez-lui mentalement des pensées positives', 'Faites de même pour vous', 'Étendez à tous les êtres'],
 true),

-- Nature
('Bain de forêt virtuel', 'Immergez-vous dans la nature avec cette visualisation guidée', 'nature', 15, 'easy', 'TreePine', 
 ARRAY['nature', 'visualisation', 'forêt'], 
 ARRAY['Réduit le cortisol', 'Améliore l''humeur', 'Connecte à la nature'],
 ARRAY['Fermez les yeux', 'Imaginez une forêt paisible', 'Visualisez les arbres, entendez les oiseaux', 'Respirez l''air frais imaginaire'],
 false),

('Jardinage conscient', 'Prenez soin de vos plantes avec attention et présence', 'nature', 20, 'easy', 'Flower2', 
 ARRAY['plantes', 'jardinage', 'soin'], 
 ARRAY['Connecte à la nature', 'Réduit le stress', 'Donne un sentiment d''accomplissement'],
 ARRAY['Observez vos plantes', 'Arrosez-les avec attention', 'Enlevez les feuilles mortes', 'Remerciez-les pour leur présence'],
 false),

('Contemplation du ciel', 'Prenez le temps d''observer les nuages ou les étoiles', 'nature', 10, 'easy', 'Cloud', 
 ARRAY['ciel', 'contemplation', 'calme'], 
 ARRAY['Apporte la perspective', 'Calme l''esprit', 'Inspire l''émerveillement'],
 ARRAY['Trouvez un endroit confortable dehors', 'Allongez-vous ou asseyez-vous', 'Observez le ciel sans jugement', 'Laissez vos pensées dériver comme les nuages'],
 false);

-- =====================================================
-- INSERTION DES BADGES
-- =====================================================

INSERT INTO public.activity_badges (name, description, icon, category, requirement_type, requirement_value, rarity, xp_reward) VALUES
('Premier pas', 'Complétez votre première activité', 'Footprints', 'milestone', 'total', 1, 'common', 25),
('Semaine active', 'Complétez 7 activités', 'Calendar', 'milestone', 'total', 7, 'common', 50),
('Mois d''or', 'Complétez 30 activités', 'Trophy', 'milestone', 'total', 30, 'rare', 100),
('Centurion', 'Complétez 100 activités', 'Crown', 'milestone', 'total', 100, 'epic', 250),
('Série de 3', 'Maintenez une série de 3 jours', 'Flame', 'streak', 'streak', 3, 'common', 30),
('Série de 7', 'Maintenez une série de 7 jours', 'Zap', 'streak', 'streak', 7, 'rare', 75),
('Série de 30', 'Maintenez une série de 30 jours', 'Star', 'streak', 'streak', 30, 'legendary', 500),
('Maître Zen', 'Complétez 10 activités de relaxation', 'Sparkles', 'category', 'category', 10, 'rare', 100),
('Athlète', 'Complétez 10 activités physiques', 'Dumbbell', 'category', 'category', 10, 'rare', 100),
('Artiste', 'Complétez 10 activités créatives', 'Palette', 'category', 'category', 10, 'rare', 100),
('Connecté', 'Complétez 10 activités sociales', 'Users', 'category', 'category', 10, 'rare', 100),
('Éveillé', 'Complétez 10 activités de pleine conscience', 'Brain', 'category', 'category', 10, 'rare', 100),
('Naturaliste', 'Complétez 10 activités nature', 'Leaf', 'category', 'category', 10, 'rare', 100),
('Marathonien', 'Cumulez 500 minutes d''activités', 'Timer', 'duration', 'duration', 500, 'epic', 200),
('Ultra', 'Cumulez 1000 minutes d''activités', 'Infinity', 'duration', 'duration', 1000, 'legendary', 400);

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorite_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_recommendations ENABLE ROW LEVEL SECURITY;

-- Activities: public read
CREATE POLICY "activities_public_read" ON public.activities FOR SELECT USING (true);

-- Badges: public read
CREATE POLICY "activity_badges_public_read" ON public.activity_badges FOR SELECT USING (true);

-- User tables: user owns their data
CREATE POLICY "user_favorite_activities_user_policy" ON public.user_favorite_activities
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "activity_sessions_user_policy" ON public.activity_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "activity_streaks_user_policy" ON public.activity_streaks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "activity_reminders_user_policy" ON public.activity_reminders
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "user_activity_badges_user_policy" ON public.user_activity_badges
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "activity_recommendations_user_policy" ON public.activity_recommendations
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- FONCTION: Mise à jour automatique des streaks
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_activity_streak()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last_date DATE;
  v_current_streak INTEGER;
  v_longest_streak INTEGER;
  v_total INTEGER;
  v_total_minutes INTEGER;
BEGIN
  -- Get or create streak record
  SELECT last_activity_date, current_streak, longest_streak, total_activities, total_minutes
  INTO v_last_date, v_current_streak, v_longest_streak, v_total, v_total_minutes
  FROM activity_streaks
  WHERE user_id = NEW.user_id;

  IF NOT FOUND THEN
    INSERT INTO activity_streaks (user_id, current_streak, longest_streak, last_activity_date, total_activities, total_minutes, weekly_progress)
    VALUES (NEW.user_id, 1, 1, CURRENT_DATE, 1, COALESCE(NEW.duration_seconds, 0) / 60, 1);
  ELSE
    -- Update streak logic
    IF v_last_date = CURRENT_DATE - 1 THEN
      v_current_streak := v_current_streak + 1;
    ELSIF v_last_date < CURRENT_DATE - 1 THEN
      v_current_streak := 1;
    END IF;

    IF v_current_streak > v_longest_streak THEN
      v_longest_streak := v_current_streak;
    END IF;

    UPDATE activity_streaks
    SET 
      current_streak = v_current_streak,
      longest_streak = v_longest_streak,
      last_activity_date = CURRENT_DATE,
      total_activities = v_total + 1,
      total_minutes = v_total_minutes + COALESCE(NEW.duration_seconds, 0) / 60,
      weekly_progress = weekly_progress + 1,
      updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger pour mise à jour des streaks
CREATE TRIGGER trigger_update_activity_streak
AFTER INSERT ON public.activity_sessions
FOR EACH ROW
WHEN (NEW.completed = true)
EXECUTE FUNCTION public.update_activity_streak();

-- =====================================================
-- FONCTION: Attribution automatique des badges
-- =====================================================

CREATE OR REPLACE FUNCTION public.check_activity_badges()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_badge RECORD;
  v_count INTEGER;
  v_streak INTEGER;
  v_minutes INTEGER;
BEGIN
  -- Get user stats
  SELECT current_streak, total_activities, total_minutes
  INTO v_streak, v_count, v_minutes
  FROM activity_streaks
  WHERE user_id = NEW.user_id;

  -- Check each badge
  FOR v_badge IN SELECT * FROM activity_badges LOOP
    -- Skip if already earned
    IF EXISTS (SELECT 1 FROM user_activity_badges WHERE user_id = NEW.user_id AND badge_id = v_badge.id) THEN
      CONTINUE;
    END IF;

    -- Check requirements
    IF v_badge.requirement_type = 'total' AND v_count >= v_badge.requirement_value THEN
      INSERT INTO user_activity_badges (user_id, badge_id) VALUES (NEW.user_id, v_badge.id);
    ELSIF v_badge.requirement_type = 'streak' AND v_streak >= v_badge.requirement_value THEN
      INSERT INTO user_activity_badges (user_id, badge_id) VALUES (NEW.user_id, v_badge.id);
    ELSIF v_badge.requirement_type = 'duration' AND v_minutes >= v_badge.requirement_value THEN
      INSERT INTO user_activity_badges (user_id, badge_id) VALUES (NEW.user_id, v_badge.id);
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;

-- Trigger pour vérification des badges
CREATE TRIGGER trigger_check_activity_badges
AFTER UPDATE ON public.activity_streaks
FOR EACH ROW
EXECUTE FUNCTION public.check_activity_badges();

-- =====================================================
-- INDEX
-- =====================================================

CREATE INDEX idx_activities_category ON public.activities(category);
CREATE INDEX idx_activities_difficulty ON public.activities(difficulty);
CREATE INDEX idx_activity_sessions_user ON public.activity_sessions(user_id);
CREATE INDEX idx_activity_sessions_date ON public.activity_sessions(started_at);
CREATE INDEX idx_user_favorite_activities_user ON public.user_favorite_activities(user_id);
CREATE INDEX idx_activity_recommendations_user ON public.activity_recommendations(user_id, is_active);