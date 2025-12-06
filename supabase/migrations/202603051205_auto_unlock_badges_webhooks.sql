-- Configure webhooks to trigger the auto-unlock-badges edge function
-- on updates to gamification related tables.

-- Ensure pg_net extension is available for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Generic trigger function that posts the database change payload to the
-- auto-unlock-badges edge function. The function is SECURITY DEFINER so it can
-- use the service role when executed by authenticated users.
CREATE OR REPLACE FUNCTION public.invoke_auto_unlock_badges()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_url text := COALESCE(
    current_setting('app.settings.auto_unlock_badges_url', true),
    'https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/auto-unlock-badges'
  );
  service_role_key text := current_setting('app.settings.service_role_key', true);
  headers jsonb := jsonb_build_object('Content-Type', 'application/json');
  payload jsonb;
BEGIN
  payload := jsonb_build_object(
    'type', TG_OP,
    'table', TG_TABLE_NAME,
    'record', CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE to_jsonb(NEW) END,
    'old_record', CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END
  );

  IF service_role_key IS NOT NULL AND service_role_key <> '' THEN
    headers := headers || jsonb_build_object(
      'Authorization', 'Bearer ' || service_role_key,
      'apikey', service_role_key
    );
  END IF;

  BEGIN
    PERFORM net.http_post(
      url := request_url,
      headers := headers,
      body := payload
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'auto-unlock-badges webhook call failed: %', SQLERRM;
  END;

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger for user_challenges: fire after insert and update so progress changes
-- are propagated to the edge function.
DROP TRIGGER IF EXISTS trg_auto_unlock_user_challenges ON public.user_challenges;
CREATE TRIGGER trg_auto_unlock_user_challenges
AFTER INSERT OR UPDATE ON public.user_challenges
FOR EACH ROW
EXECUTE FUNCTION public.invoke_auto_unlock_badges();

-- Trigger for meditation_sessions: fire after insert to process new sessions.
DROP TRIGGER IF EXISTS trg_auto_unlock_meditation_sessions ON public.meditation_sessions;
CREATE TRIGGER trg_auto_unlock_meditation_sessions
AFTER INSERT ON public.meditation_sessions
FOR EACH ROW
EXECUTE FUNCTION public.invoke_auto_unlock_badges();

-- Trigger for emotion_scans: fire after insert to process new scans.
DROP TRIGGER IF EXISTS trg_auto_unlock_emotion_scans ON public.emotion_scans;
CREATE TRIGGER trg_auto_unlock_emotion_scans
AFTER INSERT ON public.emotion_scans
FOR EACH ROW
EXECUTE FUNCTION public.invoke_auto_unlock_badges();
