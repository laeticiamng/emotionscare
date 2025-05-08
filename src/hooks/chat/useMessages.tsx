
import { useCallback, useState } from 'react';
import { ChatMessage } from '@/types/chat';
import { chatHistoryService } from '@/lib/chat/chatHistoryService';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for managing messages within a conversation
 */
export function useMessages() {
  const { toast } = useToast();
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSavingMessages, setIsSavingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string): Promise<ChatMessage[]> => {
    if (!conversationId) {
      console.error('No conversation ID provided to loadMessages');
      setError('Identifiant de conversation manquant');
      return [];
    }
    
    setIsLoadingMessages(true);
    setError(null);
    try {
      console.log('Loading messages for conversation:', conversationId);
      const messages = await chatHistoryService.getMessages(conversationId);
      console.log('Loaded messages:', messages.length);
      return messages;
    } catch (error) {
      console.error('Error loading messages:', error);
      const errorMessage = 'Impossible de charger les messages.';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoadingMessages(false);
    }
  }, [toast]);

  // Save messages for a conversation
  const saveMessages = useCallback(async (
    conversationId: string, 
    messages: ChatMessage[]
  ): Promise<boolean> => {
    if (!conversationId) {
      console.error('No conversation ID provided to saveMessages');
      setError('Identifiant de conversation manquant');
      return false;
    }
    
    if (!messages || messages.length === 0) {
      console.warn('No messages to save');
      return false;
    }
    
    setIsSavingMessages(true);
    setError(null);
    try {
      console.log('Saving messages for conversation:', conversationId, 'count:', messages.length);
      const result = await chatHistoryService.saveMessages(conversationId, messages);
      
      if (!result) {
        console.error('Failed to save messages');
        const errorMessage = 'Impossible de sauvegarder les messages.';
        setError(errorMessage);
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error saving messages:', error);
      const errorMessage = 'Impossible de sauvegarder les messages.';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSavingMessages(false);
    }
  }, [toast]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loadMessages,
    saveMessages,
    isLoadingMessages,
    isSavingMessages,
    error,
    clearError
  };
}
