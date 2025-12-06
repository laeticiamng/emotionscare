// @ts-nocheck

import { useState, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';
import { chatHistoryService, conversationsService } from '@/lib/chat/services';

export const useMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      if (!conversationId) {
        setMessages([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const conversationMessages = await chatHistoryService.getMessagesForConversation(conversationId);
        setMessages(conversationMessages);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load messages'));
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [conversationId]);

  const addMessage = async (message: Omit<ChatMessage, 'id'>) => {
    try {
      // Convert any Date to string if needed
      const messageWithStringTimestamp = {
        ...message,
        timestamp: typeof message.timestamp === 'object'
          ? (message.timestamp as Date).toISOString()
          : message.timestamp
      };
      
      const newMessage = await chatHistoryService.addMessageToConversation(
        messageWithStringTimestamp.conversationId!,
        messageWithStringTimestamp
      );
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      return newMessage;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add message'));
      throw err;
    }
  };

  return { messages, isLoading, error, addMessage };
};

export default useMessages;
