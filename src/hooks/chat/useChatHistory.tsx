
import { useEffect, useCallback, useState } from 'react';
import { ChatMessage } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from './useConversations';
import { useMessages } from './useMessages';
import { useToast } from '@/hooks/use-toast';

/**
 * Main hook for chat history management
 * Combines conversation and message operations
 */
export function useChatHistory() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    conversations,
    activeConversationId,
    isLoading: isLoadingConversations,
    setActiveConversationId,
    loadConversations,
    createConversation,
    deleteConversation,
    updateConversation
  } = useConversations();
  
  const { 
    loadMessages, 
    saveMessages,
    isLoadingMessages,
    isSavingMessages,
    error: messagesError,
    clearError
  } = useMessages();

  // Sync error states
  useEffect(() => {
    if (messagesError) {
      setError(messagesError);
    }
  }, [messagesError]);

  // Load initial conversations
  useEffect(() => {
    if (user?.id && !isInitialized) {
      console.log('Loading initial conversations for user:', user.id);
      setIsLoadingHistory(true);
      setError(null);
      loadConversations()
        .then(() => {
          setIsInitialized(true);
          setError(null);
        })
        .catch(err => {
          console.error('Failed to load initial conversations:', err);
          setError("Impossible de charger vos conversations.");
          toast({
            title: "Erreur",
            description: "Impossible de charger vos conversations.",
            variant: "destructive"
          });
        })
        .finally(() => setIsLoadingHistory(false));
    }
  }, [user?.id, loadConversations, isInitialized, toast]);

  // Enhanced saveMessages with conversation creation if needed
  const saveMessagesWithConversation = useCallback(async (messages: ChatMessage[]): Promise<boolean> => {
    if (!user?.id) {
      console.error('Cannot save messages: No user logged in');
      setError("Vous devez être connecté pour sauvegarder des messages.");
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour sauvegarder des messages.",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      clearError(); // Clear any previous errors
      setError(null);
      
      if (!activeConversationId) {
        // Create a new conversation if none is active
        const firstUserMessage = messages.find(m => m.sender === 'user');
        const title = firstUserMessage 
          ? firstUserMessage.text.substring(0, 50) 
          : "Nouvelle conversation";
        console.log('Creating new conversation with title:', title);
        
        const conversationId = await createConversation(title);
        
        if (!conversationId) {
          console.error('Failed to create conversation');
          setError("Impossible de créer une nouvelle conversation.");
          toast({
            title: "Erreur",
            description: "Impossible de créer une nouvelle conversation.",
            variant: "destructive"
          });
          return false;
        }
        
        console.log('Created new conversation:', conversationId);
        return await saveMessages(conversationId, messages);
      } else {
        // Save to existing conversation
        console.log('Saving to existing conversation:', activeConversationId);
        const result = await saveMessages(activeConversationId, messages);
        
        // Update conversation title and last message if there are messages
        if (result && messages.length > 0) {
          const lastMessage = messages[messages.length - 1];
          const firstUserMessage = messages.find(m => m.sender === 'user');
          const title = firstUserMessage 
            ? firstUserMessage.text.substring(0, 50) 
            : 'Nouvelle conversation';
          
          await updateConversation(
            activeConversationId, 
            title,
            lastMessage.text.substring(0, 100)
          );
        }
        
        return result;
      }
    } catch (error) {
      console.error('Error in saveMessagesWithConversation:', error);
      setError("Impossible de sauvegarder la conversation.");
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la conversation.",
        variant: "destructive"
      });
      return false;
    }
  }, [activeConversationId, createConversation, saveMessages, updateConversation, user?.id, toast, clearError]);

  // Retry loading conversations
  const retryLoadConversations = useCallback(() => {
    if (user?.id) {
      setIsLoadingHistory(true);
      setError(null);
      loadConversations()
        .then(() => {
          setError(null);
        })
        .catch(err => {
          console.error('Error retrying load conversations:', err);
          setError("Impossible de charger vos conversations.");
        })
        .finally(() => setIsLoadingHistory(false));
    }
  }, [user?.id, loadConversations]);

  return {
    conversations,
    activeConversationId,
    isLoading: isLoadingConversations || isLoadingHistory || isLoadingMessages || isSavingMessages,
    isInitialized,
    error,
    createConversation,
    deleteConversation,
    loadConversations,
    retryLoadConversations,
    loadMessages,
    saveMessages: saveMessagesWithConversation,
    setActiveConversationId,
    clearError: useCallback(() => {
      setError(null);
      clearError();
    }, [clearError])
  };
}
