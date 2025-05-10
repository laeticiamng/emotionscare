
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage, ChatResponse, ChatContext } from '@/types/chat';

export function useChat(): ChatContext {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Add a message to the chat
  const addMessage = useCallback((message: Omit<ChatMessage, 'id'>) => {
    setMessages(prevMessages => [
      ...prevMessages,
      {
        id: uuidv4(),
        ...message
      }
    ]);
  }, []);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Send a message and get a response
  const handleSend = useCallback(async (message: string): Promise<ChatResponse> => {
    setIsLoading(true);
    
    // Add user message
    addMessage({
      sender: 'user',
      sender_id: 'user-1',
      conversation_id: 'conversation-1',
      content: message,
      is_read: true,
      timestamp: new Date()
    });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response: ChatResponse = {
        message: "Voici une réponse simulée du coach IA.",
        emotion: "neutral",
        confidence: 0.9,
        text: "Voici une réponse simulée du coach IA.",
        follow_up_questions: [
          "Comment vous sentez-vous aujourd'hui ?",
          "Avez-vous pratiqué une activité relaxante récemment ?"
        ]
      };
      
      // Add AI response
      addMessage({
        sender: 'bot',
        sender_id: 'coach-ai',
        conversation_id: 'conversation-1',
        content: response.message,
        is_read: true,
        timestamp: new Date()
      });
      
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'obtenir une réponse du coach IA.",
        variant: "destructive"
      });
      
      return {
        message: "Désolé, une erreur s'est produite."
      };
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, toast]);

  return {
    messages,
    isLoading,
    handleSend,
    addMessage,
    clearMessages
  };
}
