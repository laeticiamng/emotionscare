
import { useState, useEffect } from 'react';
import { ChatConversation } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';
import { useConversationLoader } from './useConversationLoader';
import { useConversationManagement } from './useConversationManagement';

/**
 * Composite hook for managing chat conversations
 * Combines conversation loading and management
 */
export function useConversations() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Compose functionality from smaller hooks
  const { loadConversations, isLoading: isLoadingConversations } = useConversationLoader(user?.id);
  const { 
    createConversation: createConversationAction, 
    deleteConversation: deleteConversationAction,
    updateConversation,
    isLoading: isProcessingAction 
  } = useConversationManagement(user?.id);
  
  // Combined loading state
  const isLoading = isLoadingConversations || isProcessingAction;
  
  // Load conversations on mount or when user changes
  useEffect(() => {
    if (user?.id) {
      loadAndSetConversations();
    }
  }, [user?.id]);
  
  // Load conversations and update state
  const loadAndSetConversations = async () => {
    const userConversations = await loadConversations();
    setConversations(userConversations);
    
    // If no active conversation is set but we have conversations, set the first one as active
    if (!activeConversationId && userConversations.length > 0) {
      console.log('Setting first conversation as active:', userConversations[0].id);
      setActiveConversationId(userConversations[0].id);
    }
  };
  
  // Create conversation wrapper that also updates state
  const createConversation = async (title?: string): Promise<string | null> => {
    const conversationId = await createConversationAction(title);
    
    if (conversationId) {
      // Reload conversations to update the list
      await loadAndSetConversations();
      
      // Set the new conversation as active
      setActiveConversationId(conversationId);
    }
    
    return conversationId;
  };
  
  // Delete conversation wrapper that also updates state
  const deleteConversation = async (conversationId: string): Promise<boolean> => {
    const success = await deleteConversationAction(conversationId);
    
    if (success) {
      // Clear the active conversation if the deleted one was active
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
      }
      
      // Reload conversations to update the list
      await loadAndSetConversations();
    }
    
    return success;
  };
  
  // Update conversation wrapper that also updates local state
  const updateConversationWithState = async (
    conversationId: string, 
    lastMessage: string
  ): Promise<boolean> => {
    const success = await updateConversation(conversationId, lastMessage);
    
    if (success) {
      // Update local state to reflect the changes without fetching the whole list again
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === conversationId 
            ? {...conv, lastMessage, updatedAt: new Date()} 
            : conv
        )
      );
    }
    
    return success;
  };

  return {
    conversations,
    activeConversationId,
    isLoading,
    setActiveConversationId,
    loadConversations: loadAndSetConversations,
    createConversation,
    deleteConversation,
    updateConversation: updateConversationWithState
  };
}
