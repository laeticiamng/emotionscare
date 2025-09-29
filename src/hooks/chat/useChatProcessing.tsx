
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ChatResponse } from '@/types/chat';
import useUserContext from './useUserContext';

interface UseChatProcessingResult {
  isProcessing: boolean;
  processMessage: (text: string) => Promise<ChatResponse>;
}

const useChatProcessing = (): UseChatProcessingResult => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { user } = useAuth();
  const { userContext } = useUserContext();

  const processMessage = useCallback(async (text: string): Promise<ChatResponse> => {
    setIsProcessing(true);
    
    try {
      // Here we would normally make an API call to process the message
      // For now, we'll just simulate a response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Default response
      const response: ChatResponse = {
        message: "Je suis désolé, je ne peux pas traiter votre demande pour le moment.",
        recommendations: []
      };

      // Simple keyword-based responses for demo purposes
      if (text.toLowerCase().includes('bonjour') || text.toLowerCase().includes('salut')) {
        response.message = `Bonjour${user?.name ? ' ' + user.name : ''}! Comment puis-je vous aider aujourd'hui?`;
      } else if (text.toLowerCase().includes('stress') || text.toLowerCase().includes('anxiété')) {
        response.message = "Je détecte que vous parlez de stress. Voici quelques techniques de respiration qui pourraient vous aider.";
        response.recommendations = [
          "Respirez profondément pendant 4 secondes, retenez 4 secondes, expirez 4 secondes",
          "Essayez une courte session de méditation guidée",
          "Faites une pause de 5 minutes loin de votre écran"
        ];
      } else if (text.toLowerCase().includes('fatigue') || text.toLowerCase().includes('épuisé')) {
        response.message = "La fatigue peut affecter votre bien-être émotionnel. Je vous suggère:";
        response.recommendations = [
          "Assurez-vous de dormir 7-8 heures par nuit",
          "Faites une courte sieste de 20 minutes si possible",
          "Limitez votre consommation de caféine après midi"
        ];
      } else {
        response.message = "Je comprends votre message. Comment puis-je vous aider davantage?";
      }
      
      return response;
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        message: "Une erreur est survenue lors du traitement de votre message. Veuillez réessayer.",
      };
    } finally {
      setIsProcessing(false);
    }
  }, [user]);
  
  return {
    isProcessing,
    processMessage
  };
};

export default useChatProcessing;
