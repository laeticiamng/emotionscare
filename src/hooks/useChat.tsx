
import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/other';

interface UseChatOptions {
  initialMessages?: ChatMessage[];
}

export const useChat = ({ initialMessages = [] }: UseChatOptions = {}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prevMessages => [...prevMessages, message]);
  }, []);

  const handleSend = useCallback((content: string) => {
    // Create user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    
    // Add user message
    addMessage(userMessage);
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: `This is an automated response to "${content}"`,
        timestamp: new Date().toISOString()
      };
      
      addMessage(aiMessage);
    }, 1000);
  }, [addMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    addMessage,
    handleSend,
    clearMessages
  };
};

export default useChat;
