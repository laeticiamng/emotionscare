
import { useState, useCallback } from 'react';
import { ChatMessage, ChatConversation } from '@/types/chat';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null);

  const sendMessage = useCallback(async (text: string): Promise<ChatMessage> => {
    setIsLoading(true);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: `Je comprends votre message : "${text}". Comment puis-je vous aider davantage ?`,
        sender: 'coach',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      return aiResponse;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    currentConversation,
    setCurrentConversation
  };
};
