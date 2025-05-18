
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/chat';

export const useCoachChatActions = (conversationId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addUserMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      conversationId: conversationId,
      conversation_id: conversationId, // Pour compatibilité
      text,
      content: text,
      sender: 'user',
      role: 'user',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const addAssistantMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      conversationId: conversationId,
      conversation_id: conversationId, // Pour compatibilité
      text,
      content: text,
      sender: 'assistant',
      role: 'assistant',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const addSystemMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      conversationId: conversationId,
      conversation_id: conversationId, // Pour compatibilité
      text,
      content: text,
      sender: 'system',
      role: 'system',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  return {
    messages,
    setMessages,
    addUserMessage,
    addAssistantMessage,
    addSystemMessage
  };
};

export default useCoachChatActions;
