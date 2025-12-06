-- Migration: enforce WITH CHECK clauses on user-owned tables and update policies
-- Adds WITH CHECK (auth.uid() = user_id) to critical policies to prevent cross-user writes

-- Harden FOR ALL policies for emotion_scans and related tables
DO $$
BEGIN
  IF to_regclass('public.emotion_scans') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can manage their own emotion scans" ON public.emotion_scans';
    EXECUTE $$CREATE POLICY "Users can manage their own emotion scans" ON public.emotion_scans
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);$$;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.voice_journal_entries') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can manage their own voice journal entries" ON public.voice_journal_entries';
    EXECUTE $$CREATE POLICY "Users can manage their own voice journal entries" ON public.voice_journal_entries
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);$$;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.vr_sessions') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can manage their own VR sessions" ON public.vr_sessions';
    EXECUTE $$CREATE POLICY "Users can manage their own VR sessions" ON public.vr_sessions
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);$$;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.breathwork_sessions') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can manage their own breathwork sessions" ON public.breathwork_sessions';
    EXECUTE $$CREATE POLICY "Users can manage their own breathwork sessions" ON public.breathwork_sessions
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);$$;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.music_playlists') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can manage their own music playlists" ON public.music_playlists';
    EXECUTE $$CREATE POLICY "Users can manage their own music playlists" ON public.music_playlists
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);$$;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.ai_coach_sessions') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can manage their own AI coach sessions" ON public.ai_coach_sessions';
    EXECUTE $$CREATE POLICY "Users can manage their own AI coach sessions" ON public.ai_coach_sessions
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);$$;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.gamification_activities') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can manage their own gamification activities" ON public.gamification_activities';
    EXECUTE $$CREATE POLICY "Users can manage their own gamification activities" ON public.gamification_activities
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);$$;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.user_preferences_advanced') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can manage their own advanced preferences" ON public.user_preferences_advanced';
    EXECUTE $$CREATE POLICY "Users can manage their own advanced preferences" ON public.user_preferences_advanced
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);$$;
  END IF;
END $$;

-- Add WITH CHECK to FOR UPDATE policies to prevent user_id escalation
DO $$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles';
    EXECUTE $$CREATE POLICY "Users can update their own profile" ON public.profiles
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);$$;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.coach_sessions') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can update their own sessions" ON public.coach_sessions';
    EXECUTE $$CREATE POLICY "Users can update their own sessions" ON public.coach_sessions
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);$$;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.journal_entries') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can update their own entries" ON public.journal_entries';
    EXECUTE $$CREATE POLICY "Users can update their own entries" ON public.journal_entries
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);$$;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.voice_entries') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can update their own voice entries" ON public.voice_entries';
    EXECUTE $$CREATE POLICY "Users can update their own voice entries" ON public.voice_entries
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);$$;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.community_posts') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can update their own posts" ON public.community_posts';
    EXECUTE $$CREATE POLICY "Users can update their own posts" ON public.community_posts
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);$$;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.post_comments') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can update their own comments" ON public.post_comments';
    EXECUTE $$CREATE POLICY "Users can update their own comments" ON public.post_comments
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);$$;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.challenge_participations') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can update their participation" ON public.challenge_participations';
    EXECUTE $$CREATE POLICY "Users can update their participation" ON public.challenge_participations
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);$$;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.user_stats') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can update their own stats" ON public.user_stats';
    EXECUTE $$CREATE POLICY "Users can update their own stats" ON public.user_stats
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);$$;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.challenges') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can update their own challenges" ON public.challenges';
    EXECUTE $$CREATE POLICY "Users can update their own challenges" ON public.challenges
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);$$;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('storage.objects') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects';
    EXECUTE $$CREATE POLICY "Users can update their own avatar" ON storage.objects
      FOR UPDATE
      USING (bucket_id = ''avatars'' AND auth.uid()::text = (storage.foldername(name))[1])
      WITH CHECK (bucket_id = ''avatars'' AND auth.uid()::text = (storage.foldername(name))[1]);$$;
  END IF;
END $$;
