
import { useState, useEffect, useCallback } from 'react';
import { chatHistoryService, ChatConversation } from '@/lib/chat/chatHistoryService';
import { ChatMessage } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useChatHistory() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load user conversations
  const loadConversations = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const userConversations = await chatHistoryService.getConversations(user.id);
      setConversations(userConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Load initial conversations
  useEffect(() => {
    if (user?.id) {
      loadConversations();
    }
  }, [user?.id, loadConversations]);

  // Create a new conversation
  const createConversation = useCallback(async (title: string = "Nouvelle conversation"): Promise<string | null> => {
    if (!user?.id) return null;
    
    try {
      const conversationId = await chatHistoryService.createConversation(user.id, title);
      if (conversationId) {
        await loadConversations();
        setActiveConversationId(conversationId);
        return conversationId;
      }
      return null;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  }, [user?.id, loadConversations]);

  // Delete a conversation
  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      const success = await chatHistoryService.deleteConversation(conversationId);
      
      if (success) {
        if (activeConversationId === conversationId) {
          setActiveConversationId(null);
        }
        
        await loadConversations();
        
        toast({
          title: "Conversation supprimée",
          description: "La conversation a été supprimée avec succès."
        });
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la conversation.",
        variant: "destructive"
      });
    }
  }, [activeConversationId, loadConversations, toast]);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string): Promise<ChatMessage[]> => {
    setIsLoading(true);
    try {
      const messages = await chatHistoryService.getMessages(conversationId);
      setActiveConversationId(conversationId);
      return messages;
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save messages for a conversation
  const saveMessages = useCallback(async (messages: ChatMessage[]): Promise<boolean> => {
    if (!activeConversationId) {
      // Create a new conversation if none is active
      let conversationId = activeConversationId;
      
      if (!conversationId) {
        // Use the first user message as the title, or a default
        const firstUserMessage = messages.find(m => m.sender === 'user');
        const title = firstUserMessage ? firstUserMessage.text.substring(0, 50) : "Nouvelle conversation";
        conversationId = await createConversation(title);
      }
      
      if (!conversationId) return false;
      
      try {
        return await chatHistoryService.saveMessages(conversationId, messages);
      } catch (error) {
        console.error('Error saving messages:', error);
        return false;
      }
    } else {
      // Save to existing conversation
      try {
        return await chatHistoryService.saveMessages(activeConversationId, messages);
      } catch (error) {
        console.error('Error saving messages:', error);
        return false;
      }
    }
  }, [activeConversationId, createConversation]);

  return {
    conversations,
    activeConversationId,
    isLoading,
    createConversation,
    deleteConversation,
    loadConversations,
    loadMessages,
    saveMessages,
    setActiveConversationId
  };
}
