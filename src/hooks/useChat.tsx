import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';
import { normalizeChatMessage } from '@/types/chat'; // Import our normalization utility

// Previous useChat implementation with fix for message creation
export const useChat = (initialConversationId = '') => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(initialConversationId || `conv-${Date.now()}`);
  
  // Send user message
  const sendMessage = useCallback((text: string) => {
    setIsLoading(true);
    
    // Create a properly normalized user message
    const userMessage = normalizeChatMessage({
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date().toISOString()
    }, conversationId);
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate response
    setTimeout(() => {
      // Create a properly normalized assistant message
      const assistantMessage = normalizeChatMessage({
        id: `assistant-${Date.now()}`,
        text: `Echo: ${text}`,
        sender: 'assistant',
        timestamp: new Date().toISOString()
      }, conversationId);
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  }, [conversationId]);
  
  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);
  
  // Set conversation ID
  const setConversation = useCallback((id: string) => {
    setConversationId(id);
  }, []);
  
  return {
    messages,
    isLoading,
    sendMessage,
    conversationId,
    clearMessages,
    setConversation: setConversation
  };
};
