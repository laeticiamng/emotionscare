
import { useState } from 'react';
import { ChatMessage } from '@/types/chat';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (content: string, sender: ChatMessage['sender'] = 'user') => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, message]);

    if (sender === 'user') {
      setIsTyping(true);
      
      setTimeout(() => {
        const response: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: 'Merci pour votre message. Comment puis-je vous aider ?',
          sender: 'assistant',
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, response]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isTyping,
    sendMessage,
    clearMessages
  };
};
