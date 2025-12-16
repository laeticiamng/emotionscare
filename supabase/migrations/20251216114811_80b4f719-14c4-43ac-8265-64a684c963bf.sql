-- Add missing unique constraints for tables using ON CONFLICT

-- user_roles: unique on user_id,role
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'user_roles_user_id_role_unique') THEN
    CREATE UNIQUE INDEX user_roles_user_id_role_unique ON public.user_roles(user_id, role);
  END IF;
END $$;

-- user_preferences: unique on user_id  
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'user_preferences_user_id_unique') THEN
    CREATE UNIQUE INDEX user_preferences_user_id_unique ON public.user_preferences(user_id);
  END IF;
END $$;

-- quests: unique on user_id,quest_id (if table exists)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'quests' AND table_schema = 'public') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'quests_user_id_quest_id_unique') THEN
      CREATE UNIQUE INDEX quests_user_id_quest_id_unique ON public.quests(user_id, quest_id);
    END IF;
  END IF;
END $$;

-- user_challenge_progress: unique on user_id,challenge_id (if table exists)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_challenge_progress' AND table_schema = 'public') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'user_challenge_progress_user_challenge_unique') THEN
      CREATE UNIQUE INDEX user_challenge_progress_user_challenge_unique ON public.user_challenge_progress(user_id, challenge_id);
    END IF;
  END IF;
END $$;

-- ai_coach_sessions: unique on user_id (if table exists)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ai_coach_sessions' AND table_schema = 'public') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'ai_coach_sessions_user_id_unique') THEN
      CREATE UNIQUE INDEX ai_coach_sessions_user_id_unique ON public.ai_coach_sessions(user_id);
    END IF;
  END IF;
END $$;

-- user_score_aggregates: unique on user_id (if table exists)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_score_aggregates' AND table_schema = 'public') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'user_score_aggregates_user_id_unique') THEN
      CREATE UNIQUE INDEX user_score_aggregates_user_id_unique ON public.user_score_aggregates(user_id);
    END IF;
  END IF;
END $$;