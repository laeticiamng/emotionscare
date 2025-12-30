-- ============================================================================
-- CORRECTION SECURITY ISSUES
-- ============================================================================

-- 1. Recréer la vue user_session_stats sans SECURITY DEFINER
DROP VIEW IF EXISTS public.user_session_stats;
CREATE VIEW public.user_session_stats WITH (security_invoker = true) AS
SELECT 
  user_id,
  session_type,
  COUNT(*) as total_sessions,
  SUM(duration_seconds) as total_duration,
  AVG(duration_seconds)::INTEGER as avg_duration,
  AVG(mood_delta)::INTEGER as avg_mood_impact,
  SUM(xp_earned) as total_xp,
  MAX(created_at) as last_session_at,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as sessions_last_7_days,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as sessions_last_30_days
FROM public.sessions
GROUP BY user_id, session_type;

-- 2. Recréer la fonction avec search_path sécurisé
DROP FUNCTION IF EXISTS public.sync_session_from_module() CASCADE;

CREATE OR REPLACE FUNCTION public.sync_session_from_module()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_type_val TEXT;
  duration_val INTEGER := 0;
  mood_before_val INTEGER;
  mood_after_val INTEGER;
BEGIN
  -- Mapper la table source vers le type de session
  CASE TG_TABLE_NAME
    WHEN 'meditation_sessions' THEN 
      session_type_val := 'meditation';
      duration_val := COALESCE(NEW.completed_duration, NEW.duration, 0);
      mood_before_val := NEW.mood_before;
      mood_after_val := NEW.mood_after;
    WHEN 'ai_coach_sessions' THEN 
      session_type_val := 'coach';
      duration_val := COALESCE(NEW.session_duration, 0);
    WHEN 'emotion_scans' THEN 
      session_type_val := 'emotion_scan';
      mood_after_val := NEW.mood_score;
    WHEN 'music_sessions' THEN 
      session_type_val := 'music_therapy';
      duration_val := COALESCE(NEW.duration_seconds, 0);
      mood_before_val := NEW.mood_before;
      mood_after_val := NEW.mood_after;
    WHEN 'bubble_beat_sessions' THEN 
      session_type_val := 'bubble_beat';
      duration_val := COALESCE(NEW.duration_seconds, 0);
    WHEN 'vr_nebula_sessions' THEN 
      session_type_val := 'vr_galaxy';
      duration_val := COALESCE(NEW.duration_seconds, 0);
    WHEN 'mood_mixer_sessions' THEN 
      session_type_val := 'mood_mixer';
      duration_val := COALESCE(NEW.duration_seconds, 0);
    WHEN 'nyvee_sessions' THEN 
      session_type_val := 'nyvee';
      duration_val := COALESCE(NEW.duration_seconds, 0);
    WHEN 'breathing_vr_sessions' THEN 
      session_type_val := 'breathing';
      duration_val := COALESCE(NEW.duration_seconds, 0);
    WHEN 'ar_filter_sessions' THEN 
      session_type_val := 'ar_filter';
      duration_val := COALESCE(NEW.duration_seconds, 0);
    ELSE 
      session_type_val := 'meditation';
  END CASE;

  -- Insérer dans la table sessions
  INSERT INTO public.sessions (
    user_id, session_type, source_id, started_at, ended_at,
    duration_seconds, mood_before, mood_after, metadata
  ) VALUES (
    NEW.user_id,
    session_type_val,
    NEW.id,
    COALESCE(NEW.created_at, NOW()),
    CASE WHEN NEW.completed_at IS NOT NULL THEN NEW.completed_at ELSE NULL END,
    duration_val,
    mood_before_val,
    mood_after_val,
    jsonb_build_object('source_table', TG_TABLE_NAME)
  )
  ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Recréer les triggers
DROP TRIGGER IF EXISTS sync_meditation_to_sessions ON public.meditation_sessions;
CREATE TRIGGER sync_meditation_to_sessions
  AFTER INSERT OR UPDATE ON public.meditation_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_session_from_module();

DROP TRIGGER IF EXISTS sync_coach_to_sessions ON public.ai_coach_sessions;
CREATE TRIGGER sync_coach_to_sessions
  AFTER INSERT OR UPDATE ON public.ai_coach_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_session_from_module();

DROP TRIGGER IF EXISTS sync_emotion_scan_to_sessions ON public.emotion_scans;
CREATE TRIGGER sync_emotion_scan_to_sessions
  AFTER INSERT ON public.emotion_scans
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_session_from_module();

DROP TRIGGER IF EXISTS sync_music_to_sessions ON public.music_sessions;
CREATE TRIGGER sync_music_to_sessions
  AFTER INSERT OR UPDATE ON public.music_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_session_from_module();

DROP TRIGGER IF EXISTS sync_vr_to_sessions ON public.vr_nebula_sessions;
CREATE TRIGGER sync_vr_to_sessions
  AFTER INSERT OR UPDATE ON public.vr_nebula_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_session_from_module();

DROP TRIGGER IF EXISTS sync_mood_mixer_to_sessions ON public.mood_mixer_sessions;
CREATE TRIGGER sync_mood_mixer_to_sessions
  AFTER INSERT OR UPDATE ON public.mood_mixer_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_session_from_module();

DROP TRIGGER IF EXISTS sync_nyvee_to_sessions ON public.nyvee_sessions;
CREATE TRIGGER sync_nyvee_to_sessions
  AFTER INSERT OR UPDATE ON public.nyvee_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_session_from_module();

DROP TRIGGER IF EXISTS sync_bubble_beat_to_sessions ON public.bubble_beat_sessions;
CREATE TRIGGER sync_bubble_beat_to_sessions
  AFTER INSERT OR UPDATE ON public.bubble_beat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_session_from_module();

DROP TRIGGER IF EXISTS sync_ar_to_sessions ON public.ar_filter_sessions;
CREATE TRIGGER sync_ar_to_sessions
  AFTER INSERT OR UPDATE ON public.ar_filter_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_session_from_module();

DROP TRIGGER IF EXISTS sync_breathing_to_sessions ON public.breathing_vr_sessions;
CREATE TRIGGER sync_breathing_to_sessions
  AFTER INSERT OR UPDATE ON public.breathing_vr_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_session_from_module();