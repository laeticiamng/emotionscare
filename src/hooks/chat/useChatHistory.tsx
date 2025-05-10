
import { useState, useEffect, useCallback } from 'react';
import { ChatConversation, ChatMessage } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { UseChatHistoryResult } from './types/useChatHistoryResult';

export function useChatHistory(): UseChatHistoryResult {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load conversations from storage or mock data
  useEffect(() => {
    const loadConversations = async () => {
      try {
        // Simulate API call
        const mockConversations: ChatConversation[] = [
          {
            id: 'conv-1',
            title: 'Discussion avec Coach IA',
            created_at: new Date(Date.now() - 86400000), // 1 day ago
            updated_at: new Date(),
            user_id: 'user-1',
            messages: [],
            last_message: 'Comment puis-je vous aider aujourd\'hui?'
          },
          {
            id: 'conv-2',
            title: 'Stress au travail',
            created_at: new Date(Date.now() - 172800000), // 2 days ago
            updated_at: new Date(Date.now() - 86400000),
            user_id: 'user-1',
            messages: [],
            last_message: 'Voici quelques techniques pour gérer votre stress.'
          }
        ];
        
        setConversations(mockConversations);
      } catch (error) {
        console.error('Error loading conversations:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les conversations.",
          variant: "destructive"
        });
      }
    };
    
    loadConversations();
  }, [toast]);

  // Delete conversation
  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      // Remove conversation from state
      setConversations(prevConversations => 
        prevConversations.filter(conv => conv.id !== conversationId)
      );
      
      // If the deleted conversation was active, clear active conversation
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la conversation.",
        variant: "destructive"
      });
      return false;
    }
  }, [activeConversationId, toast]);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string): Promise<ChatMessage[]> => {
    try {
      // Simulate API call
      const mockMessages: ChatMessage[] = [
        {
          id: 'msg-1',
          sender: 'bot',
          sender_id: 'coach-ai',
          conversation_id: conversationId,
          content: 'Bonjour, comment puis-je vous aider aujourd\'hui?',
          is_read: true,
          timestamp: new Date(Date.now() - 3600000) // 1 hour ago
        },
        {
          id: 'msg-2',
          sender: 'user',
          sender_id: 'user-1',
          conversation_id: conversationId,
          content: 'Je me sens stressé au travail',
          is_read: true,
          timestamp: new Date(Date.now() - 3540000) // 59 minutes ago
        },
        {
          id: 'msg-3',
          sender: 'bot',
          sender_id: 'coach-ai',
          conversation_id: conversationId,
          content: 'Je comprends. Pouvez-vous m\'en dire plus sur ce qui vous stresse précisément?',
          is_read: true,
          timestamp: new Date(Date.now() - 3480000) // 58 minutes ago
        }
      ];
      
      // Update the conversation in state with messages
      setConversations(prevConversations => 
        prevConversations.map(conv =>
          conv.id === conversationId ? { ...conv, messages: mockMessages } : conv
        )
      );
      
      setActiveConversationId(conversationId);
      
      return mockMessages;
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages.",
        variant: "destructive"
      });
      return [];
    }
  }, [toast]);

  return {
    conversations,
    activeConversationId,
    deleteConversation,
    loadMessages,
    setActiveConversationId
  };
}
