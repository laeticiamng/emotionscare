
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useConversationState } from './useConversationState';
import { useMessageHandling } from './useMessageHandling';

/**
 * Main hook for managing chat history
 * Combines conversation state and message handling
 */
export function useChatHistory() {
  const { user } = useAuth();
  const { 
    conversations,
    activeConversationId,
    setActiveConversationId,
    isLoading,
    error,
    loadConversations,
    createConversation,
    deleteConversation,
    retryLoadConversations
  } = useConversationState(user?.id);
  
  const { loadMessages, saveMessages } = useMessageHandling();
  
  // Load all conversations on component mount
  useEffect(() => {
    if (user?.id) {
      loadConversations();
    }
  }, [user?.id, loadConversations]);
  
  // Enhanced saveMessages that includes user context
  const handleSaveMessages = async (messages: any[]) => {
    return await saveMessages(activeConversationId!, user?.id, messages);
  };
  
  return {
    conversations,
    activeConversationId,
    setActiveConversationId,
    isLoading,
    error,
    createConversation,
    loadMessages,
    saveMessages: handleSaveMessages,
    deleteConversation,
    retryLoadConversations
  };
}
