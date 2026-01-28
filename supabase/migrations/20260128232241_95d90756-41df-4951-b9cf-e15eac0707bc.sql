
-- ═══════════════════════════════════════════════════════════════
-- CORRECTION 1: Trigger pour débloquer "Premier Pas" automatiquement
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.auto_unlock_first_achievement()
RETURNS TRIGGER AS $$
DECLARE
  first_badge_id UUID;
BEGIN
  SELECT id INTO first_badge_id FROM public.achievements 
  WHERE name = 'Premier Pas' LIMIT 1;
  
  IF first_badge_id IS NOT NULL THEN
    INSERT INTO public.user_achievements (user_id, achievement_id, unlocked_at)
    VALUES (NEW.id, first_badge_id, NOW())
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_auto_first_badge ON public.profiles;
CREATE TRIGGER trigger_auto_first_badge
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.auto_unlock_first_achievement();

-- ═══════════════════════════════════════════════════════════════
-- CORRECTION 2: Goals par défaut à l'inscription (schema correct)
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.create_default_goals_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Goal 1: Premier scan émotionnel
  INSERT INTO public.user_goals (user_id, title, description, category, target_value, current_progress, status, start_date, end_date, created_at)
  VALUES (
    NEW.id,
    'Premier scan émotionnel',
    'Réalisez votre premier scan pour découvrir vos émotions',
    'onboarding',
    1,
    0,
    'active',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days',
    NOW()
  ) ON CONFLICT DO NOTHING;
  
  -- Goal 2: Session de respiration
  INSERT INTO public.user_goals (user_id, title, description, category, target_value, current_progress, status, start_date, end_date, created_at)
  VALUES (
    NEW.id,
    'Première respiration guidée',
    'Complétez une session de respiration cohérente',
    'wellness',
    1,
    0,
    'active',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days',
    NOW()
  ) ON CONFLICT DO NOTHING;
  
  -- Goal 3: Entrée journal
  INSERT INTO public.user_goals (user_id, title, description, category, target_value, current_progress, status, start_date, end_date, created_at)
  VALUES (
    NEW.id,
    'Première entrée journal',
    'Écrivez dans votre journal émotionnel',
    'reflection',
    1,
    0,
    'active',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days',
    NOW()
  ) ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_create_default_goals ON public.profiles;
CREATE TRIGGER trigger_create_default_goals
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.create_default_goals_on_signup();

-- ═══════════════════════════════════════════════════════════════
-- CORRECTION 3: Trigger pour compléter goal après scan
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.complete_scan_goal_on_mood_entry()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_goals
  SET 
    current_progress = current_progress + 1,
    status = CASE WHEN current_progress + 1 >= target_value THEN 'completed' ELSE status END,
    completed = CASE WHEN current_progress + 1 >= target_value THEN true ELSE completed END,
    updated_at = NOW()
  WHERE user_id = NEW.user_id 
    AND title = 'Premier scan émotionnel'
    AND status = 'active';
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_complete_scan_goal ON public.mood_entries;
CREATE TRIGGER trigger_complete_scan_goal
AFTER INSERT ON public.mood_entries
FOR EACH ROW
EXECUTE FUNCTION public.complete_scan_goal_on_mood_entry();

-- ═══════════════════════════════════════════════════════════════
-- CORRECTION 4: Trigger pour compléter goal après respiration
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.complete_breath_goal_on_session()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_goals
  SET 
    current_progress = current_progress + 1,
    status = CASE WHEN current_progress + 1 >= target_value THEN 'completed' ELSE status END,
    completed = CASE WHEN current_progress + 1 >= target_value THEN true ELSE completed END,
    updated_at = NOW()
  WHERE user_id = NEW.user_id 
    AND title = 'Première respiration guidée'
    AND status = 'active';
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_complete_breath_goal ON public.breath_sessions;
CREATE TRIGGER trigger_complete_breath_goal
AFTER INSERT ON public.breath_sessions
FOR EACH ROW
EXECUTE FUNCTION public.complete_breath_goal_on_session();

-- ═══════════════════════════════════════════════════════════════
-- CORRECTION 5: Trigger pour compléter goal après journal
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.complete_journal_goal_on_entry()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_goals
  SET 
    current_progress = current_progress + 1,
    status = CASE WHEN current_progress + 1 >= target_value THEN 'completed' ELSE status END,
    completed = CASE WHEN current_progress + 1 >= target_value THEN true ELSE completed END,
    updated_at = NOW()
  WHERE user_id = NEW.user_id 
    AND title = 'Première entrée journal'
    AND status = 'active';
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_complete_journal_goal ON public.journal_entries;
CREATE TRIGGER trigger_complete_journal_goal
AFTER INSERT ON public.journal_entries
FOR EACH ROW
EXECUTE FUNCTION public.complete_journal_goal_on_entry();

-- ═══════════════════════════════════════════════════════════════
-- CORRECTION 6: Créer goals pour utilisateurs existants
-- ═══════════════════════════════════════════════════════════════

INSERT INTO public.user_goals (user_id, title, description, category, target_value, current_progress, status, start_date, end_date, created_at)
SELECT 
  p.id,
  'Premier scan émotionnel',
  'Réalisez votre premier scan pour découvrir vos émotions',
  'onboarding',
  1,
  0,
  'active',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days',
  NOW()
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_goals ug 
  WHERE ug.user_id = p.id AND ug.title = 'Premier scan émotionnel'
)
ON CONFLICT DO NOTHING;

INSERT INTO public.user_goals (user_id, title, description, category, target_value, current_progress, status, start_date, end_date, created_at)
SELECT 
  p.id,
  'Première respiration guidée',
  'Complétez une session de respiration cohérente',
  'wellness',
  1,
  0,
  'active',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days',
  NOW()
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_goals ug 
  WHERE ug.user_id = p.id AND ug.title = 'Première respiration guidée'
)
ON CONFLICT DO NOTHING;

INSERT INTO public.user_goals (user_id, title, description, category, target_value, current_progress, status, start_date, end_date, created_at)
SELECT 
  p.id,
  'Première entrée journal',
  'Écrivez dans votre journal émotionnel',
  'reflection',
  1,
  0,
  'active',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days',
  NOW()
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_goals ug 
  WHERE ug.user_id = p.id AND ug.title = 'Première entrée journal'
)
ON CONFLICT DO NOTHING;
