
import { useState, useCallback } from 'react';
import { ChatMessage, ChatResponse, ChatContext } from '@/types';
import { useToast } from './use-toast';
import { v4 as uuidv4 } from 'uuid';

interface UseChatOptions {
  initialMessages?: ChatMessage[];
  onError?: (error: Error) => void;
}

const useChat = (options: UseChatOptions = {}) => {
  const { initialMessages = [] } = options;
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Function to handle sending a message to the AI
  const handleSend = useCallback(async (message: string) => {
    try {
      setIsLoading(true);
      
      // Here you would typically make an API call to your AI service
      // This is a mock implementation
      const response: ChatResponse = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            message: `This is a response to: "${message}"`,
            text: `This is a response to: "${message}"`,
            recommendations: ["Try meditation", "Listen to calming music"],
            follow_up_questions: ["How are you feeling now?", "Would you like some music recommendations?"]
          });
        }, 1000);
      });

      return response;
    } catch (error) {
      console.error('Error sending chat message:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send message. Please try again.',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const addMessage = useCallback((message: Omit<ChatMessage, 'id'>) => {
    setMessages((prev) => [...prev, { ...message, id: uuidv4() }]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    handleSend,
    addMessage,
    clearMessages,
  };
};

export default useChat;
