-- =============================================
-- MODULE GROUP SESSIONS - Tables complètes
-- =============================================

-- Table principale des sessions de groupe
CREATE TABLE IF NOT EXISTS public.group_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'wellbeing',
  session_type TEXT NOT NULL DEFAULT 'open', -- open, private, moderated
  host_id UUID NOT NULL,
  max_participants INTEGER DEFAULT 20,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT DEFAULT 'scheduled', -- scheduled, live, completed, cancelled
  cover_image TEXT,
  tags TEXT[] DEFAULT '{}',
  is_recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT, -- RRULE format
  meeting_url TEXT,
  recording_url TEXT,
  xp_reward INTEGER DEFAULT 50,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Participants aux sessions
CREATE TABLE IF NOT EXISTS public.group_session_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.group_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status TEXT DEFAULT 'registered', -- registered, attended, absent, cancelled
  role TEXT DEFAULT 'participant', -- participant, co-host, moderator
  joined_at TIMESTAMP WITH TIME ZONE,
  left_at TIMESTAMP WITH TIME ZONE,
  mood_before INTEGER CHECK (mood_before >= 1 AND mood_before <= 10),
  mood_after INTEGER CHECK (mood_after >= 1 AND mood_after <= 10),
  feedback TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(session_id, user_id)
);

-- Messages de chat en temps réel
CREATE TABLE IF NOT EXISTS public.group_session_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.group_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- text, system, reaction, resource
  reply_to_id UUID REFERENCES public.group_session_messages(id),
  is_pinned BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Réactions aux messages
CREATE TABLE IF NOT EXISTS public.group_session_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.group_session_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);

-- Ressources partagées pendant les sessions
CREATE TABLE IF NOT EXISTS public.group_session_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.group_sessions(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL,
  title TEXT NOT NULL,
  resource_type TEXT NOT NULL, -- link, file, image, video, audio
  url TEXT NOT NULL,
  description TEXT,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Catégories de sessions prédéfinies
CREATE TABLE IF NOT EXISTS public.group_session_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insérer les catégories par défaut
INSERT INTO public.group_session_categories (name, label, description, icon, color, order_index) VALUES
('wellbeing', 'Bien-être', 'Sessions axées sur le bien-être mental et émotionnel', 'Heart', '#EC4899', 1),
('meditation', 'Méditation', 'Sessions de méditation guidée en groupe', 'Brain', '#8B5CF6', 2),
('breathing', 'Respiration', 'Exercices de respiration collectifs', 'Wind', '#06B6D4', 3),
('discussion', 'Discussion', 'Cercles de parole et échanges', 'MessageCircle', '#3B82F6', 4),
('creative', 'Créatif', 'Ateliers créatifs et artistiques', 'Palette', '#F59E0B', 5),
('movement', 'Mouvement', 'Yoga, étirements et exercices doux', 'Activity', '#10B981', 6),
('support', 'Soutien', 'Groupes de soutien thématiques', 'Users', '#6366F1', 7),
('workshop', 'Atelier', 'Ateliers d''apprentissage pratique', 'BookOpen', '#EF4444', 8)
ON CONFLICT (name) DO NOTHING;

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_group_sessions_scheduled_at ON public.group_sessions(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_group_sessions_status ON public.group_sessions(status);
CREATE INDEX IF NOT EXISTS idx_group_sessions_host ON public.group_sessions(host_id);
CREATE INDEX IF NOT EXISTS idx_group_session_participants_session ON public.group_session_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_group_session_participants_user ON public.group_session_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_group_session_messages_session ON public.group_session_messages(session_id);

-- Enable RLS
ALTER TABLE public.group_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_session_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_session_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_session_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_session_categories ENABLE ROW LEVEL SECURITY;

-- Policies for group_sessions
CREATE POLICY "Sessions are viewable by everyone" ON public.group_sessions
  FOR SELECT USING (session_type != 'private' OR host_id = auth.uid());

CREATE POLICY "Users can create sessions" ON public.group_sessions
  FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their sessions" ON public.group_sessions
  FOR UPDATE USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their sessions" ON public.group_sessions
  FOR DELETE USING (auth.uid() = host_id);

-- Policies for participants
CREATE POLICY "Participants viewable by session members" ON public.group_session_participants
  FOR SELECT USING (true);

CREATE POLICY "Users can register themselves" ON public.group_session_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their participation" ON public.group_session_participants
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can cancel their participation" ON public.group_session_participants
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for messages
CREATE POLICY "Messages viewable by session participants" ON public.group_session_messages
  FOR SELECT USING (true);

CREATE POLICY "Participants can send messages" ON public.group_session_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can edit their messages" ON public.group_session_messages
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for reactions
CREATE POLICY "Reactions viewable by all" ON public.group_session_reactions
  FOR SELECT USING (true);

CREATE POLICY "Users can add reactions" ON public.group_session_reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their reactions" ON public.group_session_reactions
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for resources
CREATE POLICY "Resources viewable by all" ON public.group_session_resources
  FOR SELECT USING (true);

CREATE POLICY "Users can upload resources" ON public.group_session_resources
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

-- Policies for categories
CREATE POLICY "Categories viewable by all" ON public.group_session_categories
  FOR SELECT USING (true);

-- Function to update participant count
CREATE OR REPLACE FUNCTION public.update_session_on_participant_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Award XP for registering
    UPDATE public.group_session_participants 
    SET xp_earned = COALESCE(xp_earned, 0) + 10
    WHERE id = NEW.id;
  ELSIF TG_OP = 'UPDATE' AND NEW.status = 'attended' AND OLD.status != 'attended' THEN
    -- Award XP for attending
    UPDATE public.group_session_participants 
    SET xp_earned = COALESCE(xp_earned, 0) + 
      (SELECT COALESCE(xp_reward, 50) FROM public.group_sessions WHERE id = NEW.session_id)
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trigger_update_session_participant
AFTER INSERT OR UPDATE ON public.group_session_participants
FOR EACH ROW EXECUTE FUNCTION public.update_session_on_participant_change();

-- Function to auto-update session status
CREATE OR REPLACE FUNCTION public.auto_update_session_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Mark as live if scheduled time has passed
  IF NEW.scheduled_at <= now() AND NEW.status = 'scheduled' THEN
    NEW.status := 'live';
  END IF;
  
  -- Mark as completed if duration has passed
  IF NEW.scheduled_at + (NEW.duration_minutes || ' minutes')::interval <= now() 
     AND NEW.status = 'live' THEN
    NEW.status := 'completed';
  END IF;
  
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_auto_update_session_status
BEFORE UPDATE ON public.group_sessions
FOR EACH ROW EXECUTE FUNCTION public.auto_update_session_status();