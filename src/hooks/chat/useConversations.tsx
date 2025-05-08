
import { useState, useCallback } from 'react';
import { ChatConversation, chatHistoryService } from '@/lib/chat/chatHistoryService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for managing chat conversations
 */
export function useConversations() {
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

  // Update conversation title and last message
  const updateConversation = useCallback(async (
    conversationId: string, 
    title: string, 
    lastMessage: string
  ): Promise<boolean> => {
    try {
      return await chatHistoryService.updateConversation(
        conversationId, 
        title, 
        lastMessage
      );
    } catch (error) {
      console.error('Error updating conversation:', error);
      return false;
    }
  }, []);

  return {
    conversations,
    activeConversationId,
    isLoading,
    setActiveConversationId,
    loadConversations,
    createConversation,
    deleteConversation,
    updateConversation
  };
}
