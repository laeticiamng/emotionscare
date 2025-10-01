// @ts-nocheck

// @ts-nocheck
import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';

export const useCoachChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = useCallback(async (content: string): Promise<string> => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const coachResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Merci pour votre message. Comment puis-je vous aider aujourd\'hui ?',
        sender: 'coach',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, coachResponse]);
      return coachResponse.content;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  return {
    messages,
    sendMessage,
    addMessage,
    isProcessing
  };
};
