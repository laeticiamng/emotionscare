-- =============================================
-- EMOTIONSCARE - BASE DE DONNÉES COMPLÈTE
-- Système de bien-être émotionnel avancé
-- =============================================

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILS UTILISATEURS
-- =============================================
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  timezone TEXT DEFAULT 'Europe/Paris',
  language TEXT DEFAULT 'fr',
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- =============================================
-- SCANS ÉMOTIONNELS
-- =============================================
CREATE TABLE public.emotion_scans (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  emotions JSONB NOT NULL, -- {joy: 80, stress: 20, anxiety: 10, etc.}
  dominant_emotion TEXT NOT NULL,
  confidence_score FLOAT NOT NULL DEFAULT 0.0,
  scan_type TEXT DEFAULT 'facial' CHECK (scan_type IN ('facial', 'voice', 'text', 'manual')),
  context TEXT, -- workplace, home, social, etc.
  notes TEXT,
  recommendations JSONB, -- AI-generated recommendations
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.emotion_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own scans" 
ON public.emotion_scans FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scans" 
ON public.emotion_scans FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- =============================================
-- SESSIONS COACH IA
-- =============================================
CREATE TABLE public.coach_sessions (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  coach_mode TEXT NOT NULL CHECK (coach_mode IN ('empathetic', 'motivational', 'analytical')),
  topic TEXT,
  duration_minutes INTEGER DEFAULT 0,
  mood_before TEXT,
  mood_after TEXT,
  satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
  goals_discussed TEXT[],
  key_insights TEXT[],
  follow_up_actions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.coach_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions" 
ON public.coach_sessions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions" 
ON public.coach_sessions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" 
ON public.coach_sessions FOR UPDATE 
USING (auth.uid() = user_id);

-- =============================================
-- MESSAGES COACH IA
-- =============================================
CREATE TABLE public.coach_messages (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.coach_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'coach')),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'suggestion', 'exercise', 'goal')),
  ai_confidence FLOAT,
  emotions_detected JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.coach_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages" 
ON public.coach_messages FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own messages" 
ON public.coach_messages FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- =============================================
-- ENTRÉES JOURNAL
-- =============================================
CREATE TABLE public.journal_entries (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  mood TEXT NOT NULL CHECK (mood IN ('happy', 'neutral', 'sad', 'excited', 'calm', 'anxious', 'grateful')),
  tags TEXT[],
  gratitude_items TEXT[],
  goals TEXT[],
  is_private BOOLEAN DEFAULT true,
  word_count INTEGER,
  sentiment_score FLOAT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own entries" 
ON public.journal_entries FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own entries" 
ON public.journal_entries FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries" 
ON public.journal_entries FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries" 
ON public.journal_entries FOR DELETE 
USING (auth.uid() = user_id);

-- =============================================
-- SESSIONS VR
-- =============================================
CREATE TABLE public.vr_sessions (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  experience_id TEXT NOT NULL,
  experience_title TEXT NOT NULL,
  environment TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('relaxation', 'meditation', 'nature', 'focus', 'energy')),
  duration_minutes INTEGER NOT NULL,
  completion_percentage FLOAT DEFAULT 0.0,
  mood_before TEXT,
  mood_after TEXT,
  stress_level_before INTEGER CHECK (stress_level_before BETWEEN 1 AND 10),
  stress_level_after INTEGER CHECK (stress_level_after BETWEEN 1 AND 10),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.vr_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own VR sessions" 
ON public.vr_sessions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own VR sessions" 
ON public.vr_sessions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- =============================================
-- SESSIONS MUSICOTHÉRAPIE
-- =============================================
CREATE TABLE public.music_sessions (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  playlist_id TEXT,
  playlist_name TEXT NOT NULL,
  genre TEXT,
  mood_target TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  tracks_played TEXT[],
  emotional_journey JSONB, -- Track emotions throughout session
  biometric_data JSONB, -- Heart rate, etc. if available
  effectiveness_rating INTEGER CHECK (effectiveness_rating BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.music_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own music sessions" 
ON public.music_sessions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own music sessions" 
ON public.music_sessions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- =============================================
-- OBJECTIFS PERSONNELS
-- =============================================
CREATE TABLE public.personal_goals (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('stress', 'confidence', 'relationships', 'work-life', 'health', 'mindfulness')),
  target_value FLOAT,
  current_value FLOAT DEFAULT 0.0,
  unit TEXT, -- days, sessions, points, etc.
  deadline DATE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  completion_percentage FLOAT DEFAULT 0.0,
  milestones JSONB,
  rewards TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.personal_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own goals" 
ON public.personal_goals FOR ALL 
USING (auth.uid() = user_id);

-- =============================================
-- POSTS COMMUNAUTÉ
-- =============================================
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('success', 'support', 'question', 'inspiration')),
  tags TEXT[],
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_anonymous BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  moderation_status TEXT DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are viewable by everyone" 
ON public.community_posts FOR SELECT 
USING (moderation_status = 'approved');

CREATE POLICY "Users can create posts" 
ON public.community_posts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" 
ON public.community_posts FOR UPDATE 
USING (auth.uid() = user_id);

-- =============================================
-- LIKES POSTS
-- =============================================
CREATE TABLE public.post_likes (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view likes" 
ON public.post_likes FOR SELECT 
USING (true);

CREATE POLICY "Users can like posts" 
ON public.post_likes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts" 
ON public.post_likes FOR DELETE 
USING (auth.uid() = user_id);

-- =============================================
-- COMMENTAIRES
-- =============================================
CREATE TABLE public.post_comments (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  is_anonymous BOOLEAN DEFAULT false,
  moderation_status TEXT DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone" 
ON public.post_comments FOR SELECT 
USING (moderation_status = 'approved');

CREATE POLICY "Users can create comments" 
ON public.post_comments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.post_comments FOR UPDATE 
USING (auth.uid() = user_id);

-- =============================================
-- DÉFIS COMMUNAUTAIRES
-- =============================================
CREATE TABLE public.community_challenges (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('wellness', 'meditation', 'journal', 'mindfulness', 'social')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  target_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  reward_description TEXT,
  reward_points INTEGER DEFAULT 0,
  rules JSONB,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.community_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Challenges are viewable by everyone" 
ON public.community_challenges FOR SELECT 
USING (is_active = true);

-- =============================================
-- PARTICIPATIONS AUX DÉFIS
-- =============================================
CREATE TABLE public.challenge_participations (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  challenge_id UUID NOT NULL REFERENCES public.community_challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  progress FLOAT DEFAULT 0.0,
  completed BOOLEAN DEFAULT false,
  completion_date TIMESTAMP WITH TIME ZONE,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

ALTER TABLE public.challenge_participations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view participations" 
ON public.challenge_participations FOR SELECT 
USING (true);

CREATE POLICY "Users can join challenges" 
ON public.challenge_participations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their participation" 
ON public.challenge_participations FOR UPDATE 
USING (auth.uid() = user_id);

-- =============================================
-- GROUPES DE SOUTIEN
-- =============================================
CREATE TABLE public.support_groups (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  max_members INTEGER DEFAULT 100,
  current_members INTEGER DEFAULT 0,
  is_private BOOLEAN DEFAULT false,
  join_approval_required BOOLEAN DEFAULT false,
  moderator_ids UUID[],
  rules TEXT[],
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.support_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Groups are viewable by everyone" 
ON public.support_groups FOR SELECT 
USING (true);

-- =============================================
-- ADHÉSIONS AUX GROUPES
-- =============================================
CREATE TABLE public.group_memberships (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.support_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'banned')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

ALTER TABLE public.group_memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view memberships" 
ON public.group_memberships FOR SELECT 
USING (true);

CREATE POLICY "Users can join groups" 
ON public.group_memberships FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- =============================================
-- ÉVÉNEMENTS COMMUNAUTAIRES
-- =============================================
CREATE TABLE public.community_events (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('meditation', 'workshop', 'vr_session', 'group_therapy', 'webinar')),
  start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  location TEXT, -- virtual/physical
  meeting_link TEXT,
  facilitator_id UUID,
  price DECIMAL(10,2) DEFAULT 0.00,
  is_free BOOLEAN DEFAULT true,
  registration_required BOOLEAN DEFAULT true,
  tags TEXT[],
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by everyone" 
ON public.community_events FOR SELECT 
USING (true);

-- =============================================
-- INSCRIPTIONS AUX ÉVÉNEMENTS
-- =============================================
CREATE TABLE public.event_registrations (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled', 'no_show')),
  payment_status TEXT DEFAULT 'free' CHECK (payment_status IN ('free', 'paid', 'pending', 'refunded')),
  notes TEXT,
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their registrations" 
ON public.event_registrations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can register for events" 
ON public.event_registrations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- =============================================
-- NOTIFICATIONS
-- =============================================
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('achievement', 'reminder', 'social', 'system', 'challenge', 'event')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  data JSONB, -- Additional context data
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" 
ON public.notifications FOR ALL 
USING (auth.uid() = user_id);

-- =============================================
-- PARAMÈTRES UTILISATEUR
-- =============================================
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  language TEXT DEFAULT 'fr',
  timezone TEXT DEFAULT 'Europe/Paris',
  notifications_email BOOLEAN DEFAULT true,
  notifications_push BOOLEAN DEFAULT true,
  notifications_sms BOOLEAN DEFAULT false,
  privacy_profile_visibility TEXT DEFAULT 'friends' CHECK (privacy_profile_visibility IN ('public', 'friends', 'private')),
  privacy_activity_sharing BOOLEAN DEFAULT true,
  privacy_data_analytics BOOLEAN DEFAULT true,
  accessibility_high_contrast BOOLEAN DEFAULT false,
  accessibility_large_text BOOLEAN DEFAULT false,
  accessibility_reduced_motion BOOLEAN DEFAULT false,
  coach_mode_preference TEXT DEFAULT 'empathetic' CHECK (coach_mode_preference IN ('empathetic', 'motivational', 'analytical')),
  reminder_frequency TEXT DEFAULT 'daily' CHECK (reminder_frequency IN ('none', 'daily', 'weekly', 'custom')),
  custom_reminder_times TIME[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own preferences" 
ON public.user_preferences FOR ALL 
USING (auth.uid() = user_id);

-- =============================================
-- TRIGGERS POUR TIMESTAMPS
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coach_sessions_updated_at
BEFORE UPDATE ON public.coach_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at
BEFORE UPDATE ON public.journal_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
BEFORE UPDATE ON public.personal_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_preferences_updated_at
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- FONCTIONS D'AGRÉGATION
-- =============================================

-- Fonction pour mettre à jour les compteurs de likes
CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

CREATE TRIGGER trigger_update_post_likes_count
AFTER INSERT OR DELETE ON public.post_likes
FOR EACH ROW
EXECUTE FUNCTION public.update_post_likes_count();

-- Fonction pour mettre à jour les compteurs de commentaires
CREATE OR REPLACE FUNCTION public.update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts 
    SET comments_count = comments_count + 1 
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts 
    SET comments_count = comments_count - 1 
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

CREATE TRIGGER trigger_update_post_comments_count
AFTER INSERT OR DELETE ON public.post_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_post_comments_count();

-- Fonction pour le calcul automatique du word count dans le journal
CREATE OR REPLACE FUNCTION public.calculate_word_count()
RETURNS TRIGGER AS $$
BEGIN
  NEW.word_count = array_length(string_to_array(NEW.content, ' '), 1);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

CREATE TRIGGER trigger_calculate_word_count
BEFORE INSERT OR UPDATE ON public.journal_entries
FOR EACH ROW
EXECUTE FUNCTION public.calculate_word_count();

-- =============================================
-- INDEX POUR PERFORMANCES
-- =============================================
CREATE INDEX idx_emotion_scans_user_id_created ON public.emotion_scans(user_id, created_at DESC);
CREATE INDEX idx_coach_sessions_user_id ON public.coach_sessions(user_id);
CREATE INDEX idx_journal_entries_user_id_created ON public.journal_entries(user_id, created_at DESC);
CREATE INDEX idx_vr_sessions_user_id ON public.vr_sessions(user_id);
CREATE INDEX idx_music_sessions_user_id ON public.music_sessions(user_id);
CREATE INDEX idx_community_posts_created ON public.community_posts(created_at DESC);
CREATE INDEX idx_notifications_user_id_unread ON public.notifications(user_id, is_read, created_at DESC);

-- =============================================
-- DONNÉES INITIALES POUR LES TESTS
-- =============================================

-- Défis communautaires de base
INSERT INTO public.community_challenges (title, description, category, start_date, end_date, target_participants, reward_description, reward_points) VALUES
('Défi Gratitude 30 jours', 'Notez 3 choses pour lesquelles vous êtes reconnaissant chaque jour pendant 30 jours', 'wellness', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 100, 'Badge Cœur Reconnaissant', 500),
('Méditation Quotidienne', 'Méditez au moins 10 minutes par jour pendant 21 jours', 'meditation', CURRENT_DATE, CURRENT_DATE + INTERVAL '21 days', 150, 'Badge Zen Master', 300),
('Journal Hebdomadaire', 'Écrivez dans votre journal au moins 5 fois par semaine pendant 4 semaines', 'journal', CURRENT_DATE, CURRENT_DATE + INTERVAL '28 days', 80, 'Badge Écrivain Sage', 400);

-- Groupes de soutien de base
INSERT INTO public.support_groups (name, description, category, max_members, moderator_ids, created_by) VALUES
('Gestion du Stress', 'Techniques et soutien pour gérer le stress quotidien', 'Anxiété', 100, '{}', '00000000-0000-0000-0000-000000000000'),
('Confiance en Soi', 'Booster sa confiance et son estime personnelle', 'Développement', 80, '{}', '00000000-0000-0000-0000-000000000000'),
('Équilibre Travail-Vie', 'Trouver l\'harmonie entre vie professionnelle et personnelle', 'Professionnel', 120, '{}', '00000000-0000-0000-0000-000000000000'),
('Parents Bienveillants', 'Conseils et soutien pour une parentalité épanouie', 'Famille', 60, '{}', '00000000-0000-0000-0000-000000000000');

-- Événements de base
INSERT INTO public.community_events (title, description, event_type, start_datetime, end_datetime, max_participants, facilitator_id, created_by) VALUES
('Méditation Collective Matinale', 'Session de méditation guidée pour bien commencer la journée', 'meditation', CURRENT_DATE + INTERVAL '1 day' + TIME '08:00', CURRENT_DATE + INTERVAL '1 day' + TIME '08:30', 50, '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000'),
('Atelier Gestion du Stress', 'Techniques avancées pour gérer le stress au quotidien', 'workshop', CURRENT_DATE + INTERVAL '3 days' + TIME '19:00', CURRENT_DATE + INTERVAL '3 days' + TIME '21:00', 30, '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000'),
('Session VR Collective', 'Exploration d\'environnements relaxants en réalité virtuelle', 'vr_session', CURRENT_DATE + INTERVAL '5 days' + TIME '20:30', CURRENT_DATE + INTERVAL '5 days' + TIME '21:15', 25, '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000');