
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatConversation, ChatMessage } from '@/types/chat';

export interface UseChatHistoryResult {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  deleteConversation: (conversationId: string) => Promise<boolean>;
  loadMessages: (conversationId: string) => Promise<ChatMessage[]>;
  setActiveConversationId: (id: string | null) => void;
}

export function useChatHistory(): UseChatHistoryResult {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  
  // Load conversations on component mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        // In a real application, this would be loaded from an API
        const mockConversations: ChatConversation[] = [
          {
            id: 'conv1',
            title: 'Première conversation',
            created_at: new Date(Date.now() - 86400000 * 3),
            updated_at: new Date(Date.now() - 86400000 * 2),
            user_id: 'user-1',
            messages: [],
            last_message: 'Comment puis-je améliorer mon bien-être ?'
          },
          {
            id: 'conv2',
            title: 'Discussion sur l\'anxiété',
            created_at: new Date(Date.now() - 86400000 * 2),
            updated_at: new Date(Date.now() - 86400000),
            user_id: 'user-1',
            messages: [],
            last_message: 'Merci pour ces conseils utiles.'
          }
        ];
        setConversations(mockConversations);
        
        // Set the most recent conversation as active if none is selected
        if (!activeConversationId && mockConversations.length > 0) {
          setActiveConversationId(mockConversations[0].id);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
      }
    };
    
    loadConversations();
  }, []);
  
  // Load messages for a specific conversation
  const loadMessages = useCallback(async (conversationId: string): Promise<ChatMessage[]> => {
    try {
      // In a real application, this would be loaded from an API
      const mockMessages: ChatMessage[] = [
        {
          id: 'msg1',
          content: 'Bonjour, comment puis-je vous aider aujourd\'hui ?',
          text: 'Bonjour, comment puis-je vous aider aujourd\'hui ?',
          sender: 'bot',
          sender_id: 'coach-1',
          conversation_id: conversationId,
          is_read: true,
          timestamp: new Date(Date.now() - 3600000)
        },
        {
          id: 'msg2',
          content: 'Je me sens stressé au travail. Que me conseillez-vous ?',
          text: 'Je me sens stressé au travail. Que me conseillez-vous ?',
          sender: 'user',
          sender_id: 'user-1',
          conversation_id: conversationId,
          is_read: true,
          timestamp: new Date(Date.now() - 3300000)
        },
        {
          id: 'msg3',
          content: 'Je comprends. Le stress au travail est courant. Essayez des exercices de respiration profonde et prenez des pauses régulières.',
          text: 'Je comprends. Le stress au travail est courant. Essayez des exercices de respiration profonde et prenez des pauses régulières.',
          sender: 'bot',
          sender_id: 'coach-1',
          conversation_id: conversationId,
          is_read: true,
          timestamp: new Date(Date.now() - 3000000)
        }
      ];
      
      // Update the local state with the loaded messages
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId ? { ...conv, messages: mockMessages } : conv
        )
      );
      
      return mockMessages;
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  }, []);
  
  // Delete a conversation
  const deleteConversation = useCallback(async (conversationId: string): Promise<boolean> => {
    try {
      // In a real application, this would be an API call
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      // If the active conversation is deleted, set the active conversation to null
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
  }, [activeConversationId]);

  return {
    conversations,
    activeConversationId,
    deleteConversation,
    loadMessages,
    setActiveConversationId
  };
}

export default useChatHistory;
