-- ============================================
-- SYSTÈME D'ÉNERGIE ÉMOTIONNELLE EmotionsCare
-- ============================================

-- Enable extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Table: Énergie émotionnelle des utilisateurs
CREATE TABLE IF NOT EXISTS public.user_emotional_energy (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_energy INTEGER NOT NULL DEFAULT 5 CHECK (current_energy >= 0 AND current_energy <= 10),
  max_energy INTEGER NOT NULL DEFAULT 10,
  last_refill_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total_energy_gained INTEGER NOT NULL DEFAULT 0,
  total_energy_spent INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Table: Streak de bien-être
CREATE TABLE IF NOT EXISTS public.user_wellness_streak (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_checkins INTEGER NOT NULL DEFAULT 0,
  streak_frozen_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Table: Points Harmonie (monnaie interne)
CREATE TABLE IF NOT EXISTS public.user_harmony_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points INTEGER NOT NULL DEFAULT 0,
  lifetime_earned INTEGER NOT NULL DEFAULT 0,
  lifetime_spent INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Table: Quêtes bien-être
CREATE TABLE IF NOT EXISTS public.wellness_quests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  quest_type TEXT NOT NULL CHECK (quest_type IN ('daily', 'weekly', 'monthly', 'special')),
  category TEXT NOT NULL CHECK (category IN ('emotion_tracking', 'breathing', 'music', 'journal', 'social', 'meditation')),
  target_value INTEGER NOT NULL DEFAULT 1,
  energy_reward INTEGER NOT NULL DEFAULT 1,
  harmony_points_reward INTEGER NOT NULL DEFAULT 10,
  special_reward JSONB,
  active BOOLEAN NOT NULL DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table: Progression des quêtes utilisateur
CREATE TABLE IF NOT EXISTS public.user_quest_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES public.wellness_quests(id) ON DELETE CASCADE,
  current_progress INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  claimed BOOLEAN NOT NULL DEFAULT false,
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, quest_id)
);

-- Table: Boosts émotionnels
CREATE TABLE IF NOT EXISTS public.emotional_boosts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  boost_type TEXT NOT NULL CHECK (boost_type IN ('breathing', 'music', 'reassurance', 'meditation', 'movement')),
  duration_minutes INTEGER NOT NULL DEFAULT 2,
  energy_restore INTEGER NOT NULL DEFAULT 1,
  icon TEXT,
  content JSONB,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table: Coffres bien-être débloqués
CREATE TABLE IF NOT EXISTS public.user_wellness_chests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chest_type TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  rewards JSONB NOT NULL,
  opened BOOLEAN NOT NULL DEFAULT false,
  opened_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table: Historique des transactions d'énergie et points
CREATE TABLE IF NOT EXISTS public.energy_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('energy_gain', 'energy_spend', 'harmony_gain', 'harmony_spend')),
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE public.user_emotional_energy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_wellness_streak ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_harmony_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotional_boosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_wellness_chests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_transactions ENABLE ROW LEVEL SECURITY;

-- Policies: user_emotional_energy
CREATE POLICY "Users can view their own energy" ON public.user_emotional_energy FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own energy" ON public.user_emotional_energy FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own energy" ON public.user_emotional_energy FOR UPDATE USING (auth.uid() = user_id);

-- Policies: user_wellness_streak
CREATE POLICY "Users can view their own streak" ON public.user_wellness_streak FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own streak" ON public.user_wellness_streak FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own streak" ON public.user_wellness_streak FOR UPDATE USING (auth.uid() = user_id);

-- Policies: user_harmony_points
CREATE POLICY "Users can view their own points" ON public.user_harmony_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own points" ON public.user_harmony_points FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own points" ON public.user_harmony_points FOR UPDATE USING (auth.uid() = user_id);

-- Policies: wellness_quests (public read, admin write)
CREATE POLICY "Anyone can view active quests" ON public.wellness_quests FOR SELECT USING (active = true);

-- Policies: user_quest_progress
CREATE POLICY "Users can view their own quest progress" ON public.user_quest_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own quest progress" ON public.user_quest_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own quest progress" ON public.user_quest_progress FOR UPDATE USING (auth.uid() = user_id);

-- Policies: emotional_boosts (public read)
CREATE POLICY "Anyone can view active boosts" ON public.emotional_boosts FOR SELECT USING (active = true);

-- Policies: user_wellness_chests
CREATE POLICY "Users can view their own chests" ON public.user_wellness_chests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own chests" ON public.user_wellness_chests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own chests" ON public.user_wellness_chests FOR UPDATE USING (auth.uid() = user_id);

-- Policies: energy_transactions
CREATE POLICY "Users can view their own transactions" ON public.energy_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own transactions" ON public.energy_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER update_user_emotional_energy_updated_at BEFORE UPDATE ON public.user_emotional_energy FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_wellness_streak_updated_at BEFORE UPDATE ON public.user_wellness_streak FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_harmony_points_updated_at BEFORE UPDATE ON public.user_harmony_points FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_quest_progress_updated_at BEFORE UPDATE ON public.user_quest_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_user_emotional_energy_user_id ON public.user_emotional_energy(user_id);
CREATE INDEX idx_user_wellness_streak_user_id ON public.user_wellness_streak(user_id);
CREATE INDEX idx_user_harmony_points_user_id ON public.user_harmony_points(user_id);
CREATE INDEX idx_user_quest_progress_user_id ON public.user_quest_progress(user_id);
CREATE INDEX idx_user_quest_progress_quest_id ON public.user_quest_progress(quest_id);
CREATE INDEX idx_user_wellness_chests_user_id ON public.user_wellness_chests(user_id);
CREATE INDEX idx_energy_transactions_user_id ON public.energy_transactions(user_id);
CREATE INDEX idx_wellness_quests_active ON public.wellness_quests(active) WHERE active = true;

-- ============================================
-- FONCTIONS MÉTIER
-- ============================================

-- Fonction: Recharge automatique d'énergie (1 point toutes les 4h)
CREATE OR REPLACE FUNCTION public.refill_emotional_energy()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.user_emotional_energy
  SET 
    current_energy = LEAST(max_energy, current_energy + FLOOR(EXTRACT(EPOCH FROM (now() - last_refill_time)) / 14400)::INTEGER),
    last_refill_time = CASE 
      WHEN current_energy < max_energy THEN now() - ((EXTRACT(EPOCH FROM (now() - last_refill_time))::INTEGER % 14400) * INTERVAL '1 second')
      ELSE last_refill_time
    END,
    updated_at = now()
  WHERE current_energy < max_energy
    AND EXTRACT(EPOCH FROM (now() - last_refill_time)) >= 14400;
END;
$$;

-- Fonction: Vérifier et mettre à jour le streak
CREATE OR REPLACE FUNCTION public.check_wellness_streak(p_user_id UUID)
RETURNS TABLE(current_streak INTEGER, streak_broken BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last_checkin DATE;
  v_current_streak INTEGER;
  v_longest_streak INTEGER;
  v_frozen_until TIMESTAMP WITH TIME ZONE;
  v_streak_broken BOOLEAN := false;
BEGIN
  SELECT last_checkin_date, user_wellness_streak.current_streak, longest_streak, streak_frozen_until
  INTO v_last_checkin, v_current_streak, v_longest_streak, v_frozen_until
  FROM public.user_wellness_streak
  WHERE user_id = p_user_id;
  
  -- Si pas de record, créer
  IF NOT FOUND THEN
    INSERT INTO public.user_wellness_streak (user_id, current_streak, longest_streak, last_checkin_date, total_checkins)
    VALUES (p_user_id, 1, 1, CURRENT_DATE, 1);
    RETURN QUERY SELECT 1, false;
    RETURN;
  END IF;
  
  -- Si frozen (streak saver actif), ignorer la vérification
  IF v_frozen_until IS NOT NULL AND v_frozen_until > now() THEN
    -- Juste update la date sans casser le streak
    UPDATE public.user_wellness_streak
    SET last_checkin_date = CURRENT_DATE, total_checkins = total_checkins + 1
    WHERE user_id = p_user_id;
    RETURN QUERY SELECT v_current_streak, false;
    RETURN;
  END IF;
  
  -- Vérifier si le streak est cassé
  IF CURRENT_DATE - v_last_checkin > 1 THEN
    v_streak_broken := true;
    v_current_streak := 1;
  ELSIF CURRENT_DATE - v_last_checkin = 1 THEN
    v_current_streak := v_current_streak + 1;
  ELSIF CURRENT_DATE = v_last_checkin THEN
    -- Même jour, pas de changement
    RETURN QUERY SELECT v_current_streak, false;
    RETURN;
  END IF;
  
  -- Update
  UPDATE public.user_wellness_streak
  SET 
    current_streak = v_current_streak,
    longest_streak = GREATEST(longest_streak, v_current_streak),
    last_checkin_date = CURRENT_DATE,
    total_checkins = total_checkins + 1,
    streak_frozen_until = NULL
  WHERE user_id = p_user_id;
  
  RETURN QUERY SELECT v_current_streak, v_streak_broken;
END;
$$;

-- ============================================
-- DONNÉES INITIALES: Quêtes bien-être
-- ============================================

INSERT INTO public.wellness_quests (title, description, quest_type, category, target_value, energy_reward, harmony_points_reward) VALUES
('Check-in quotidien', 'Fais un suivi émotionnel aujourd''hui', 'daily', 'emotion_tracking', 1, 1, 10),
('Série hebdomadaire', 'Maintiens ta série 7 jours d''affilée', 'weekly', 'emotion_tracking', 7, 3, 50),
('Respiration consciente', 'Complète 3 exercices de respiration cette semaine', 'weekly', 'breathing', 3, 2, 30),
('Journal thérapeutique', 'Écris 2 entrées de journal cette semaine', 'weekly', 'journal', 2, 2, 25),
('Exploration musicale', 'Écoute 5 morceaux différents', 'weekly', 'music', 5, 2, 30);

-- ============================================
-- DONNÉES INITIALES: Boosts émotionnels
-- ============================================

INSERT INTO public.emotional_boosts (name, description, boost_type, duration_minutes, energy_restore, icon) VALUES
('Respiration 4-7-8', 'Technique apaisante pour retrouver le calme', 'breathing', 2, 1, '🫁'),
('Musique relaxante', 'Écoute guidée pour apaiser l''esprit', 'music', 3, 1, '🎵'),
('Affirmation positive', 'Moment de réassurance et bienveillance', 'reassurance', 1, 1, '💜'),
('Méditation flash', 'Mini-méditation de pleine conscience', 'meditation', 2, 1, '🧘'),
('Étirement doux', 'Mouvement corporel pour libérer les tensions', 'movement', 2, 1, '🤸');

-- ============================================
-- CRON JOB: Recharge automatique toutes les heures
-- ============================================

SELECT cron.schedule(
  'refill-emotional-energy',
  '0 * * * *', -- Toutes les heures
  $$
  SELECT public.refill_emotional_energy();
  $$
);