
// Fix missing parameters in useCoachChat.tsx
import { useState, useCallback } from 'react';
import { useCoach } from '@/contexts/coach/CoachContextProvider';
import { v4 as uuidv4 } from 'uuid';

export const useCoachChat = () => {
  const coach = useCoach();
  const [messages, setMessages] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Use loading state from coach context
  const loading = coach.loading || false;
  
  const sendMessage = useCallback(async (message: string) => {
    try {
      setIsProcessing(true);
      // Use the existing messages as history
      const response = await coach.sendMessage(message, messages);
      
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, { 
          id: uuidv4(),
          conversationId: 'coach',
          sender: 'user', 
          text: message,
          content: message,
          timestamp: new Date().toISOString() 
        }];
        return [...updatedMessages, { 
          id: uuidv4(), 
          conversationId: 'coach',
          sender: 'assistant', 
          text: response,
          content: response,
          timestamp: new Date().toISOString() 
        }];
      });
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [coach, messages]);
  
  const addMessage = useCallback((text: string, sender: 'system' | 'user' | 'ai' | 'assistant') => {
    setMessages(prevMessages => [...prevMessages, { 
      id: uuidv4(),
      conversationId: 'coach',
      sender, 
      text, 
      content: text,
      timestamp: new Date().toISOString() 
    }]);
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
