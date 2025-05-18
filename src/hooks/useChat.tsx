
import { useState, useCallback } from 'react';
import {
  ChatMessage,
  ChatHookResult,
  UseChatOptions,
  normalizeChatMessage
} from '@/types/chat';

// Previous useChat implementation with fix for message creation
export const useChat = (
  options: UseChatOptions = {}
): ChatHookResult => {
  const { initialMessages = [], initialConversationId = '' } = options;

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(
    initialConversationId || `conv-${Date.now()}`
  );
  
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

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!input.trim()) return;
      sendMessage(input);
      setInput('');
    },
    [input, sendMessage]
  );
  
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
    setConversation,
    input,
    setInput,
    handleInputChange,
    handleSubmit
  };
};

// Add default export to fix import errors
export default useChat;
