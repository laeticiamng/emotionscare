
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
  
  const {
    conversations,
    activeConversationId,
    isLoading,
    setActiveConversationId,
    loadConversations,
    createConversation,
    deleteConversation,
    updateConversation
  } = useConversations();
  
  const { loadMessages, saveMessages } = useMessages();

  // Load initial conversations
  useEffect(() => {
    if (user?.id && !isInitialized) {
      console.log('Loading initial conversations for user:', user.id);
      loadConversations().then(() => setIsInitialized(true));
    }
  }, [user?.id, loadConversations, isInitialized]);

  // Enhanced saveMessages with conversation creation if needed
  const saveMessagesWithConversation = useCallback(async (messages: ChatMessage[]): Promise<boolean> => {
    if (!user?.id) {
      console.error('Cannot save messages: No user logged in');
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour sauvegarder des messages.",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      if (!activeConversationId) {
        // Create a new conversation if none is active
        const firstUserMessage = messages.find(m => m.sender === 'user');
        const title = firstUserMessage ? firstUserMessage.text.substring(0, 50) : "Nouvelle conversation";
        console.log('Creating new conversation with title:', title);
        
        const conversationId = await createConversation(title);
        
        if (!conversationId) {
          console.error('Failed to create conversation');
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
          const title = messages.find(m => m.sender === 'user')?.text.substring(0, 50) || 'Nouvelle conversation';
          
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
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la conversation.",
        variant: "destructive"
      });
      return false;
    }
  }, [activeConversationId, createConversation, saveMessages, updateConversation, user?.id, toast]);

  // Load messages for active conversation
  const loadActiveConversationMessages = useCallback(async (): Promise<ChatMessage[]> => {
    if (!activeConversationId) {
      console.warn('No active conversation to load messages from');
      return [];
    }
    
    return await loadMessages(activeConversationId);
  }, [activeConversationId, loadMessages]);

  return {
    conversations,
    activeConversationId,
    isLoading,
    isInitialized,
    createConversation,
    deleteConversation,
    loadConversations,
    loadMessages,
    loadActiveConversationMessages,
    saveMessages: saveMessagesWithConversation,
    setActiveConversationId
  };
}
