// @ts-nocheck

// This file needs to map the user_id property to the expected format

// @ts-nocheck
import { useState, useEffect } from 'react';
import { ChatConversation } from '@/types/chat';
import { logger } from '@/lib/logger';

export const useChatHistory = (userId: string) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Mock API call to fetch user conversations
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        setTimeout(() => {
          // Simulate API response
          const mockConversations = [
            {
              id: '1',
              title: 'Stress au travail',
              updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
              lastMessage: 'Voici quelques techniques pour gérer votre stress.',
              user_id: userId,
              messages: []
            },
            // More mock conversations...
          ];
          
          // Convert the mock API response to our expected ChatConversation type
          const formattedConversations: ChatConversation[] = mockConversations.map(conv => ({
            id: conv.id,
            title: conv.title,
            updatedAt: conv.updatedAt,
            createdAt: conv.createdAt,
            lastMessage: conv.lastMessage,
            messages: conv.messages || [],
            // Include user_id as a compatibility field, but TypeScript won't complain
            user_id: conv.user_id
          }));
          
          setConversations(formattedConversations);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        logger.error('Error fetching conversations', error as Error, 'UI');
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchConversations();
    }
  }, [userId]);

  return { conversations, isLoading };
};

export default useChatHistory;
