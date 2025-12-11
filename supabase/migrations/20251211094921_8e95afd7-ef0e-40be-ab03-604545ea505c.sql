-- Fix search_path for all functions to prevent potential security issues

-- 1. update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 2. handle_new_user (if exists)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, now(), now())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. update_music_achievement_progress
CREATE OR REPLACE FUNCTION public.update_music_achievement_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update achievement progress based on new listening session
  UPDATE public.user_music_achievements
  SET progress = progress + 1,
      updated_at = now()
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 4. calculate_streak_bonus
CREATE OR REPLACE FUNCTION public.calculate_streak_bonus(streak_days INTEGER)
RETURNS INTEGER AS $$
BEGIN
  IF streak_days >= 30 THEN
    RETURN 50;
  ELSIF streak_days >= 14 THEN
    RETURN 25;
  ELSIF streak_days >= 7 THEN
    RETURN 10;
  ELSIF streak_days >= 3 THEN
    RETURN 5;
  ELSE
    RETURN 0;
  END IF;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 5. update_user_level
CREATE OR REPLACE FUNCTION public.update_user_level()
RETURNS TRIGGER AS $$
DECLARE
  new_level INTEGER;
BEGIN
  -- Calculate level based on XP (100 XP per level)
  new_level := FLOOR(NEW.experience_points / 100) + 1;
  IF new_level <> OLD.level THEN
    NEW.level := new_level;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 6. increment_view_count
CREATE OR REPLACE FUNCTION public.increment_view_count(content_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.content_items
  SET view_count = view_count + 1
  WHERE id = content_id;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 7. get_user_statistics
CREATE OR REPLACE FUNCTION public.get_user_statistics(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_sessions', COUNT(*),
    'total_duration', COALESCE(SUM(duration_seconds), 0)
  ) INTO result
  FROM public.breath_sessions
  WHERE user_id = user_uuid;
  RETURN result;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 8. cleanup_old_notifications
CREATE OR REPLACE FUNCTION public.cleanup_old_notifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.notifications
  WHERE created_at < now() - INTERVAL '90 days'
  AND read = true;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 9. validate_emotion_transaction
CREATE OR REPLACE FUNCTION public.validate_emotion_transaction()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.amount <= 0 THEN
    RAISE EXCEPTION 'Transaction amount must be positive';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 10. update_leaderboard_rank
CREATE OR REPLACE FUNCTION public.update_leaderboard_rank()
RETURNS TRIGGER AS $$
BEGIN
  -- Recalculate ranks after score update
  WITH ranked AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY score DESC) as new_rank
    FROM public.exchange_leaderboards
    WHERE period_type = NEW.period_type
  )
  UPDATE public.exchange_leaderboards el
  SET rank = r.new_rank
  FROM ranked r
  WHERE el.id = r.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 11. sync_profile_email
CREATE OR REPLACE FUNCTION public.sync_profile_email()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET email = NEW.email, updated_at = now()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 12. calculate_trust_score
CREATE OR REPLACE FUNCTION public.calculate_trust_score(profile_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
  score NUMERIC;
BEGIN
  SELECT COALESCE(
    (completed_projects * 10 + positive_reviews * 5 - negative_reviews * 10),
    0
  ) INTO score
  FROM public.trust_profiles
  WHERE id = profile_uuid;
  RETURN COALESCE(score, 0);
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 13. log_admin_action
CREATE OR REPLACE FUNCTION public.log_admin_action()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admin_changelog (
    table_name, record_id, action_type, old_value, new_value, admin_user_id
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id)::TEXT,
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_json(NEW) ELSE NULL END,
    auth.uid()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 14. get_weekly_summary
CREATE OR REPLACE FUNCTION public.get_weekly_summary(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'mood_entries', (SELECT COUNT(*) FROM public.moods WHERE user_id = user_uuid AND created_at > now() - INTERVAL '7 days'),
    'journal_entries', (SELECT COUNT(*) FROM public.journal_entries WHERE user_id = user_uuid AND created_at > now() - INTERVAL '7 days'),
    'breath_sessions', (SELECT COUNT(*) FROM public.breath_sessions WHERE user_id = user_uuid AND created_at > now() - INTERVAL '7 days')
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 15. update_gamification_points
CREATE OR REPLACE FUNCTION public.update_gamification_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.gamification_profiles
  SET total_points = total_points + NEW.points_earned,
      updated_at = now()
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;