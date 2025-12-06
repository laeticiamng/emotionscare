// @ts-nocheck

// @ts-nocheck
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
      const mockConversations: ChatConversation[] = [
        {
          id: '1',
          title: 'Conversation avec Coach',
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: []
        }
      ];
      setConversations(mockConversations);
    } catch (err) {
      setError('Erreur lors du chargement des conversations');
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
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: []
    };
    
    setConversations(prev => [...prev, newConversation]);
    setCurrentConversation(newConversation);
    setMessages([]);
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
