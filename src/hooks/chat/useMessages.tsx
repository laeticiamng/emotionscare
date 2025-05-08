
import { useCallback } from 'react';
import { ChatMessage } from '@/types/chat';
import { chatHistoryService } from '@/lib/chat/chatHistoryService';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for managing messages within a conversation
 */
export function useMessages() {
  const { toast } = useToast();

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string): Promise<ChatMessage[]> => {
    try {
      if (!conversationId) {
        console.error('No conversation ID provided to loadMessages');
        return [];
      }
      
      console.log('Loading messages for conversation:', conversationId);
      const messages = await chatHistoryService.getMessages(conversationId);
      console.log('Loaded messages:', messages.length);
      return messages;
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages.",
        variant: "destructive"
      });
      return [];
    }
  }, [toast]);

  // Save messages for a conversation
  const saveMessages = useCallback(async (
    conversationId: string, 
    messages: ChatMessage[]
  ): Promise<boolean> => {
    try {
      if (!conversationId) {
        console.error('No conversation ID provided to saveMessages');
        return false;
      }
      
      if (!messages || messages.length === 0) {
        console.warn('No messages to save');
        return false;
      }
      
      console.log('Saving messages for conversation:', conversationId, 'count:', messages.length);
      return await chatHistoryService.saveMessages(conversationId, messages);
    } catch (error) {
      console.error('Error saving messages:', error);
      return false;
    }
  }, []);

  return {
    loadMessages,
    saveMessages
  };
}
