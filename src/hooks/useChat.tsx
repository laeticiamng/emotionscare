
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ChatResponse } from '@/types/chat';
import * as ChatService from '@/services/chatService';

export const useChat = (conversationId: string, userId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (messageText: string): Promise<ChatResponse> => {
    setIsLoading(true);

    try {
      // Save user message
      const userMessage: ChatMessage = {
        id: uuidv4(),
        conversation_id: conversationId,
        sender: 'user',
        text: messageText,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMessage]);

      // Get AI response
      const response = await ChatService.getChatResponse(messageText);

      // Save AI message
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        conversation_id: conversationId,
        sender: 'assistant',
        text: response.text || "Sorry, I couldn't understand that.",
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      return {
        content: response.text,
        emotion: response.sentiment || 'neutral'
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        content: 'Sorry, I encountered an error. Please try again.',
        emotion: 'error'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const addMessage = (messageData: Omit<ChatMessage, 'id'>) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      ...messageData
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isLoading,
    handleSend,
    addMessage,
    clearMessages
  };
}

export default useChat;
