
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/chat';
import { useState, useCallback } from 'react';

export const useCoachChatActions = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addUserMessage = useCallback((text: string, conversationId: string): ChatMessage => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      text,
      content: text,
      sender: 'user',
      role: 'user',
      conversation_id: conversationId,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const addAssistantMessage = useCallback((text: string, conversationId: string): ChatMessage => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      text,
      content: text,
      sender: 'assistant',
      role: 'assistant',
      conversation_id: conversationId,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const addSystemMessage = useCallback((text: string, conversationId: string): ChatMessage => {
    const newMessage: ChatMessage = {
      id: uuidv4(), 
      text,
      content: text,
      sender: 'system',
      role: 'system',
      conversation_id: conversationId,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const removeMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  }, []);

  return {
    messages,
    isLoading,
    setIsLoading,
    addUserMessage,
    addAssistantMessage,
    addSystemMessage,
    clearMessages,
    removeMessage
  };
};

export default useCoachChatActions;
