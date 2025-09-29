-- Extension de la table notifications pour un système complet
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS channel TEXT DEFAULT 'general',
ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS clicked_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'info',
ADD COLUMN IF NOT EXISTS target_audience TEXT DEFAULT 'user',
ADD COLUMN IF NOT EXISTS delivery_method TEXT[] DEFAULT ARRAY['in_app'],
ADD COLUMN IF NOT EXISTS source_url TEXT,
ADD COLUMN IF NOT EXISTS deeplink TEXT;

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_notifications_user_created 
ON public.notifications(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_read_status 
ON public.notifications(user_id, read);

CREATE INDEX IF NOT EXISTS idx_notifications_category 
ON public.notifications(category, created_at DESC);

-- Table pour les préférences de notifications détaillées
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  delivery_methods TEXT[] DEFAULT ARRAY['in_app'],
  enabled BOOLEAN DEFAULT true,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  timezone TEXT DEFAULT 'Europe/Paris',
  frequency TEXT DEFAULT 'immediate',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, category)
);

-- RLS pour notification_preferences
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can view their own notification preferences"
ON public.notification_preferences FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can update their own notification preferences"
ON public.notification_preferences FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Table pour les templates de notifications
CREATE TABLE IF NOT EXISTS public.notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  title_template TEXT NOT NULL,
  message_template TEXT NOT NULL,
  default_delivery_methods TEXT[] DEFAULT ARRAY['in_app'],
  default_priority TEXT DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS pour notification_templates
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view notification templates" ON public.notification_templates;
CREATE POLICY "Authenticated users can view notification templates"
ON public.notification_templates FOR SELECT
TO authenticated
USING (true);

-- Fonction pour créer une notification depuis un template
CREATE OR REPLACE FUNCTION public.create_notification_from_template(
  template_name TEXT,
  target_user_id UUID,
  template_variables JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  template_record notification_templates%ROWTYPE;
  notification_id UUID;
  final_title TEXT;
  final_message TEXT;
BEGIN
  SELECT * INTO template_record 
  FROM public.notification_templates 
  WHERE name = template_name;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Template not found: %', template_name;
  END IF;
  
  final_title := template_record.title_template;
  final_message := template_record.message_template;
  
  INSERT INTO public.notifications (
    user_id,
    title,
    message,
    category,
    priority,
    delivery_method,
    metadata
  ) VALUES (
    target_user_id,
    final_title,
    final_message,
    template_record.category,
    template_record.default_priority,
    template_record.default_delivery_methods,
    template_variables
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Fonction pour marquer les notifications comme lues
CREATE OR REPLACE FUNCTION public.mark_notifications_as_read(
  user_id_param UUID,
  notification_ids UUID[] DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  IF notification_ids IS NULL THEN
    UPDATE public.notifications 
    SET 
      read = true,
      clicked_at = CASE WHEN clicked_at IS NULL THEN now() ELSE clicked_at END
    WHERE user_id = user_id_param AND read = false;
  ELSE
    UPDATE public.notifications 
    SET 
      read = true,
      clicked_at = CASE WHEN clicked_at IS NULL THEN now() ELSE clicked_at END
    WHERE user_id = user_id_param AND id = ANY(notification_ids);
  END IF;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

-- Templates de notifications par défaut
INSERT INTO public.notification_templates (name, category, title_template, message_template, default_delivery_methods, default_priority)
VALUES 
  ('welcome', 'system', 'Bienvenue sur EmotionsCare !', 'Nous sommes ravis de vous accueillir. Découvrez toutes nos fonctionnalités pour votre bien-être émotionnel.', ARRAY['in_app', 'email'], 'high'),
  ('emotion_scan_complete', 'scan', 'Analyse émotionnelle terminée', 'Votre scan émotionnel est maintenant disponible avec des recommandations personnalisées.', ARRAY['in_app', 'push'], 'medium'),
  ('journal_reminder', 'journal', 'Temps de réflexion', 'Avez-vous pensé à écrire dans votre journal aujourd''hui ? Quelques minutes suffisent.', ARRAY['in_app', 'push'], 'low'),
  ('coach_message', 'coach', 'Nouveau message du coach', 'Votre coach IA a un nouveau conseil personnalisé pour vous.', ARRAY['in_app', 'push'], 'medium'),
  ('music_recommendation', 'music', 'Nouvelle recommandation musicale', 'Découvrez une playlist adaptée à votre humeur actuelle.', ARRAY['in_app'], 'low'),
  ('vr_session_ready', 'vr', 'Session VR disponible', 'Une nouvelle expérience VR relaxante vous attend.', ARRAY['in_app', 'push'], 'medium'),
  ('achievement_unlocked', 'gamification', 'Nouvel accomplissement !', 'Félicitations ! Vous avez débloqué un nouveau badge.', ARRAY['in_app', 'push'], 'high'),
  ('daily_insight', 'insights', 'Votre insight du jour', 'Découvrez votre analyse émotionnelle quotidienne et vos progrès.', ARRAY['in_app'], 'medium'),
  ('community_mention', 'community', 'Vous avez été mentionné', 'Un membre de la communauté a interagi avec votre contenu.', ARRAY['in_app', 'push'], 'medium'),
  ('system_maintenance', 'system', 'Maintenance programmée', 'Une maintenance est prévue. Certaines fonctionnalités seront temporairement indisponibles.', ARRAY['in_app', 'email'], 'high')
ON CONFLICT (name) DO NOTHING;