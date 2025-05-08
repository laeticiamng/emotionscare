
import { useState, useCallback } from 'react';
import { chatHistoryService } from '@/lib/chat/chatHistoryService';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for managing conversation operations (create, update, delete)
 */
export function useConversationManagement(userId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Create a new conversation
  const createConversation = useCallback(async (title: string = "Nouvelle conversation"): Promise<string | null> => {
    if (!userId) {
      console.error('Cannot create conversation: No user logged in');
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour créer une conversation.",
        variant: "destructive"
      });
      return null;
    }
    
    setIsLoading(true);
    try {
      console.log('Creating conversation with title:', title);
      const conversationId = await chatHistoryService.createConversation(userId, title);
      
      if (!conversationId) {
        console.error('Failed to create conversation');
        toast({
          title: "Erreur",
          description: "Impossible de créer une nouvelle conversation.",
          variant: "destructive"
        });
        return null;
      }
      
      return conversationId;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer une nouvelle conversation.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast]);

  // Delete a conversation
  const deleteConversation = useCallback(async (conversationId: string): Promise<boolean> => {
    if (!conversationId) {
      console.error('No conversation ID provided to deleteConversation');
      return false;
    }
    
    setIsLoading(true);
    try {
      console.log('Deleting conversation:', conversationId);
      const success = await chatHistoryService.deleteConversation(conversationId);
      
      if (success) {
        toast({
          title: "Conversation supprimée",
          description: "La conversation a été supprimée avec succès."
        });
        return true;
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la conversation.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la conversation.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Update conversation title and last message
  const updateConversation = useCallback(async (
    conversationId: string, 
    title: string, 
    lastMessage: string
  ): Promise<boolean> => {
    if (!conversationId) {
      console.error('No conversation ID provided to updateConversation');
      return false;
    }
    
    try {
      console.log('Updating conversation:', conversationId, 'title:', title);
      const success = await chatHistoryService.updateConversation(
        conversationId, 
        title, 
        lastMessage
      );
      
      if (!success) {
        console.error('Failed to update conversation:', conversationId);
      }
      return success;
    } catch (error) {
      console.error('Error updating conversation:', error);
      return false;
    }
  }, []);

  return {
    createConversation,
    deleteConversation,
    updateConversation,
    isLoading
  };
}
