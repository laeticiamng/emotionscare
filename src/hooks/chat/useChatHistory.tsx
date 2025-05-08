
import { useEffect, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from './useConversations';
import { useMessages } from './useMessages';

/**
 * Main hook for chat history management
 * Combines conversation and message operations
 */
export function useChatHistory() {
  const { user } = useAuth();
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
    if (user?.id) {
      loadConversations();
    }
  }, [user?.id, loadConversations]);

  // Enhanced saveMessages with conversation creation if needed
  const saveMessagesWithConversation = useCallback(async (messages: ChatMessage[]): Promise<boolean> => {
    if (!user?.id) return false;
    
    if (!activeConversationId) {
      // Create a new conversation if none is active
      const firstUserMessage = messages.find(m => m.sender === 'user');
      const title = firstUserMessage ? firstUserMessage.text.substring(0, 50) : "Nouvelle conversation";
      const conversationId = await createConversation(title);
      
      if (!conversationId) return false;
      
      return await saveMessages(conversationId, messages);
    } else {
      // Save to existing conversation
      const result = await saveMessages(activeConversationId, messages);
      
      // Update conversation title and last message if there are messages
      if (result && messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        await updateConversation(
          activeConversationId, 
          // Use first user message as title, or default
          messages.find(m => m.sender === 'user')?.text.substring(0, 50) || 'Nouvelle conversation',
          lastMessage.text.substring(0, 100)
        );
      }
      
      return result;
    }
  }, [activeConversationId, createConversation, saveMessages, updateConversation, user?.id]);

  return {
    conversations,
    activeConversationId,
    isLoading,
    createConversation,
    deleteConversation,
    loadConversations,
    loadMessages,
    saveMessages: saveMessagesWithConversation,
    setActiveConversationId
  };
}
