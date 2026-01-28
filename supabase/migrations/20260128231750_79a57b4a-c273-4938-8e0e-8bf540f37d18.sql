
-- ═══════════════════════════════════════════════════════════════
-- AMÉLIORATION 1: Auto-création de user_stats à l'inscription
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.create_user_stats_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (user_id, level, total_points, streak_days, completed_challenges, total_badges, rank, created_at)
  VALUES (NEW.id, 1, 50, 0, 0, 0, 'bronze', NOW())
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_create_user_stats ON public.profiles;
CREATE TRIGGER trigger_create_user_stats
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.create_user_stats_on_signup();

-- ═══════════════════════════════════════════════════════════════
-- AMÉLIORATION 2: Créer user_stats pour utilisateurs existants
-- ═══════════════════════════════════════════════════════════════

INSERT INTO public.user_stats (user_id, level, total_points, streak_days, completed_challenges, total_badges, rank, created_at)
SELECT p.id, 1, 50, 0, 0, 0, 'bronze', NOW()
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_stats us WHERE us.user_id = p.id
)
ON CONFLICT (user_id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- AMÉLIORATION 3: Trigger pour XP sur mood_entries
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.award_xp_on_mood_entry()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_stats
  SET 
    total_points = total_points + 10,
    updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_xp_on_mood ON public.mood_entries;
CREATE TRIGGER trigger_xp_on_mood
AFTER INSERT ON public.mood_entries
FOR EACH ROW
EXECUTE FUNCTION public.award_xp_on_mood_entry();

-- ═══════════════════════════════════════════════════════════════
-- AMÉLIORATION 4: Trigger pour XP sur journal_entries
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.award_xp_on_journal_entry()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_stats
  SET 
    total_points = total_points + 15,
    updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_xp_on_journal ON public.journal_entries;
CREATE TRIGGER trigger_xp_on_journal
AFTER INSERT ON public.journal_entries
FOR EACH ROW
EXECUTE FUNCTION public.award_xp_on_journal_entry();

-- ═══════════════════════════════════════════════════════════════
-- AMÉLIORATION 5: Trigger pour XP sur breath_sessions
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.award_xp_on_breath_session()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_stats
  SET 
    total_points = total_points + 20,
    updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_xp_on_breath ON public.breath_sessions;
CREATE TRIGGER trigger_xp_on_breath
AFTER INSERT ON public.breath_sessions
FOR EACH ROW
EXECUTE FUNCTION public.award_xp_on_breath_session();

-- ═══════════════════════════════════════════════════════════════
-- AMÉLIORATION 6: Trigger pour XP sur coach_conversations
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.award_xp_on_coach_session()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_stats
  SET 
    total_points = total_points + 25,
    updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_xp_on_coach ON public.coach_conversations;
CREATE TRIGGER trigger_xp_on_coach
AFTER INSERT ON public.coach_conversations
FOR EACH ROW
EXECUTE FUNCTION public.award_xp_on_coach_session();

-- ═══════════════════════════════════════════════════════════════
-- AMÉLIORATION 7: Mettre à jour streak_days automatiquement
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.update_streak_on_activity()
RETURNS TRIGGER AS $$
DECLARE
  last_activity DATE;
  current_streak INT;
BEGIN
  -- Récupérer le dernier streak
  SELECT streak_days INTO current_streak
  FROM public.user_stats
  WHERE user_id = NEW.user_id;

  -- Incrémenter le streak
  UPDATE public.user_stats
  SET 
    streak_days = COALESCE(current_streak, 0) + 1,
    updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
