-- Date: 20250612
-- Ticket: Complete API backend integration
-- Undo Migration: Drop/revert API tables

-- Drop new tables
DROP TABLE IF EXISTS public.breath_weekly_metrics CASCADE;
DROP TABLE IF EXISTS public.clinical_instruments CASCADE;
DROP TABLE IF EXISTS public.assessments CASCADE;
DROP TABLE IF EXISTS public.personal_goals CASCADE;
DROP TABLE IF EXISTS public.coach_api_messages CASCADE;
DROP TABLE IF EXISTS public.coach_api_sessions CASCADE;
DROP TABLE IF EXISTS public.breathwork_sessions CASCADE;

-- Remove added columns from existing tables (vr_sessions)
ALTER TABLE public.vr_sessions DROP COLUMN IF EXISTS experience_type;
ALTER TABLE public.vr_sessions DROP COLUMN IF EXISTS duration_seconds;
ALTER TABLE public.vr_sessions DROP COLUMN IF EXISTS vr_tier;
ALTER TABLE public.vr_sessions DROP COLUMN IF EXISTS profile;
ALTER TABLE public.vr_sessions DROP COLUMN IF EXISTS mood_before;
ALTER TABLE public.vr_sessions DROP COLUMN IF EXISTS mood_after;
ALTER TABLE public.vr_sessions DROP COLUMN IF EXISTS session_data;
ALTER TABLE public.vr_sessions DROP COLUMN IF EXISTS updated_at;

-- Remove added columns from existing tables (emotion_scans)
ALTER TABLE public.emotion_scans DROP COLUMN IF EXISTS dominant_emotion;
ALTER TABLE public.emotion_scans DROP COLUMN IF EXISTS confidence_score;
ALTER TABLE public.emotion_scans DROP COLUMN IF EXISTS context;
ALTER TABLE public.emotion_scans DROP COLUMN IF EXISTS notes;
