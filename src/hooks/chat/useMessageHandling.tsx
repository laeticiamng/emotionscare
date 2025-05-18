
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { ChatMessage } from '@/types/chat';

export const useMessageHandling = (conversationId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const addMessage = (text: string, role: 'user' | 'assistant' | 'system') => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      conversationId: conversationId,
      conversation_id: conversationId, // Pour compatibilité
      text,
      sender: role,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    return newMessage;
  };
  
  const clearMessages = () => {
    setMessages([]);
  };
  
  return {
    messages,
    setMessages,
    addMessage,
    clearMessages
  };
};

export default useMessageHandling;
