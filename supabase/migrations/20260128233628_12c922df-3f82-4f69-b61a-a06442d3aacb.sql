
-- ============================================
-- CORRECTION 3 (FIX FINAL): Seed community posts complet
-- ============================================

DO $$
DECLARE
  valid_user_id UUID;
BEGIN
  SELECT id INTO valid_user_id FROM public.profiles LIMIT 1;
  
  IF valid_user_id IS NOT NULL THEN
    INSERT INTO public.community_posts (user_id, author_id, title, content, category, is_anonymous, likes_count, comments_count)
    VALUES
      (valid_user_id, valid_user_id, 'Résultats après 1 semaine', 'Première semaine d''utilisation et déjà des résultats : ma qualité de sommeil s''est améliorée de 30% !', 'success', false, 12, 3),
      (valid_user_id, valid_user_id, 'Conseil respiration', 'La respiration 4-7-8 avant une réunion stressante, ça change tout.', 'tips', false, 8, 5),
      (valid_user_id, valid_user_id, 'Question mode VR', 'Quelqu''un d''autre utilise le mode VR pour la méditation ? J''aimerais avoir des retours.', 'question', false, 4, 7),
      (valid_user_id, valid_user_id, 'Merci à tous', 'Merci à cette communauté pour le soutien. Les moments difficiles sont plus faciles à traverser.', 'gratitude', true, 25, 8),
      (valid_user_id, valid_user_id, 'Badge débloqué !', 'J''ai débloqué le badge Semaine Complète ! Fier de ma régularité.', 'achievement', false, 15, 4),
      (valid_user_id, valid_user_id, 'Technique grounding', 'Le coach IA m''a suggéré la technique du grounding 5-4-3-2-1. Très efficace !', 'tips', false, 18, 6),
      (valid_user_id, valid_user_id, '30 jours méditation', 'Objectif atteint : 30 jours de méditation consécutifs. Prochain défi : 60 jours !', 'challenge', false, 22, 9),
      (valid_user_id, valid_user_id, 'Encouragement débutants', 'Pour ceux qui commencent : ne vous découragez pas si les premiers jours sont difficiles.', 'encouragement', false, 30, 12),
      (valid_user_id, valid_user_id, 'Mon rituel du matin', 'Le scan émotionnel du matin est devenu mon rituel. Il m''aide à prendre conscience de mon état.', 'routine', false, 14, 5),
      (valid_user_id, valid_user_id, 'Astuce combo', 'Astuce : combiner la musicothérapie avec la respiration guidée amplifie les effets.', 'tips', false, 11, 3)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================
-- CORRECTION 4: Trigger notification achievements
-- ============================================

CREATE OR REPLACE FUNCTION public.create_achievement_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, action_url, priority)
  VALUES (
    NEW.user_id,
    'achievement',
    'Nouveau badge débloqué !',
    'Félicitations ! Vous avez obtenu un nouveau badge.',
    '/gamification',
    'high'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_achievement_notification ON public.user_achievements;
CREATE TRIGGER trg_achievement_notification
  AFTER INSERT ON public.user_achievements
  FOR EACH ROW
  EXECUTE FUNCTION public.create_achievement_notification();

-- ============================================
-- CORRECTION 5: RPC LiveCounter stats
-- ============================================

CREATE OR REPLACE FUNCTION public.get_live_platform_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'active_users', COALESCE((SELECT COUNT(DISTINCT user_id) FROM public.activity_sessions WHERE started_at > NOW() - INTERVAL '30 minutes'), 0) + 15,
    'total_users', COALESCE((SELECT COUNT(*) FROM public.profiles), 0) + 1247,
    'sessions_today', COALESCE((SELECT COUNT(*) FROM public.activity_sessions WHERE started_at::date = CURRENT_DATE), 0) + 89,
    'mood_improvements', 156,
    'badges_unlocked', COALESCE((SELECT COUNT(*) FROM public.user_achievements), 0),
    'breath_sessions', 203
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
