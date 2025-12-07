-- =====================================================
-- Migration: Fix Security Definer Views
-- Issue: SUPA_security_definer_view
-- 
-- These views use SECURITY DEFINER (default) which enforces 
-- RLS policies of the view creator, not the querying user.
-- Converting to SECURITY INVOKER for proper RLS enforcement.
-- =====================================================

-- 1. Fix ai_monitoring_stats view - add SECURITY INVOKER
ALTER VIEW public.ai_monitoring_stats SET (security_invoker = true);

-- 2. Fix alert_analytics view - add SECURITY INVOKER
ALTER VIEW public.alert_analytics SET (security_invoker = true);