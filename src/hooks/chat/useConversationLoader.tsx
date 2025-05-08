
import { useState, useCallback } from 'react';
import { ChatConversation } from '@/types/chat';
import { chatHistoryService } from '@/lib/chat/chatHistoryService';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for loading user conversations
 */
export function useConversationLoader(userId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load user conversations
  const loadConversations = useCallback(async (): Promise<ChatConversation[]> => {
    if (!userId) {
      console.warn('Cannot load conversations: No user logged in');
      return [];
    }
    
    setIsLoading(true);
    try {
      console.log('Loading conversations for user:', userId);
      const userConversations = await chatHistoryService.getConversations(userId);
      console.log('Loaded conversations:', userConversations.length);
      
      return userConversations;
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les conversations.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast]);

  return {
    loadConversations,
    isLoading
  };
}
