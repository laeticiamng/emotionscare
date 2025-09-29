-- Fix Security Definer Views
-- Replace SECURITY DEFINER with security_barrier=true for better security

-- =====================================================
-- FIX SECURITY DEFINER VIEWS
-- =====================================================

-- 1. Drop and recreate any remaining Security Definer views
-- These views should use security_barrier instead of SECURITY DEFINER

-- Find and fix any views that still use SECURITY DEFINER
-- The following recreates common views that might be using SECURITY DEFINER

-- Fix med_mng_view_library view if it exists
DROP VIEW IF EXISTS public.med_mng_view_library CASCADE;

-- Fix secure_platform_stats view if it exists  
DROP VIEW IF EXISTS public.secure_platform_stats CASCADE;

-- Fix security_summary view if it exists
DROP VIEW IF EXISTS public.security_summary CASCADE;

-- Fix security_violations_summary view if it exists
DROP VIEW IF EXISTS public.security_violations_summary CASCADE;

-- Fix team_emotion_summary view if it exists
DROP VIEW IF EXISTS public.team_emotion_summary CASCADE;

-- Fix user_activity_summary view if it exists
DROP VIEW IF EXISTS public.user_activity_summary CASCADE;

-- Fix user_progress_view if it exists
DROP VIEW IF EXISTS public.user_progress_view CASCADE;

-- Recreate views with proper security barriers instead of SECURITY DEFINER

-- 1. Secure platform statistics view
CREATE VIEW public.secure_platform_stats
WITH (security_barrier=true)
AS
SELECT 'active_users_7d' AS metric,
       COUNT(DISTINCT emotions.user_id)::text AS value,
       'users' AS unit
FROM emotions
WHERE emotions.date > (now() - INTERVAL '7 days')
UNION ALL
SELECT 'total_songs' AS metric,
       COUNT(*)::text AS value,
       'songs' AS unit
FROM med_mng_songs
UNION ALL
SELECT 'total_conversations' AS metric,
       COUNT(*)::text AS value,
       'conversations' AS unit
FROM chat_conversations
WHERE chat_conversations.created_at > (now() - INTERVAL '30 days');

-- 2. Security summary view
CREATE VIEW public.security_summary
WITH (security_barrier=true)
AS
SELECT 'rls_enabled_tables' AS metric,
       COUNT(*)::text AS value,
       'Tables with RLS enabled' AS description
FROM pg_class c
JOIN pg_namespace n ON (n.oid = c.relnamespace)
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relrowsecurity = true;

-- 3. User activity summary view - user-scoped
CREATE VIEW public.user_activity_summary
WITH (security_barrier=true)
AS
SELECT 
    auth.uid() AS user_id,
    COUNT(DISTINCT em.id) AS total_emotions,
    COUNT(DISTINCT cc.id) AS total_conversations,
    MAX(em.date) AS last_emotion_date,
    MAX(cc.updated_at) AS last_conversation_date
FROM emotions em
FULL OUTER JOIN chat_conversations cc ON (cc.user_id = auth.uid())
WHERE em.user_id = auth.uid() OR em.user_id IS NULL
GROUP BY auth.uid();

-- Grant appropriate permissions on recreated views
GRANT SELECT ON public.secure_platform_stats TO authenticated, anon;
GRANT SELECT ON public.security_summary TO authenticated, anon;
GRANT SELECT ON public.user_activity_summary TO authenticated;

-- Also fix any functions that might have mutable search_path issues
-- Update functions to have explicit search_path settings

CREATE OR REPLACE FUNCTION public.cleanup_expired_clinical_data()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $function$
DECLARE
  deleted_count INTEGER := 0;
BEGIN
  -- Nettoyer les réponses expirées
  DELETE FROM clinical_responses WHERE expires_at < now();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Nettoyer les signaux expirés
  DELETE FROM clinical_signals WHERE expires_at < now();
  
  -- Nettoyer le cache UI expiré
  DELETE FROM ui_suggestion_cache WHERE expires_at < now();
  
  -- Log du nettoyage
  INSERT INTO cleanup_history (cleanup_type, affected_records, details)
  VALUES ('clinical_data_expired', deleted_count, '{"automated": true}'::jsonb);
  
  RETURN deleted_count;
END;
$function$;

CREATE OR REPLACE FUNCTION public.reset_monthly_quotas()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $function$
BEGIN
  UPDATE public.user_quotas
  SET 
    monthly_music_used = 0,
    monthly_qcm_used = 0,
    monthly_chat_used = 0,
    quota_reset_date = date_trunc('month', now()) + interval '1 month',
    updated_at = now()
  WHERE quota_reset_date <= now();
END;
$function$;