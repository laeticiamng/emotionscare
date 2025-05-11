
import { useState } from 'react';
import { ChatMessage } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addUserMessage = (text: string): ChatMessage => {
    const message: ChatMessage = {
      id: uuidv4(),
      text,
      sender: 'user',
      timestamp: new Date().toISOString(), // Convert Date to string
      is_read: true
    };

    setMessages(prev => [...prev, message]);
    return message;
  };

  const addBotMessage = (text: string): ChatMessage => {
    const message: ChatMessage = {
      id: uuidv4(),
      text,
      sender: 'bot',
      timestamp: new Date().toISOString(), // Convert Date to string
      is_read: true
    };

    setMessages(prev => [...prev, message]);
    return message;
  };

  const addSystemMessage = (text: string): ChatMessage => {
    const message: ChatMessage = {
      id: uuidv4(),
      text,
      sender: 'system',
      timestamp: new Date().toISOString(), // Convert Date to string
      is_read: true
    };

    setMessages(prev => [...prev, message]);
    return message;
  };

  const addCoachMessage = (text: string): ChatMessage => {
    const message: ChatMessage = {
      id: uuidv4(),
      text,
      sender: 'coach',
      timestamp: new Date().toISOString(), // Convert Date to string
      is_read: true
    };

    setMessages(prev => [...prev, message]);
    return message;
  };

  const removeMessage = (id: string) => {
    setMessages(prev => prev.filter(message => message.id !== id));
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    setMessages,
    addUserMessage,
    addBotMessage,
    addSystemMessage,
    addCoachMessage,
    removeMessage,
    clearMessages,
  };
};

export default useChatMessages;
