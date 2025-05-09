
import { useState, useCallback, useEffect } from 'react';
import { ChatMessage, ChatConversation } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '../use-toast';

export const useChatHistory = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Mock function to load conversations from storage or API
  const loadConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data - in a real app, this would come from localStorage or an API
      const savedConversations = localStorage.getItem('chatConversations');
      
      if (savedConversations) {
        setConversations(JSON.parse(savedConversations));
      }
      
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setError('Failed to load conversations. Please try again.');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load chat history.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      setIsLoading(true);
      setActiveConversationId(conversationId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock data - in a real app, this would fetch messages from an API
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          text: 'Hello! How can I help you today?',
          sender: 'bot',
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
        },
        {
          id: '2',
          text: 'I\'m feeling a bit stressed today.',
          sender: 'user',
          timestamp: new Date(Date.now() - 1000 * 60 * 4),
        },
        {
          id: '3',
          text: 'I\'m sorry to hear that. What\'s causing your stress?',
          sender: 'bot',
          timestamp: new Date(Date.now() - 1000 * 60 * 3),
        },
      ];
      
      return mockMessages;
    } catch (err) {
      console.error('Failed to load messages:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load conversation messages.',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Create new conversation
  const createConversation = useCallback((title: string, firstMessage: string) => {
    const newId = uuidv4();
    const newConversation: ChatConversation = {
      id: newId,
      userId: 'current-user', // In a real app, this would be the actual user ID
      title,
      lastMessage: firstMessage,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newId);
    
    // Save to storage
    const updatedConversations = [newConversation, ...conversations];
    localStorage.setItem('chatConversations', JSON.stringify(updatedConversations));
    
    return newId;
  }, [conversations]);

  // Delete conversation
  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    
    if (activeConversationId === conversationId) {
      setActiveConversationId(null);
    }
    
    // Update storage
    const updatedConversations = conversations.filter(c => c.id !== conversationId);
    localStorage.setItem('chatConversations', JSON.stringify(updatedConversations));
    
    toast({
      title: 'Conversation deleted',
      description: 'The conversation has been removed from your history.',
    });
  }, [activeConversationId, conversations, toast]);

  return {
    conversations,
    activeConversationId,
    isLoading,
    error,
    loadConversations,
    loadMessages,
    createConversation,
    deleteConversation,
    setActiveConversationId,
  };
};

export default useChatHistory;
