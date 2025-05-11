
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ChatConversation, ChatMessage } from '@/types/chat';
import { UseChatHistoryResult } from './types/useChatHistoryResult';

export function useChatHistory(): UseChatHistoryResult {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Load conversations when component mounts
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockConversations: ChatConversation[] = [
        {
          id: 'conv-1',
          title: 'Gestion du stress',
          user_id: user?.id || 'unknown',
          lastMessage: 'Comment puis-je gérer mon stress quotidien?',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'conv-2',
          title: 'Améliorer mon sommeil',
          user_id: user?.id || 'unknown',
          lastMessage: 'Quelles sont les techniques pour mieux dormir?',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setConversations(mockConversations);
      // Set first conversation as active if none is selected
      if (!activeConversationId && mockConversations.length > 0) {
        setActiveConversationId(mockConversations[0].id);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string): Promise<ChatMessage[]> => {
    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Set this conversation as active
    setActiveConversationId(conversationId);
    
    // Mock data
    const mockMessages: ChatMessage[] = [
      {
        id: 'msg-1',
        sender: 'bot',
        text: 'Bonjour, comment puis-je vous aider aujourd\'hui?',
        timestamp: new Date().toISOString(),
        conversation_id: conversationId,
        is_read: true
      },
      {
        id: 'msg-2',
        sender: 'user',
        text: 'J\'ai des questions sur la gestion du stress',
        timestamp: new Date().toISOString(),
        conversation_id: conversationId,
        is_read: true
      },
      {
        id: 'msg-3',
        sender: 'bot',
        text: 'Je serais ravi de vous aider avec la gestion du stress. Pourriez-vous me donner plus de détails sur ce que vous ressentez?',
        timestamp: new Date().toISOString(),
        conversation_id: conversationId,
        is_read: true
      }
    ];
    
    return mockMessages;
  };

  const deleteConversation = async (conversationId: string): Promise<boolean> => {
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Remove from state
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      // If the active conversation was deleted, set activeConversationId to null
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
  };

  return {
    conversations,
    activeConversationId,
    deleteConversation,
    loadMessages,
    setActiveConversationId
  };
}
