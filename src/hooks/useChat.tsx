
import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';

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
      text: content,
      content: content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      role: 'user',
      conversation_id: 'default'
    };
    
    // Add user message
    addMessage(userMessage);
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        text: `This is an automated response to "${content}"`,
        content: `This is an automated response to "${content}"`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        role: 'assistant',
        conversation_id: 'default'
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
