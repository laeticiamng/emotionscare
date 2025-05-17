
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatConversation, ChatMessage } from '@/types/chat';

// Mock initial conversations for demonstration
const initialConversations: ChatConversation[] = [
  {
    id: '1',
    title: 'Conversation with AI Assistant',
    user_id: 'user-1',
    created_at: '2023-03-15T12:00:00Z',
    updated_at: '2023-03-15T12:05:00Z',
    last_message: 'Hello! How can I help you today?',
    messages: []
  },
  {
    id: '2',
    title: 'Emotional Support',
    user_id: 'user-1',
    created_at: '2023-03-14T09:30:00Z',
    updated_at: '2023-03-14T09:35:00Z',
    last_message: 'Remember to take breaks during your workday.',
    messages: []
  }
];

export const useConversations = (userId = 'user-1') => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [loading, setLoading] = useState(true);

  // Load conversations (simulated API call)
  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        const userConversations = initialConversations.filter(
          conv => conv.user_id === userId
        );
        setConversations(userConversations);
        
        // Set the most recent conversation as selected by default
        if (userConversations.length > 0 && !selectedConversation) {
          setSelectedConversation(userConversations[0]);
        }
      } catch (error) {
        console.error('Failed to load conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [userId, selectedConversation]);

  // Create a new conversation
  const createConversation = useCallback(async (title: string) => {
    const timestamp = new Date().toISOString();
    const newConversation: ChatConversation = {
      id: uuidv4(),
      title,
      user_id: userId,
      created_at: timestamp,
      updated_at: timestamp,
      last_message: '',
      messages: []
    };

    setConversations(prev => [newConversation, ...prev]);
    setSelectedConversation(newConversation);
    return newConversation;
  }, [userId]);

  // Delete a conversation
  const deleteConversation = useCallback(async (conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(null);
    }
  }, [selectedConversation]);

  // Add a message to a conversation
  const addMessageToConversation = useCallback(async (
    conversationId: string, 
    message: Omit<ChatMessage, 'id' | 'timestamp'>
  ) => {
    const timestamp = new Date().toISOString();
    const newMessage: ChatMessage = {
      id: uuidv4(),
      timestamp,
      ...message,
      conversation_id: conversationId
    };

    // Find and update the conversation
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId ? {
          ...conv,
          updated_at: timestamp,
          title: conv.title,
          last_message: message.content || message.text || '',
        } : conv
      )
    );

    return newMessage;
  }, []);

  return {
    conversations,
    selectedConversation,
    setSelectedConversation,
    loading,
    createConversation,
    deleteConversation,
    addMessageToConversation
  };
};

export default useConversations;
