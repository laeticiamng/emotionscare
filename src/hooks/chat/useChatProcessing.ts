
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUserContext } from './useUserContext';
import { useChatIntents } from './useChatIntents';
import { ChatResponse } from '@/types/chat';

export const useChatProcessing = (sessionId: string, userId?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { getUserContext } = useUserContext();
  const { determineIntent } = useChatIntents();
  
  const processMessage = useCallback(async (text: string, useStream = false): Promise<ChatResponse> => {
    setIsLoading(true);
    
    try {
      // Get the user's emotional context
      const userContext = await getUserContext(userId);
      
      // Determine which model to use based on the message content and length
      const model = text.length > 100 ? "gpt-4.1-2025-04-14" : "gpt-4o-mini-2024-07-18";
      
      // Prepare options for API call
      const options = {
        message: text,
        userContext,
        sessionId,
        stream: useStream,
        model
      };

      // Call Supabase Edge function
      if (useStream) {
        console.log("Streaming not fully implemented yet");
      }
      
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: options
      });
      
      if (error) throw error;
      
      const response = data.response;
      
      return {
        response,
        intent: determineIntent(text, response),
        sessionId: data.sessionId
      };
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Erreur de communication",
        description: "Impossible de contacter l'assistant IA pour le moment.",
        variant: "destructive"
      });
      
      return {
        response: "Je suis désolé, mais je rencontre des difficultés techniques pour répondre à votre demande. Veuillez réessayer plus tard.",
        intent: "error"
      };
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, userId, toast, getUserContext, determineIntent]);

  return {
    isLoading,
    processMessage
  };
};
