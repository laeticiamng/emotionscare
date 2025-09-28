-- Créer les politiques RLS pour les tables coach_conversations et coach_messages

-- Politiques pour coach_conversations
CREATE POLICY "Users can view their own coach conversations" 
ON public.coach_conversations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own coach conversations" 
ON public.coach_conversations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coach conversations" 
ON public.coach_conversations 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own coach conversations" 
ON public.coach_conversations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Politiques pour coach_messages
CREATE POLICY "Users can view their own coach messages" 
ON public.coach_messages 
FOR SELECT 
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.coach_conversations 
    WHERE id = coach_messages.conversation_id
  )
);

CREATE POLICY "Users can create their own coach messages" 
ON public.coach_messages 
FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT user_id 
    FROM public.coach_conversations 
    WHERE id = coach_messages.conversation_id
  )
);

CREATE POLICY "Users can update their own coach messages" 
ON public.coach_messages 
FOR UPDATE 
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.coach_conversations 
    WHERE id = coach_messages.conversation_id
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT user_id 
    FROM public.coach_conversations 
    WHERE id = coach_messages.conversation_id
  )
);

CREATE POLICY "Users can delete their own coach messages" 
ON public.coach_messages 
FOR DELETE 
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.coach_conversations 
    WHERE id = coach_messages.conversation_id
  )
);