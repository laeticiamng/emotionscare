
import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types';

export function useChatMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Bonjour ! Je suis l'assistant EmotionsCare prêt à vous aider. Que puis-je faire pour vous aujourd'hui ?",
      sender: 'bot',
      timestamp: new Date(),
      sender_id: 'system',
      conversation_id: 'initial',
      content: "Bonjour ! Je suis l'assistant EmotionsCare prêt à vous aider. Que puis-je faire pour vous aujourd'hui ?",
      is_read: true
    }
  ]);

  const addUserMessage = useCallback((text: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      sender_id: 'user',
      conversation_id: 'current',
      content: text,
      is_read: true
    };
    
    setMessages(prev => [...prev, message]);
    return message;
  }, []);

  const addBotMessage = useCallback((text: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date(),
      sender_id: 'system',
      conversation_id: 'current',
      content: text,
      is_read: true
    };
    
    setMessages(prev => [...prev, message]);
    return message;
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([{
      id: '1',
      text: "Bonjour ! Je suis l'assistant EmotionsCare prêt à vous aider. Que puis-je faire pour vous aujourd'hui ?",
      sender: 'bot',
      timestamp: new Date(),
      sender_id: 'system',
      conversation_id: 'initial',
      content: "Bonjour ! Je suis l'assistant EmotionsCare prêt à vous aider. Que puis-je faire pour vous aujourd'hui ?",
      is_read: true
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
