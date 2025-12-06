
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/chat';

export const useCoachMessages = (conversationId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addMessage = (text: string, sender: 'system' | 'user' | 'assistant') => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      conversationId: conversationId,
      content: text,
      text, // Keep for backward compatibility
      sender,
      role: sender,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  return {
    messages,
    setMessages,
    addMessage
  };
};

export default useCoachMessages;
