
import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = useCallback(async (content: string, sender: 'user' | 'assistant' = 'user') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);

    if (sender === 'user') {
      setIsProcessing(true);
      
      // Simulation d'une réponse
      setTimeout(() => {
        const response: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: 'Merci pour votre message. Comment puis-je vous aider ?',
          sender: 'assistant',
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, response]);
        setIsProcessing(false);
      }, 1000);
    }

    return newMessage;
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    sendMessage,
    clearMessages,
    isProcessing
  };
};
