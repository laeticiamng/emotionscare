
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ChatResponse } from '@/types/chat';

export function useChatProcessing() {
  const [isProcessing, setIsProcessing] = useState(false);

  // Process a user message and get AI response
  const processMessage = useCallback(async (
    message: string, 
    aiResponseFn: (msg: string) => Promise<ChatResponse>
  ): Promise<[ChatMessage, ChatMessage]> => {
    setIsProcessing(true);
    
    try {
      // Create user message
      const userMessage: ChatMessage = {
        id: uuidv4(),
        content: message,
        text: message,
        sender: 'user',
        role: 'user',
        timestamp: new Date().toISOString(),
        conversation_id: 'default'
      };
      
      // Get AI response
      const aiResponse = await aiResponseFn(message);
      
      // Create AI message
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        content: aiResponse.content || aiResponse.message || '',
        text: aiResponse.content || aiResponse.message || '',
        sender: 'assistant',
        role: 'assistant',
        timestamp: new Date().toISOString(),
        conversation_id: 'default'
      };
      
      return [userMessage, aiMessage];
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Return error message
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        content: 'Sorry, an error occurred. Please try again.',
        text: 'Sorry, an error occurred. Please try again.',
        sender: 'assistant',
        role: 'assistant',
        timestamp: new Date().toISOString(),
        conversation_id: 'default',
        isError: true
      };
      
      return [
        {
          id: uuidv4(),
          content: message,
          text: message,
          sender: 'user',
          role: 'user',
          timestamp: new Date().toISOString(),
          conversation_id: 'default'
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
