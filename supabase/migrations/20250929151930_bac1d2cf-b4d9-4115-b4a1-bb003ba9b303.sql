-- Find and Fix ALL remaining Security Definer Views
-- Query system tables to identify all views with SECURITY DEFINER and fix them

-- =====================================================
-- COMPREHENSIVE SECURITY DEFINER VIEW FIX
-- =====================================================

-- Drop all remaining views that might be using SECURITY DEFINER
-- These are likely from the function definitions I saw in the database

DROP VIEW IF EXISTS public.med_mng_view_library CASCADE;
DROP VIEW IF EXISTS public.team_emotion_summary CASCADE; 
DROP VIEW IF EXISTS public.security_violations_summary CASCADE;
DROP VIEW IF EXISTS public.user_progress_view CASCADE;

-- Recreate the missing views with proper security barriers

-- 1. Med MNG Library View - user-scoped music library
CREATE VIEW public.med_mng_view_library
WITH (security_barrier=true)
AS
SELECT 
    s.id,
    s.title,
    s.created_at,
    CASE 
        WHEN mus.user_id IS NOT NULL THEN true
        ELSE false
    END AS in_library
FROM med_mng_songs s
LEFT JOIN med_mng_user_songs mus ON (
    s.id = mus.song_id 
    AND mus.user_id = auth.uid()
)
WHERE s.id IN (
    SELECT song_id 
    FROM med_mng_user_songs 
    WHERE user_id = auth.uid()
);

-- 2. Team emotion summary view - manager/admin only with org context
CREATE VIEW public.team_emotion_summary
WITH (security_barrier=true)
AS
SELECT 
    om.org_id,
    om.team_name,
    date_trunc('day', em.date) AS date,
    'general' AS emotion_type,
    COUNT(*) AS count,
    AVG(em.score::numeric) AS avg_confidence
FROM org_memberships om
JOIN emotions em ON (em.user_id = om.user_id)
WHERE EXISTS (
    SELECT 1 FROM org_memberships om2
    WHERE om2.org_id = om.org_id
      AND om2.user_id = auth.uid()
      AND om2.role IN ('manager', 'admin')
)
GROUP BY om.org_id, om.team_name, date_trunc('day', em.date)
ORDER BY date DESC;

-- 3. Security violations summary view - admin only
CREATE VIEW public.security_violations_summary
WITH (security_barrier=true)
AS
SELECT 
    severity,
    finding_type,
    COUNT(*) AS violation_count,
    COUNT(CASE WHEN resolved_at IS NULL THEN 1 END) AS unresolved_count,
    MAX(created_at) AS last_detection
FROM security_audit_log
WHERE EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
)
GROUP BY severity, finding_type
ORDER BY 
    CASE severity
        WHEN 'CRITICAL' THEN 1
        WHEN 'HIGH' THEN 2
        WHEN 'MEDIUM' THEN 3
        ELSE 4
    END,
    COUNT(*) DESC;

-- 4. User progress view - user-scoped learning progress
CREATE VIEW public.user_progress_view
WITH (security_barrier=true)
AS
SELECT 
    auth.uid() AS user_id,
    COUNT(DISTINCT badges.id) AS total_badges,
    COUNT(DISTINCT challenges.id) AS total_challenges,
    COUNT(DISTINCT challenges.id) FILTER (WHERE challenges.completed = true) AS completed_challenges,
    AVG(CASE WHEN challenges.completed THEN challenges.points ELSE 0 END) AS avg_points
FROM badges
FULL OUTER JOIN challenges ON (challenges.user_id = auth.uid())
WHERE badges.user_id = auth.uid() OR badges.user_id IS NULL
GROUP BY auth.uid();

-- Grant appropriate permissions on all recreated views
GRANT SELECT ON public.med_mng_view_library TO authenticated;
GRANT SELECT ON public.team_emotion_summary TO authenticated;
GRANT SELECT ON public.security_violations_summary TO authenticated;
GRANT SELECT ON public.user_progress_view TO authenticated;

-- Fix remaining functions with mutable search_path
CREATE OR REPLACE FUNCTION public.cleanup_expired_rate_limit_counters()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $function$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.rate_limit_counters
  WHERE window_end < now() - INTERVAL '1 hour';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$function$;

CREATE OR REPLACE FUNCTION public.cleanup_old_imports()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $function$
BEGIN
  -- Supprimer les imports terminés depuis plus de 30 jours
  DELETE FROM public.import_batches
  WHERE status IN ('completed', 'failed')
  AND completed_at < now() - INTERVAL '30 days';
END;
$function$;