
import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';

export function useChatMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Bonjour ! Je suis l'assistant EmotionsCare prêt à vous aider. Que puis-je faire pour vous aujourd'hui ?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);

  const addUserMessage = useCallback((text: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
    return message;
  }, []);

  const addBotMessage = useCallback((text: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
    return message;
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([{
      id: '1',
      text: "Bonjour ! Je suis l'assistant EmotionsCare prêt à vous aider. Que puis-je faire pour vous aujourd'hui ?",
      sender: 'bot',
      timestamp: new Date()
    }]);
  }, []);

  return {
    messages,
    setMessages,
    addUserMessage,
    addBotMessage,
    clearMessages
  };
}
