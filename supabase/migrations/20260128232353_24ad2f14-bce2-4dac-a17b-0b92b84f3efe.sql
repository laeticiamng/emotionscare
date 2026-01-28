
-- ═══════════════════════════════════════════════════════════════
-- CORRECTION: Attribuer le badge "Premier Pas" aux utilisateurs existants
-- ═══════════════════════════════════════════════════════════════

INSERT INTO public.user_achievements (user_id, achievement_id, unlocked_at)
SELECT 
  p.id,
  a.id,
  NOW()
FROM public.profiles p
CROSS JOIN (SELECT id FROM public.achievements WHERE name = 'Premier Pas' LIMIT 1) a
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_achievements ua 
  WHERE ua.user_id = p.id AND ua.achievement_id = a.id
)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- Créer badges supplémentaires manquants (avec rarities valides)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO public.achievements (id, name, description, category, rarity, conditions, rewards, icon, is_hidden)
VALUES 
  (gen_random_uuid(), 'Souffle de Vie', 'Complétez une session de respiration', 'breath', 'common', '{"type": "breath", "count": 1}', '{"xp": 30}', '🌬️', false),
  (gen_random_uuid(), 'Première Réflexion', 'Écrivez votre première entrée de journal', 'journal', 'common', '{"type": "journal", "count": 1}', '{"xp": 25}', '📝', false),
  (gen_random_uuid(), 'Explorateur Musical', 'Écoutez de la musique thérapeutique', 'music', 'common', '{"type": "music", "count": 1}', '{"xp": 20}', '🎵', false),
  (gen_random_uuid(), 'Conversation Profonde', 'Échangez avec le coach IA', 'coach', 'common', '{"type": "coach", "count": 1}', '{"xp": 35}', '💬', false),
  (gen_random_uuid(), 'Série de 3 Jours', 'Maintenez une série de 3 jours consécutifs', 'streak', 'common', '{"type": "streak", "days": 3}', '{"xp": 50}', '🔥', false),
  (gen_random_uuid(), 'Méditation Complète', 'Terminez une session de méditation', 'meditation', 'common', '{"type": "meditation", "count": 1}', '{"xp": 30}', '🧘', false)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- Trigger pour attribuer badges automatiquement après scan
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.auto_unlock_scan_badge()
RETURNS TRIGGER AS $$
DECLARE
  scan_badge_id UUID;
  user_scan_count INT;
BEGIN
  SELECT COUNT(*) INTO user_scan_count 
  FROM public.mood_entries 
  WHERE user_id = NEW.user_id;
  
  IF user_scan_count = 1 THEN
    SELECT id INTO scan_badge_id 
    FROM public.achievements 
    WHERE name = 'Premier Scan' LIMIT 1;
    
    IF scan_badge_id IS NOT NULL THEN
      INSERT INTO public.user_achievements (user_id, achievement_id, unlocked_at)
      VALUES (NEW.user_id, scan_badge_id, NOW())
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_auto_scan_badge ON public.mood_entries;
CREATE TRIGGER trigger_auto_scan_badge
AFTER INSERT ON public.mood_entries
FOR EACH ROW
EXECUTE FUNCTION public.auto_unlock_scan_badge();

-- Trigger pour badge respiration
CREATE OR REPLACE FUNCTION public.auto_unlock_breath_badge()
RETURNS TRIGGER AS $$
DECLARE
  breath_badge_id UUID;
  user_breath_count INT;
BEGIN
  SELECT COUNT(*) INTO user_breath_count 
  FROM public.breath_sessions 
  WHERE user_id = NEW.user_id;
  
  IF user_breath_count = 1 THEN
    SELECT id INTO breath_badge_id 
    FROM public.achievements 
    WHERE name = 'Souffle de Vie' LIMIT 1;
    
    IF breath_badge_id IS NOT NULL THEN
      INSERT INTO public.user_achievements (user_id, achievement_id, unlocked_at)
      VALUES (NEW.user_id, breath_badge_id, NOW())
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_auto_breath_badge ON public.breath_sessions;
CREATE TRIGGER trigger_auto_breath_badge
AFTER INSERT ON public.breath_sessions
FOR EACH ROW
EXECUTE FUNCTION public.auto_unlock_breath_badge();

-- Trigger pour badge journal
CREATE OR REPLACE FUNCTION public.auto_unlock_journal_badge()
RETURNS TRIGGER AS $$
DECLARE
  journal_badge_id UUID;
  user_journal_count INT;
BEGIN
  SELECT COUNT(*) INTO user_journal_count 
  FROM public.journal_entries 
  WHERE user_id = NEW.user_id;
  
  IF user_journal_count = 1 THEN
    SELECT id INTO journal_badge_id 
    FROM public.achievements 
    WHERE name = 'Première Réflexion' LIMIT 1;
    
    IF journal_badge_id IS NOT NULL THEN
      INSERT INTO public.user_achievements (user_id, achievement_id, unlocked_at)
      VALUES (NEW.user_id, journal_badge_id, NOW())
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_auto_journal_badge ON public.journal_entries;
CREATE TRIGGER trigger_auto_journal_badge
AFTER INSERT ON public.journal_entries
FOR EACH ROW
EXECUTE FUNCTION public.auto_unlock_journal_badge();

-- Trigger pour badge coach
CREATE OR REPLACE FUNCTION public.auto_unlock_coach_badge()
RETURNS TRIGGER AS $$
DECLARE
  coach_badge_id UUID;
  user_coach_count INT;
BEGIN
  SELECT COUNT(*) INTO user_coach_count 
  FROM public.coach_conversations 
  WHERE user_id = NEW.user_id;
  
  IF user_coach_count = 1 THEN
    SELECT id INTO coach_badge_id 
    FROM public.achievements 
    WHERE name = 'Conversation Profonde' LIMIT 1;
    
    IF coach_badge_id IS NOT NULL THEN
      INSERT INTO public.user_achievements (user_id, achievement_id, unlocked_at)
      VALUES (NEW.user_id, coach_badge_id, NOW())
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_auto_coach_badge ON public.coach_conversations;
CREATE TRIGGER trigger_auto_coach_badge
AFTER INSERT ON public.coach_conversations
FOR EACH ROW
EXECUTE FUNCTION public.auto_unlock_coach_badge();
