
import { useState, useCallback, useEffect } from 'react';
import { ChatConversation, ChatMessage } from '@/types/chat';
import { chatHistoryService } from '@/lib/chat/chatHistoryService';
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
    if (!user?.id) {
      console.warn('Cannot load conversations: No user logged in');
      return [];
    }
    
    setIsLoading(true);
    try {
      console.log('Loading conversations for user:', user.id);
      const userConversations = await chatHistoryService.getConversations(user.id);
      console.log('Loaded conversations:', userConversations.length);
      
      // Update the state with the loaded conversations
      setConversations(userConversations);
      
      // If no active conversation is set but we have conversations, set the first one as active
      if (!activeConversationId && userConversations.length > 0) {
        console.log('Setting first conversation as active:', userConversations[0].id);
        setActiveConversationId(userConversations[0].id);
      }
      
      return userConversations;
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les conversations.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, activeConversationId, toast]);

  // Create a new conversation
  const createConversation = useCallback(async (title: string = "Nouvelle conversation"): Promise<string | null> => {
    if (!user?.id) {
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
      const conversationId = await chatHistoryService.createConversation(user.id, title);
      
      if (!conversationId) {
        console.error('Failed to create conversation');
        toast({
          title: "Erreur",
          description: "Impossible de créer une nouvelle conversation.",
          variant: "destructive"
        });
        return null;
      }
      
      // Reload conversations to update the list
      await loadConversations();
      
      // Set the new conversation as active
      setActiveConversationId(conversationId);
      
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
  }, [user?.id, loadConversations, toast]);

  // Delete a conversation
  const deleteConversation = useCallback(async (conversationId: string) => {
    if (!conversationId) {
      console.error('No conversation ID provided to deleteConversation');
      return false;
    }
    
    setIsLoading(true);
    try {
      console.log('Deleting conversation:', conversationId);
      const success = await chatHistoryService.deleteConversation(conversationId);
      
      if (success) {
        // Clear the active conversation if the deleted one was active
        if (activeConversationId === conversationId) {
          setActiveConversationId(null);
        }
        
        // Reload conversations to update the list
        await loadConversations();
        
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
  }, [activeConversationId, loadConversations, toast]);

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
      
      if (success) {
        // Update local state to reflect the changes without fetching the whole list again
        setConversations(prevConversations => 
          prevConversations.map(conv => 
            conv.id === conversationId 
              ? {...conv, title, lastMessage, updatedAt: new Date()} 
              : conv
          )
        );
        return true;
      } else {
        console.error('Failed to update conversation:', conversationId);
        return false;
      }
    } catch (error) {
      console.error('Error updating conversation:', error);
      return false;
    }
  }, []);

  // Refresh conversations periodically or when active conversation changes
  useEffect(() => {
    if (user?.id) {
      loadConversations();
    }
  }, [user?.id, loadConversations]);

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
