
import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';

export const useCoachChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addMessage = useCallback((content: string, sender: 'user' | 'assistant') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const sendMessage = useCallback(async (content: string): Promise<string | undefined> => {
    if (!content.trim()) return;

    // Add user message
    addMessage(content, 'user');
    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = `Merci pour votre message: "${content}". Comment puis-je vous aider davantage ?`;
      addMessage(response, 'assistant');
      
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('Désolé, une erreur est survenue. Veuillez réessayer.', 'assistant');
    } finally {
      setIsProcessing(false);
    }
  }, [addMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    sendMessage,
    addMessage,
    clearMessages,
    isProcessing
  };
};
