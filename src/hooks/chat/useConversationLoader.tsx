
import { useState, useEffect } from 'react';
import { ChatConversation } from '@/types/chat';
import chatHistoryService from '@/lib/chat/chatHistoryService';

export const useConversationLoader = (userId: string) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setIsLoading(true);
        const userConversations = await chatHistoryService.getConversationsForUser(userId);
        setConversations(userConversations);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load conversations'));
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      loadConversations();
    }
  }, [userId]);

  const loadConversations = async (): Promise<ChatConversation[]> => {
    try {
      setIsLoading(true);
      const userConversations = await chatHistoryService.getConversationsForUser(userId);
      setConversations(userConversations);
      return userConversations;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load conversations');
      setError(error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return { conversations, isLoading, error, loadConversations };
};

export default useConversationLoader;
