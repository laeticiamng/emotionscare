-- ============================================================================
-- Migration: Fix SECURITY DEFINER functions missing SET search_path
-- Date: 2026-03-12
-- Description: Adds SET search_path = public to all SECURITY DEFINER functions
--              that were missing it, preventing potential search_path injection.
-- ============================================================================

-- GDPR Compliance Audit (from 20251107141037)
ALTER FUNCTION public.audit_consent_compliance() SET search_path = public;
ALTER FUNCTION public.audit_retention_compliance() SET search_path = public;
ALTER FUNCTION public.audit_user_rights_compliance() SET search_path = public;
ALTER FUNCTION public.audit_security_compliance() SET search_path = public;
ALTER FUNCTION public.get_latest_compliance_audit() SET search_path = public;

-- ML Assignment (from 20251113223035)
ALTER FUNCTION public.get_ml_assignment_recommendation(TEXT, TEXT, TEXT, TEXT[]) SET search_path = public;

-- Community RPC functions (from 20250114)
ALTER FUNCTION public.increment_post_likes(UUID) SET search_path = public;
ALTER FUNCTION public.decrement_post_likes(UUID) SET search_path = public;
ALTER FUNCTION public.increment_post_comments(UUID) SET search_path = public;
ALTER FUNCTION public.decrement_post_comments(UUID) SET search_path = public;
ALTER FUNCTION public.increment_comment_likes(UUID) SET search_path = public;
ALTER FUNCTION public.decrement_comment_likes(UUID) SET search_path = public;
ALTER FUNCTION public.increment_group_members(UUID) SET search_path = public;
ALTER FUNCTION public.decrement_group_members(UUID) SET search_path = public;
ALTER FUNCTION public.increment_post_shares(UUID) SET search_path = public;
ALTER FUNCTION public.increment_post_views(UUID) SET search_path = public;
ALTER FUNCTION public.get_trending_posts(INTEGER, INTEGER) SET search_path = public;
ALTER FUNCTION public.extract_and_notify_mentions(UUID, TEXT, UUID) SET search_path = public;
ALTER FUNCTION public.calculate_buddy_compatibility(UUID, UUID) SET search_path = public;

-- Health integrations (from 20250114)
ALTER FUNCTION public.get_aggregated_health_data(UUID, TEXT, TIMESTAMPTZ, TIMESTAMPTZ, TEXT) SET search_path = public;
ALTER FUNCTION public.detect_health_anomalies(UUID, TEXT, INTEGER) SET search_path = public;

-- GDPR tables (from 20250116)
ALTER FUNCTION public.get_user_active_consents(UUID) SET search_path = public;
ALTER FUNCTION public.has_pending_deletion_request(UUID) SET search_path = public;

-- Notifications (from 20250620192345)
ALTER FUNCTION public.create_notification_from_template(TEXT, UUID, JSONB) SET search_path = public;
ALTER FUNCTION public.mark_notifications_as_read(UUID, UUID[]) SET search_path = public;

-- Hearts gamification (from 20251030103636)
ALTER FUNCTION public.regenerate_hearts() SET search_path = public;

-- Data Retention (from 20251107125536)
ALTER FUNCTION public.update_retention_rules_updated_at() SET search_path = public;
ALTER FUNCTION public.archive_expired_data(TEXT, INTEGER) SET search_path = public;

-- Pseudonymization (from 20251107133903)
ALTER FUNCTION public.get_active_pseudonymization_rules(text) SET search_path = public;
ALTER FUNCTION public.get_pseudonymization_statistics(uuid, date, date) SET search_path = public;

-- Consent Management (from 20251107140608)
ALTER FUNCTION public.track_consent_changes() SET search_path = public;
ALTER FUNCTION public.get_user_consent_status(uuid) SET search_path = public;
ALTER FUNCTION public.validate_campaign_consents(uuid) SET search_path = public;

-- Webhooks (from 20251107142606)
ALTER FUNCTION public.create_webhook_event_on_consent_change() SET search_path = public;
ALTER FUNCTION public.get_webhooks_for_event(text) SET search_path = public;
ALTER FUNCTION public.get_webhook_statistics(uuid) SET search_path = public;

-- Scheduled Audits (from 20251107192938)
ALTER FUNCTION public.detect_score_drops(uuid) SET search_path = public;
ALTER FUNCTION public.get_due_audit_schedules() SET search_path = public;

-- GDPR Violations (from 20251111094347)
ALTER FUNCTION public.calculate_risk_score() SET search_path = public;
ALTER FUNCTION public.get_violation_stats(INTEGER) SET search_path = public;

-- Cron Monitoring (from 20251113123014)
ALTER FUNCTION public.get_cron_job_history() SET search_path = public;
ALTER FUNCTION public.get_cron_jobs_list() SET search_path = public;

-- Gamification Cron (from 20251113170154)
ALTER FUNCTION public.get_gamification_cron_history() SET search_path = public;
ALTER FUNCTION public.get_gamification_cron_jobs() SET search_path = public;

-- Leaderboard (from 20251113174533)
ALTER FUNCTION public.update_leaderboard_scores() SET search_path = public;
ALTER FUNCTION public.reset_weekly_scores() SET search_path = public;
ALTER FUNCTION public.reset_monthly_scores() SET search_path = public;

-- Monitoring Cleanup (from 20251207124603)
ALTER FUNCTION public.cleanup_old_monitoring_events() SET search_path = public;
ALTER FUNCTION public.cleanup_old_monitoring_errors() SET search_path = public;

-- Sessions Sync (from 20251230202334)
ALTER FUNCTION public.sync_session_from_module() SET search_path = public;

-- Group Sessions (from 20251230204707)
ALTER FUNCTION public.update_session_on_participant_change() SET search_path = public;
