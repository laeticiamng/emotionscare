
// Fix missing parameters in useCoachChat.tsx
import { useState, useCallback } from 'react';
import { useCoach } from '@/contexts/coach/CoachContextProvider';

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
        const updatedMessages = [...prevMessages, { text: message, sender: 'user' }];
        return [...updatedMessages, { text: response, sender: 'assistant' }];
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
    setMessages(prevMessages => [...prevMessages, { text, sender }]);
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
