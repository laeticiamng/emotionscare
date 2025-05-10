
import { useState, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';
import chatHistoryService from '@/lib/chat/chatHistoryService';

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
      const newMessage = await chatHistoryService.addMessageToConversation(
        message.conversation_id,
        message
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
