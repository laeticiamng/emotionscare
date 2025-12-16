-- FIX: Add missing unique constraints only

-- 1. Add unique constraint on user_settings (user_id, key) if not exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'user_settings_user_key_unique'
  ) THEN
    CREATE UNIQUE INDEX user_settings_user_key_unique 
    ON public.user_settings(user_id, key) 
    WHERE key IS NOT NULL;
  END IF;
END $$;

-- 2. Add unique constraint on user_preferences (user_id) if not exists  
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_preferences' AND table_schema = 'public') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE indexname = 'user_preferences_user_unique'
    ) THEN
      CREATE UNIQUE INDEX user_preferences_user_unique ON public.user_preferences(user_id);
    END IF;
  END IF;
END $$;

-- 3. Add unique constraint on user_roles (user_id, role) if not exists
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles' AND table_schema = 'public') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE indexname = 'user_roles_user_role_unique'
    ) THEN
      CREATE UNIQUE INDEX user_roles_user_role_unique ON public.user_roles(user_id, role);
    END IF;
  END IF;
END $$;

-- 4. Add unique constraint on quests (user_id, quest_id) if table and columns exist
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quests' AND column_name = 'quest_id' AND table_schema = 'public'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE indexname = 'quests_user_quest_unique'
    ) THEN
      CREATE UNIQUE INDEX quests_user_quest_unique ON public.quests(user_id, quest_id);
    END IF;
  END IF;
END $$;

-- 5. Add unique constraint on user_challenge_progress (user_id, challenge_id) if exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_challenge_progress' AND column_name = 'challenge_id' AND table_schema = 'public'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE indexname = 'user_challenge_progress_unique'
    ) THEN
      CREATE UNIQUE INDEX user_challenge_progress_unique 
      ON public.user_challenge_progress(user_id, challenge_id);
    END IF;
  END IF;
END $$;

-- 6. Add unique constraint on ai_coach_sessions (user_id) if exists
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ai_coach_sessions' AND table_schema = 'public') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE indexname = 'ai_coach_sessions_user_unique'
    ) THEN
      CREATE UNIQUE INDEX ai_coach_sessions_user_unique ON public.ai_coach_sessions(user_id);
    END IF;
  END IF;
END $$;

-- 7. Add unique constraint on user_score_aggregates (user_id) if exists
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_score_aggregates' AND table_schema = 'public') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE indexname = 'user_score_aggregates_user_unique'
    ) THEN
      CREATE UNIQUE INDEX user_score_aggregates_user_unique ON public.user_score_aggregates(user_id);
    END IF;
  END IF;
END $$;

-- 8. Add unique constraint on emotion_tracks (task_id) if exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'emotion_tracks' AND column_name = 'task_id' AND table_schema = 'public'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE indexname = 'emotion_tracks_task_unique'
    ) THEN
      CREATE UNIQUE INDEX emotion_tracks_task_unique ON public.emotion_tracks(task_id);
    END IF;
  END IF;
END $$;

-- 9. Add unique constraint on emotion_modules (task_id) if exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'emotion_modules' AND column_name = 'task_id' AND table_schema = 'public'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE indexname = 'emotion_modules_task_unique'
    ) THEN
      CREATE UNIQUE INDEX emotion_modules_task_unique ON public.emotion_modules(task_id);
    END IF;
  END IF;
END $$;

-- 10. Add unique constraint on wearable_connections (user_id, provider) if exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wearable_connections' AND column_name = 'provider' AND table_schema = 'public'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE indexname = 'wearable_connections_user_provider_unique'
    ) THEN
      CREATE UNIQUE INDEX wearable_connections_user_provider_unique 
      ON public.wearable_connections(user_id, provider);
    END IF;
  END IF;
END $$;

-- 11. Add unique constraint on user_push_subscriptions (user_id, endpoint) if exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_push_subscriptions' AND column_name = 'endpoint' AND table_schema = 'public'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE indexname = 'user_push_subscriptions_unique'
    ) THEN
      CREATE UNIQUE INDEX user_push_subscriptions_unique 
      ON public.user_push_subscriptions(user_id, endpoint);
    END IF;
  END IF;
END $$;

-- 12. Add unique constraint on community_reactions (post_id, user_id) if exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'community_reactions' AND column_name = 'post_id' AND table_schema = 'public'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE indexname = 'community_reactions_unique'
    ) THEN
      CREATE UNIQUE INDEX community_reactions_unique 
      ON public.community_reactions(post_id, user_id);
    END IF;
  END IF;
END $$;

-- 13. Add unique constraint on predictions (match_id, user_id) if exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'predictions' AND column_name = 'match_id' AND table_schema = 'public'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE indexname = 'predictions_match_user_unique'
    ) THEN
      CREATE UNIQUE INDEX predictions_match_user_unique 
      ON public.predictions(match_id, user_id);
    END IF;
  END IF;
END $$;

-- 14. Add unique constraint on b2b_events_rsvp (event_id, user_id) if exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'b2b_events_rsvp' AND column_name = 'event_id' AND table_schema = 'public'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE indexname = 'b2b_events_rsvp_unique'
    ) THEN
      CREATE UNIQUE INDEX b2b_events_rsvp_unique 
      ON public.b2b_events_rsvp(event_id, user_id);
    END IF;
  END IF;
END $$;

-- 15. Add unique constraint on b2b_team_members (org_id, user_id) if exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'b2b_team_members' AND column_name = 'org_id' AND table_schema = 'public'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE indexname = 'b2b_team_members_unique'
    ) THEN
      CREATE UNIQUE INDEX b2b_team_members_unique 
      ON public.b2b_team_members(org_id, user_id);
    END IF;
  END IF;
END $$;