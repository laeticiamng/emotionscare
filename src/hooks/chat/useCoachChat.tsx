// @ts-nocheck

import { useState, useCallback } from 'react';
import { useCoach } from '@/contexts/coach';
import { useAI } from '@/hooks/useAI';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/chat';
import { logger } from '@/lib/logger';

export const useCoachChat = () => {
  const coach = useCoach();
  const ai = useAI();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Use loading state from coach context
  const loading = coach.loading || false;
  
  const sendMessage = useCallback(async (message: string) => {
    try {
      setIsProcessing(true);
      // Use our AI client to process the message
      const response = await ai.openaiText(message);
      
      setMessages(prevMessages => {
        const userMessage: ChatMessage = {
          id: uuidv4(),
          conversationId: 'coach',
          sender: 'user',
          content: message,
          timestamp: new Date().toISOString()
        };

        const assistantMessage: ChatMessage = {
          id: uuidv4(),
          conversationId: 'coach',
          sender: 'assistant',
          content: response,
          timestamp: new Date().toISOString()
        };

        return [...prevMessages, userMessage, assistantMessage];
      });
      return response;
    } catch (error) {
      logger.error('Error sending message', error as Error, 'UI');
      return '';
    } finally {
      setIsProcessing(false);
    }
  }, [ai]);
  
  const addMessage = useCallback((text: string, sender: 'system' | 'user' | 'assistant' | 'coach') => {
    const newMessage: ChatMessage = { 
      id: uuidv4(),
      conversationId: 'coach',
      sender,
      content: text,
      timestamp: new Date().toISOString()
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    return newMessage;
  }, []);
  
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);
  
  return {
    messages,
    sendMessage,
    isProcessing,
    loading,
    addMessage,
    clearMessages,
  };
};

export default useCoachChat;
