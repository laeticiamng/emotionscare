/**
 * Migration: Support Chatbot Tables - Phase 4.4
 * Schema pour le système de chatbot support IA autonome
 */

-- Créer la table des conversations
CREATE TABLE IF NOT EXISTS public.support_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,

  -- Infos conversation
  title text,
  status text DEFAULT 'open' CHECK (status IN ('open', 'closed', 'escalated', 'waiting_user')),
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),

  -- Intent principal
  primary_intent text, -- diagnostic, onboarding, feature_help, billing, feedback, etc.
  secondary_intents text[], -- autres intents détectés

  -- Metadata
  message_count integer DEFAULT 0,
  first_message_at timestamptz,
  last_message_at timestamptz,
  closed_at timestamptz,
  escalated_at timestamptz,

  -- Satisfaction et feedback
  user_satisfaction integer, -- 1-5 stars
  satisfaction_feedback text,
  resolution_rating integer, -- 1-5 étoiles

  -- Tracking
  session_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Créer la table des messages
CREATE TABLE IF NOT EXISTS public.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.support_conversations (id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL, -- NULL pour chatbot
  sender text NOT NULL CHECK (sender IN ('user', 'chatbot', 'admin')),

  -- Contenu du message
  content text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system', 'action')),

  -- Actions suggérées
  suggested_actions text[], -- actions rapides ["Voir le FAQ", "Créer un ticket"]
  attachments jsonb, -- { url, type, name }

  -- Detection results
  detected_intent text,
  intent_confidence numeric(3, 2),
  sentiment text, -- positive, neutral, negative
  requires_escalation boolean DEFAULT false,
  escalation_reason text,

  -- Admin notes
  admin_notes text,

  -- Metadata
  edited_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Créer la table des tickets de support
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.support_conversations (id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,

  -- Infos ticket
  ticket_number text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  category text CHECK (category IN ('technical', 'account', 'billing', 'other')),
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'waiting_customer', 'resolved', 'closed')),

  -- Assignation
  assigned_to uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  assigned_at timestamptz,

  -- Timing
  created_at timestamptz DEFAULT now(),
  first_response_at timestamptz,
  resolved_at timestamptz,
  closed_at timestamptz,

  -- Resolution
  resolution_notes text,
  resolution_rating integer, -- 1-5 stars
  resolution_feedback text,

  -- Updated tracking
  updated_at timestamptz DEFAULT now(),
  tags text[]
);

-- Créer la table des intents
CREATE TABLE IF NOT EXISTS public.chatbot_intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Intent definition
  intent_name text NOT NULL UNIQUE,
  description text,
  category text, -- diagnostic, onboarding, feature, billing, etc.

  -- Patterns pour détection
  keywords text[], -- mots-clés déclencheurs
  patterns text[], -- regex patterns
  example_phrases text[], -- phrases d'exemple

  -- Response configuration
  default_response text,
  requires_escalation boolean DEFAULT false,
  escalation_threshold numeric(3, 2) DEFAULT 0.5, -- confidence threshold
  suggested_actions text[], -- actions rapides

  -- Analytics
  usage_count integer DEFAULT 0,
  resolution_count integer DEFAULT 0,
  escalation_count integer DEFAULT 0,

  -- Status
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Créer la table des templates de réponses
CREATE TABLE IF NOT EXISTS public.chatbot_response_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intent_id uuid REFERENCES public.chatbot_intents (id) ON DELETE CASCADE,

  -- Template definition
  template_name text NOT NULL,
  category text,
  response_text text NOT NULL,
  system_prompt text, -- context pour OpenAI

  -- Metadata
  version integer DEFAULT 1,
  language text DEFAULT 'fr',
  is_default boolean DEFAULT false,
  is_active boolean DEFAULT true,

  -- Usage
  usage_count integer DEFAULT 0,
  satisfaction_count integer DEFAULT 0,
  satisfaction_sum integer DEFAULT 0, -- pour calculer la moyenne

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Créer la table des intents détectés par utilisateur
CREATE TABLE IF NOT EXISTS public.user_intent_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  intent_id uuid NOT NULL REFERENCES public.chatbot_intents (id) ON DELETE CASCADE,

  -- Preferances
  interaction_count integer DEFAULT 0,
  last_interacted_at timestamptz,
  is_relevant boolean DEFAULT true,

  UNIQUE(user_id, intent_id)
);

-- Créer les indexes
CREATE INDEX IF NOT EXISTS idx_conversations_user_id
  ON public.support_conversations(user_id);

CREATE INDEX IF NOT EXISTS idx_conversations_status
  ON public.support_conversations(status);

CREATE INDEX IF NOT EXISTS idx_conversations_created_at
  ON public.support_conversations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversations_primary_intent
  ON public.support_conversations(primary_intent);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id
  ON public.support_messages(conversation_id);

CREATE INDEX IF NOT EXISTS idx_messages_sender
  ON public.support_messages(sender);

CREATE INDEX IF NOT EXISTS idx_messages_created_at
  ON public.support_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_intent
  ON public.support_messages(detected_intent);

CREATE INDEX IF NOT EXISTS idx_tickets_user_id
  ON public.support_tickets(user_id);

CREATE INDEX IF NOT EXISTS idx_tickets_status
  ON public.support_tickets(status);

CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to
  ON public.support_tickets(assigned_to);

CREATE INDEX IF NOT EXISTS idx_tickets_created_at
  ON public.support_tickets(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_intents_name
  ON public.chatbot_intents(intent_name);

CREATE INDEX IF NOT EXISTS idx_intents_active
  ON public.chatbot_intents(is_active);

CREATE INDEX IF NOT EXISTS idx_templates_intent_id
  ON public.chatbot_response_templates(intent_id);

CREATE INDEX IF NOT EXISTS idx_templates_active
  ON public.chatbot_response_templates(is_active);

-- Activer RLS
ALTER TABLE public.support_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_response_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_intent_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour conversations
CREATE POLICY "Users can read their own conversations"
  ON public.support_conversations
  FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT assigned_to FROM public.support_tickets
    WHERE conversation_id = id AND assigned_to IS NOT NULL
  ));

CREATE POLICY "Users can create conversations"
  ON public.support_conversations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
  ON public.support_conversations
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies pour messages
CREATE POLICY "Users can read messages from their conversations"
  ON public.support_messages
  FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM public.support_conversations
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in their conversations"
  ON public.support_messages
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    conversation_id IN (
      SELECT id FROM public.support_conversations
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policies pour tickets
CREATE POLICY "Users can read their own tickets"
  ON public.support_tickets
  FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = assigned_to);

CREATE POLICY "Users can create tickets"
  ON public.support_tickets
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies pour intents (tous peuvent lire)
CREATE POLICY "Anyone can read intents"
  ON public.chatbot_intents
  FOR SELECT
  USING (is_active = true);

-- RLS Policies pour templates (tous peuvent lire les actifs)
CREATE POLICY "Anyone can read active templates"
  ON public.chatbot_response_templates
  FOR SELECT
  USING (is_active = true);

-- Fonctions pour mettre à jour les timestamps
CREATE OR REPLACE FUNCTION public.update_support_conversations_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_support_messages_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  -- Mettre à jour last_message_at de la conversation
  UPDATE public.support_conversations
  SET last_message_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_support_tickets_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer les triggers
CREATE TRIGGER update_support_conversations_timestamp_trigger
  BEFORE UPDATE ON public.support_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_support_conversations_timestamp();

CREATE TRIGGER update_support_messages_timestamp_trigger
  BEFORE INSERT OR UPDATE ON public.support_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_support_messages_timestamp();

CREATE TRIGGER update_support_tickets_timestamp_trigger
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_support_tickets_timestamp();

-- Générer le ticket_number automatiquement
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ticket_number = 'TKT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('support_tickets_seq')::text, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS support_tickets_seq START 1000;

CREATE TRIGGER generate_ticket_number_trigger
  BEFORE INSERT ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_ticket_number();

-- Commentaires
COMMENT ON TABLE public.support_conversations IS 'Conversations avec le chatbot support IA';
COMMENT ON TABLE public.support_messages IS 'Messages individuels dans les conversations';
COMMENT ON TABLE public.support_tickets IS 'Tickets de support escaladés pour équipe humaine';
COMMENT ON TABLE public.chatbot_intents IS 'Définition des intents pour la reconnaissance';
COMMENT ON TABLE public.chatbot_response_templates IS 'Templates de réponses pour les intents';
