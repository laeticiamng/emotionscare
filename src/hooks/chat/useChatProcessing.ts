
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ChatResponse } from '@/types/chat';

export interface UseChatProcessingProps {
  onProcessingStart?: () => void;
  onProcessingComplete?: (response: string) => void;
  onError?: (error: Error) => void;
}

export const useChatProcessing = ({
  onProcessingStart,
  onProcessingComplete,
  onError
}: UseChatProcessingProps = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const processMessage = async (message: string, conversationId: string): Promise<string | null> => {
    setIsProcessing(true);
    onProcessingStart?.();
    setError(null);

    try {
      // Création du message utilisateur
      const userMessage: ChatMessage = {
        id: uuidv4(),
        conversationId: conversationId,
        conversation_id: conversationId, // Pour compatibilité
        content: message,
        text: message,
        sender: 'user',
        role: 'user',
        timestamp: new Date().toISOString()
      };

      // Simuler un appel API pour traiter le message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const responseText = `Ceci est une réponse simulée au message: "${message}"`;
      
      // Création du message assistant
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        conversationId: conversationId,
        conversation_id: conversationId, // Pour compatibilité
        content: responseText,
        text: responseText,
        sender: 'assistant',
        role: 'assistant',
        timestamp: new Date().toISOString()
      };

      onProcessingComplete?.(responseText);
      return responseText;
    } catch (e) {
      const errorObj = e instanceof Error ? e : new Error('Une erreur est survenue lors du traitement du message');
      setError(errorObj);
      onError?.(errorObj);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processMessage,
    isProcessing,
    error
  };
};

export default useChatProcessing;
