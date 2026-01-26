// @ts-nocheck

import { useState, useCallback, FormEvent, ChangeEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  ChatMessage,
  ChatHookResult,
  UseChatOptions
} from '@/types/chat';

export function useChat({
  initialMessages = [],
  onError,
  onResponse,
  conversationId,
  initialConversationId,
}: UseChatOptions = {}): ChatHookResult {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Function to add a new message to the state
  const addMessage = useCallback((content: string, sender: 'user' | 'assistant' | 'system') => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      sender,
      content,
      text: content, // Add for backward compatibility
      timestamp: new Date().toISOString(),
      conversationId: conversationId || initialConversationId || uuidv4(),
      conversation_id: conversationId || initialConversationId || uuidv4(), // Add for backward compatibility
    };
    
    setMessages((prev) => [...prev, newMessage]);
    
    return newMessage;
  }, [conversationId, initialConversationId]);

  // Function to clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Event handler for input changes
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  // Send a message and receive a response
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    // Add the user message to the state
    addMessage(text, 'user');
    
    // Clear the input field
    setInput('');
    
    // Set loading state
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call to an AI service
      // Simulating a response with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse = `This is a mock response to "${text}"`;
      
      // Create the response message
      const responseMessage = addMessage(mockResponse, 'assistant');
      
      // Call the onResponse callback if provided
      if (onResponse) {
        onResponse(responseMessage);
      }
    } catch (err) {
      // Error handled below - no logging needed
      
      // Set error state
      const error = err instanceof Error ? err : new Error('Failed to send message');
      setError(error);
      
      // Call the onError callback if provided
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, onError, onResponse]);

  // Event handler for form submissions
  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(input);
  }, [input, sendMessage]);

  return {
    messages,
    input,
    setInput,
    isLoading,
    error,
    sendMessage,
    handleInputChange,
    handleSubmit,
    addMessage,
    clearMessages,
    isTyping: isLoading,
  };
}

export default useChat;
