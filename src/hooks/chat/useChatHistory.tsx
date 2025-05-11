
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatConversation, ChatMessage } from '@/types/chat';

export interface UseChatHistoryResult {
  history: ChatMessage[];
  isLoading: boolean;
  conversations: ChatConversation[];
  activeConversationId: string | null;
  deleteConversation: (conversationId: string) => Promise<boolean>;
  loadMessages: (conversationId: string) => Promise<ChatMessage[]>;
  setActiveConversationId: (id: string | null) => void;
}

export function useChatHistory(): UseChatHistoryResult {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load conversations on init
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      // Mock conversations
      const mockConversations: ChatConversation[] = [
        {
          id: 'conv-1',
          title: 'Conversation 1',
          user_id: 'user-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          lastMessage: 'How can I improve my well-being?'
        },
        {
          id: 'conv-2',
          title: 'Conversation 2',
          user_id: 'user-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          lastMessage: 'Techniques for better sleep'
        }
      ];
      
      setConversations(mockConversations);
      return mockConversations;
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string): Promise<ChatMessage[]> => {
    setIsLoading(true);
    try {
      // Mock loading messages
      const mockMessages: ChatMessage[] = [
        {
          id: uuidv4(),
          content: 'Hello, how can I help you today?',
          text: 'Hello, how can I help you today?',
          sender: 'bot',
          timestamp: new Date().toISOString(),
          conversation_id: conversationId
        },
        {
          id: uuidv4(),
          content: 'I want to improve my wellbeing',
          text: 'I want to improve my wellbeing',
          sender: 'user',
          timestamp: new Date().toISOString(),
          conversation_id: conversationId
        }
      ];
      
      setHistory(mockMessages);
      return mockMessages;
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConversation = async (conversationId: string): Promise<boolean> => {
    try {
      // Remove from state
      setConversations(prevConversations => 
        prevConversations.filter(conv => conv.id !== conversationId)
      );
      
      // If we deleted the active conversation, clear it
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
        setHistory([]);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
  };

  return {
    history,
    isLoading,
    conversations,
    activeConversationId,
    deleteConversation,
    loadMessages,
    setActiveConversationId
  };
}
