
import { useState, useEffect, useCallback } from 'react';
import { ChatConversation } from '@/types/chat';

// Mock conversation service
const ConversationsService = {
  getConversations: async (userId?: string) => {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock conversations
    return [
      {
        id: 'conv1',
        title: 'First Conversation',
        updatedAt: '2023-01-15T14:22:00Z',
        createdAt: '2023-01-15T14:00:00Z',
        lastMessage: 'Hello there!',
        user_id: userId || 'user1',
      },
      {
        id: 'conv2',
        title: 'Support Request',
        updatedAt: '2023-01-10T09:15:00Z',
        createdAt: '2023-01-10T09:00:00Z',
        lastMessage: 'Thank you for your help.',
        user_id: userId || 'user1',
      }
    ] as ChatConversation[];
  },
  
  archiveConversation: async (conversationId: string) => {
    console.log('Archiving conversation:', conversationId);
    return { success: true };
  },
  
  deleteConversation: async (conversationId: string) => {
    console.log('Deleting conversation:', conversationId);
    return { success: true };
  }
};

export function useChatHistory(userId?: string) {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Using getConversations instead of getConversationsForUser
      const data = await ConversationsService.getConversations(userId);
      setConversations(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load conversations');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);
  
  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);
  
  const archiveConversation = useCallback(async (conversationId: string) => {
    try {
      await ConversationsService.archiveConversation(conversationId);
      // Update the local state to reflect the change
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, status: 'archived' as const } 
            : conv
        )
      );
      return true;
    } catch (error) {
      console.error('Error archiving conversation:', error);
      return false;
    }
  }, []);
  
  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      await ConversationsService.deleteConversation(conversationId);
      // Remove the conversation from the local state
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
  }, []);
  
  return {
    conversations,
    isLoading,
    error,
    refreshConversations: loadConversations,
    archiveConversation,
    deleteConversation
  };
}
