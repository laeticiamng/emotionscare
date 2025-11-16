-- Migration: Music Generation Sessions Table
-- Created: 2025-11-16
-- Description: Table pour stocker les sessions de génération de musique avec Suno API

-- Create music_generation_sessions table
CREATE TABLE IF NOT EXISTS public.music_generation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id TEXT NOT NULL,
  emotion_state JSONB NOT NULL,
  emotion_badge TEXT NOT NULL,
  suno_config JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  result JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_music_sessions_user_id ON public.music_generation_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_music_sessions_created_at ON public.music_generation_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_music_sessions_status ON public.music_generation_sessions(status);
CREATE INDEX IF NOT EXISTS idx_music_sessions_task_id ON public.music_generation_sessions(task_id);

-- Enable Row Level Security
ALTER TABLE public.music_generation_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own music sessions
DROP POLICY IF EXISTS "music_sessions_select_own" ON public.music_generation_sessions;
CREATE POLICY "music_sessions_select_own"
  ON public.music_generation_sessions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "music_sessions_insert_own" ON public.music_generation_sessions;
CREATE POLICY "music_sessions_insert_own"
  ON public.music_generation_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF NOT EXISTS "music_sessions_update_own" ON public.music_generation_sessions;
CREATE POLICY "music_sessions_update_own"
  ON public.music_generation_sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "music_sessions_delete_own" ON public.music_generation_sessions;
CREATE POLICY "music_sessions_delete_own"
  ON public.music_generation_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Add comment
COMMENT ON TABLE public.music_generation_sessions IS 'Stores music generation sessions with Suno API integration';
