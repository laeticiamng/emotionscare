
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ChatResponseType } from '@/types/chat';

export function useChatProcessing() {
  const [isProcessing, setIsProcessing] = useState(false);

  // Process a user message and get AI response
  const processMessage = useCallback(async (
    message: string, 
    aiResponseFn: (msg: string) => Promise<ChatResponseType>
  ): Promise<[ChatMessage, ChatMessage]> => {
    setIsProcessing(true);
    
    try {
      // Create user message
      const userMessage: ChatMessage = {
        id: uuidv4(),
        content: message,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      
      // Get AI response
      const aiResponse = await aiResponseFn(message);
      
      // Create AI message
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        content: aiResponse.content || aiResponse.message || '',
        sender: 'assistant',
        timestamp: new Date().toISOString()
      };
      
      return [userMessage, aiMessage];
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Return error message
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        content: 'Sorry, an error occurred. Please try again.',
        sender: 'assistant',
        timestamp: new Date().toISOString()
      };
      
      return [
        {
          id: uuidv4(),
          content: message,
          sender: 'user',
          timestamp: new Date().toISOString()
        }, 
        errorMessage
      ];
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    isProcessing,
    processMessage
  };
}

export default useChatProcessing;
