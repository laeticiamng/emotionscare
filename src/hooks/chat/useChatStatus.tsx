
import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';

/**
 * Hook for managing chat loading state
 */
export function useChatStatus() {
  const [isLoading, setIsLoading] = useState(false);
  
  // Send message function wrapper that handles loading state
  const sendMessage = useCallback(async (
    messageText: string,
    addUserMessage: (message: ChatMessage) => void,
    addBotMessage: (message: ChatMessage) => void,
    apiFunction: (messageText: string) => Promise<string>,
    clearTypingIndicator: () => void
  ) => {
    setIsLoading(true);
    try {
      // Add the user message
      const userMessageObj: ChatMessage = {
        id: Date.now().toString(),
        text: messageText,
        sender: 'user',
        timestamp: new Date(),
      };
      
      addUserMessage(userMessageObj);
      clearTypingIndicator();
      
      // Get a response from the API
      const response = await apiFunction(messageText);
      
      // Add the response
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      addBotMessage(botResponse);
      
      return response;
    } catch (error) {
      console.error('Error in chat:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Regenerate response function wrapper that handles loading state
  const regenerateResponse = useCallback(async (
    messages: ChatMessage[],
    addBotMessage: (message: ChatMessage) => void,
    apiFunction: (messageText: string) => Promise<string>
  ) => {
    setIsLoading(true);
    try {
      // Get the last user message
      const lastUserMessage = [...messages].reverse().find(msg => msg.sender === 'user');
      if (!lastUserMessage) return null;
      
      // Get a new response
      const response = await apiFunction(lastUserMessage.text);
      
      // Add the new response
      const botResponse: ChatMessage = {
        id: Date.now().toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      addBotMessage(botResponse);
      return response;
    } catch (error) {
      console.error('Error regenerating response:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return {
    isLoading,
    setIsLoading,
    sendMessage,
    regenerateResponse
  };
}
