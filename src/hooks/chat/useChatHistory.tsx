
import { useState, useEffect } from 'react';
import { ChatMessage } from '@/types';
import { useToast } from '@/hooks/use-toast';

export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  lastMessageTimestamp?: string;
  messages?: ChatMessage[];
}

export const useChatHistory = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Load all conversations
  const loadConversations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockConversations: Conversation[] = [
        {
          id: 'conv-1',
          title: 'Gestion du stress',
          lastMessage: 'Voici quelques techniques de respiration pour vous aider.',
          lastMessageTimestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'conv-2',
          title: 'Amélioration du sommeil',
          lastMessage: 'N\'hésitez pas à essayer cette méditation avant de dormir.',
          lastMessageTimestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ];
      
      setConversations(mockConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
      setError(error instanceof Error ? error : new Error('Failed to load conversations'));
    } finally {
      setIsLoading(false);
    }
  };

  // Load messages for a specific conversation
  const loadMessages = async (conversationId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Mock data
      const mockMessages: ChatMessage[] = [
        {
          id: `${conversationId}-msg-1`,
          text: 'Bonjour, comment puis-je vous aider aujourd\'hui ?',
          content: 'Bonjour, comment puis-je vous aider aujourd\'hui ?',
          sender: 'bot',
          role: 'assistant',
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          conversation_id: conversationId
        },
        {
          id: `${conversationId}-msg-2`,
          text: 'J\'ai du mal à gérer mon stress au travail.',
          content: 'J\'ai du mal à gérer mon stress au travail.',
          sender: 'user',
          role: 'user',
          timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
          conversation_id: conversationId
        },
        {
          id: `${conversationId}-msg-3`,
          text: 'Je comprends. Le stress au travail est très courant. Pouvez-vous me décrire plus précisément ce qui génère ce stress ?',
          content: 'Je comprends. Le stress au travail est très courant. Pouvez-vous me décrire plus précisément ce qui génère ce stress ?',
          sender: 'bot',
          role: 'assistant',
          timestamp: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
          conversation_id: conversationId
        }
      ];
      
      // Update active conversation
      setActiveConversationId(conversationId);
      
      return mockMessages;
    } catch (error) {
      console.error('Error loading messages:', error);
      setError(error instanceof Error ? error : new Error('Failed to load messages'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Create new conversation
  const createConversation = async (title: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        title,
        lastMessageTimestamp: new Date().toISOString()
      };
      
      setConversations(prev => [newConversation, ...prev]);
      setActiveConversationId(newConversation.id);
      
      return newConversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      setError(error instanceof Error ? error : new Error('Failed to create conversation'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete conversation
  const deleteConversation = async (conversationId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      // Reset active conversation if deleted
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
      }
      
      toast({
        title: 'Conversation supprimée',
        description: 'La conversation a bien été supprimée.'
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la conversation.',
        variant: 'destructive'
      });
      
      return false;
    }
  };

  return {
    conversations,
    activeConversationId,
    setActiveConversationId,
    isLoading,
    error,
    loadConversations,
    loadMessages,
    createConversation,
    deleteConversation
  };
};

export default useChatHistory;
