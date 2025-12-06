
import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types';

// Simulate API response delay
const mockDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useChatProcessing = (
  conversationId: string = 'default'
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processMessage = useCallback(
    async (message: string): Promise<ChatMessage> => {
      setIsProcessing(true);
      setError(null);

      try {
        // Simulate API call delay
        await mockDelay(1000);
        
        const userMessage: ChatMessage = {
          id: `user-${Date.now()}`,
          text: message,
          content: message,
          sender: 'user',
          timestamp: new Date().toISOString(), // Use ISO string instead of Date
          conversationId // Include the conversation ID
        };

        // Simulate getting assistant response
        await mockDelay(1500);
        
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          text: `Reply to: "${message}"`,
          content: `Reply to: "${message}"`,
          sender: 'assistant',
          timestamp: new Date().toISOString(), // Use ISO string instead of Date
          conversationId // Include the conversation ID
        };

        return assistantMessage;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [conversationId]
  );

  return {
    isProcessing,
    error,
    processMessage,
    setIsProcessing
  };
};
