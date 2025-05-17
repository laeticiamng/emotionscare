
// Fix missing parameters in useCoachChat.tsx
import { useState, useCallback } from 'react';
import { useCoach } from '@/contexts/coach/CoachContextProvider';

export const useCoachChat = () => {
  const coach = useCoach();
  const [messages, setMessages] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Add loading state since it was referenced but not defined
  const [loading, setLoading] = useState<boolean>(false);
  
  const sendMessage = useCallback(async (message: string, history: any[] = []) => {
    try {
      setIsProcessing(true);
      setLoading(true);
      // Add the second parameter that was missing
      const response = await coach.sendMessage(message, history);
      
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, { text: message, sender: 'user' }];
        return [...updatedMessages, { text: response, sender: 'coach' }];
      });
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  }, [coach]);
  
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
