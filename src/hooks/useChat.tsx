
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ChatResponse, ChatContext } from '@/types/chat';
import { getChatResponse } from '@/services/chatService';

export const useChat = (conversationId: string = ''): ChatContext => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const addMessage = useCallback((message: Omit<ChatMessage, 'id'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: uuidv4(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  }, []);
  
  const handleSend = useCallback(
    async (message: string): Promise<ChatResponse> => {
      try {
        setIsLoading(true);
        
        // Add user message to the chat
        addMessage({
          sender: 'user',
          sender_id: 'user-1',
          conversation_id: conversationId,
          text: message,
          content: message,
          is_read: true,
          timestamp: new Date(),
        });
        
        // Get response from the chat API
        const response = await getChatResponse(message);
        
        // Add bot message to the chat
        addMessage({
          sender: 'bot',
          sender_id: 'bot-1',
          conversation_id: conversationId,
          text: response.message,
          content: response.message,
          is_read: true,
          timestamp: new Date(),
        });
        
        return response;
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, addMessage]
  );
  
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);
  
  return {
    messages,
    isLoading,
    handleSend,
    addMessage,
    clearMessages,
  };
};

export default useChat;
