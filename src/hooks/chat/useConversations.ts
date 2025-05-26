
import { useState, useCallback } from 'react';
import { ChatConversation, ChatMessage } from '@/types/chat';

export const useConversations = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate loading conversations
      const mockConversations: ChatConversation[] = [];
      setConversations(mockConversations);
    } catch (err) {
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  const selectConversation = useCallback((conversation: ChatConversation) => {
    setCurrentConversation(conversation);
    setMessages(conversation.messages);
  }, []);

  const createConversation = useCallback(async (title: string) => {
    const newConversation: ChatConversation = {
      id: Date.now().toString(),
      title,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
    setMessages([]);
    
    return newConversation;
  }, []);

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    loadConversations,
    selectConversation,
    createConversation,
    setMessages
  };
};
