
import { useState, useCallback } from 'react';
import { ChatMessage, ChatConversation } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

interface UseConversationStateProps {
  initialConversation?: ChatConversation;
  userId?: string;
}

export const useConversationState = ({
  initialConversation,
  userId = 'current-user',
}: UseConversationStateProps = {}) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(
    initialConversation || null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Create a new conversation
  const createNewConversation = useCallback(
    (title = 'New conversation') => {
      const timestamp = new Date().toISOString();
      const conversation: ChatConversation = {
        id: uuidv4(),
        title,
        user_id: userId,
        messages: [],
        created_at: timestamp,
        updated_at: timestamp,
        last_message: '',
        status: 'active'
      };
      
      setConversations((prev) => [conversation, ...prev]);
      setCurrentConversation(conversation);
      
      return conversation;
    },
    [userId]
  );

  // Update a conversation
  const updateConversation = useCallback((conversationId: string, updates: Partial<ChatConversation>) => {
    setConversations((prev) => 
      prev.map((conv) => 
        conv.id === conversationId
          ? { 
              ...conv, 
              ...updates, 
              updated_at: updates.updated_at || new Date().toISOString(),
              last_message: updates.last_message || conv.last_message || '',
            }
          : conv
      )
    );

    if (currentConversation?.id === conversationId) {
      setCurrentConversation((prev) =>
        prev ? { 
          ...prev, 
          ...updates, 
          updated_at: updates.updated_at || new Date().toISOString(),
          last_message: updates.last_message || prev.last_message || '',
        } : prev
      );
    }
  }, [currentConversation]);

  // Add a message to the current conversation
  const addMessageToConversation = useCallback(
    (message: ChatMessage) => {
      if (!currentConversation) return;

      const lastMessageText = message.content || message.text || '';
      
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversation.id
            ? {
                ...conv,
                messages: [...(conv.messages || []), message],
                last_message: lastMessageText,
                updated_at: new Date().toISOString(),
              }
            : conv
        )
      );

      setCurrentConversation((prev) =>
        prev
          ? {
              ...prev,
              messages: [...(prev.messages || []), message],
              last_message: lastMessageText,
              updated_at: new Date().toISOString(),
            }
          : prev
      );
    },
    [currentConversation]
  );

  return {
    conversations,
    setConversations,
    currentConversation,
    setCurrentConversation,
    isLoading,
    setIsLoading,
    createNewConversation,
    updateConversation,
    addMessageToConversation,
  };
};

export default useConversationState;
