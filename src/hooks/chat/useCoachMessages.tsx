
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/chat';

export function useCoachMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(uuidv4());

  const addMessage = useCallback((message: string, role: 'user' | 'system' | 'assistant' = 'user') => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      text: message,
      content: message,
      sender: role,
      role: role,
      conversation_id: currentConversationId,
      timestamp: new Date().toISOString()
    };
    
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    return newMessage;
  }, [currentConversationId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentConversationId(uuidv4());
  }, []);

  const startNewConversation = useCallback(() => {
    const newConversationId = uuidv4();
    setCurrentConversationId(newConversationId);
    return newConversationId;
  }, []);

  return {
    messages,
    isLoading,
    setIsLoading,
    addMessage,
    clearMessages,
    currentConversationId,
    startNewConversation
  };
}

export default useCoachMessages;
