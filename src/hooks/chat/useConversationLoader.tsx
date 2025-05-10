
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

  return { conversations, isLoading, error };
};

export default useConversationLoader;
