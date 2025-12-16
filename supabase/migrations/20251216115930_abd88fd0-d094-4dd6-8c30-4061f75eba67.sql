-- Clean duplicates and add unique constraints

-- 1. Delete duplicates in coach_conversations keeping latest
DELETE FROM public.coach_conversations a
USING public.coach_conversations b
WHERE a.id < b.id
  AND a.user_id = b.user_id
  AND a.coach_mode = b.coach_mode;

-- Now create index
CREATE UNIQUE INDEX IF NOT EXISTS coach_conversations_user_mode_unique 
ON public.coach_conversations(user_id, coach_mode);

-- 2. user_stats (user_id) - clean duplicates first
DELETE FROM public.user_stats a
USING public.user_stats b
WHERE a.id < b.id
  AND a.user_id = b.user_id;

CREATE UNIQUE INDEX IF NOT EXISTS user_stats_user_id_unique ON public.user_stats(user_id);

-- 3. user_quest_progress (user_id, quest_id)
DELETE FROM public.user_quest_progress a
USING public.user_quest_progress b
WHERE a.id < b.id
  AND a.user_id = b.user_id
  AND a.quest_id = b.quest_id;

CREATE UNIQUE INDEX IF NOT EXISTS user_quest_progress_user_quest_unique 
ON public.user_quest_progress(user_id, quest_id);

-- 4. user_notification_settings (user_id)
DELETE FROM public.user_notification_settings a
USING public.user_notification_settings b
WHERE a.id < b.id
  AND a.user_id = b.user_id;

CREATE UNIQUE INDEX IF NOT EXISTS user_notification_settings_user_unique 
ON public.user_notification_settings(user_id);

-- 5. push_subscriptions (user_id, endpoint)
DELETE FROM public.push_subscriptions a
USING public.push_subscriptions b
WHERE a.id < b.id
  AND a.user_id = b.user_id
  AND a.endpoint = b.endpoint;

CREATE UNIQUE INDEX IF NOT EXISTS push_subscriptions_user_endpoint_unique 
ON public.push_subscriptions(user_id, endpoint);

-- 6. alert_escalation_rules (name)
DELETE FROM public.alert_escalation_rules a
USING public.alert_escalation_rules b
WHERE a.id < b.id
  AND a.name = b.name;

CREATE UNIQUE INDEX IF NOT EXISTS alert_escalation_rules_name_unique 
ON public.alert_escalation_rules(name);