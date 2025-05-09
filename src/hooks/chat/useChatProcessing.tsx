
import { useState } from 'react';
import { ChatResponse } from '@/types/chat';

interface UseChatProcessingResult {
  isProcessing: boolean;
  processMessage: (text: string) => Promise<ChatResponse>;
}

const useChatProcessing = (): UseChatProcessingResult => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processMessage = async (text: string): Promise<ChatResponse> => {
    setIsProcessing(true);
    
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      const response: ChatResponse = {
        message: `Voici ma réponse à: "${text}"`,
        recommendations: ['Prendre une pause', 'Faire une activité relaxante'],
        follow_up_questions: ['Comment vous sentez-vous maintenant?', 'Avez-vous besoin d\'autres conseils?']
      };
      
      return response;
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        message: 'Désolé, je n\'ai pas pu traiter votre message. Veuillez réessayer.'
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    processMessage
  };
};

export default useChatProcessing;
