-- Table session_history pour l'historique des sessions de tous les modules
CREATE TABLE IF NOT EXISTS public.session_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  module_type TEXT NOT NULL,
  session_data JSONB DEFAULT '{}',
  duration_seconds INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_session_history_user_id ON public.session_history(user_id);
CREATE INDEX IF NOT EXISTS idx_session_history_module ON public.session_history(module_type);
CREATE INDEX IF NOT EXISTS idx_session_history_created ON public.session_history(created_at DESC);

-- Enable RLS
ALTER TABLE public.session_history ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own session history"
  ON public.session_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own session history"
  ON public.session_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own session history"
  ON public.session_history FOR UPDATE
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.session_history IS 'Historique unifié des sessions de tous les modules EmotionsCare';