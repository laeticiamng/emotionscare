
import { useState } from 'react';
import { openai } from '@/services';
import { useToast } from '@/hooks/use-toast';

interface OpenAIOptions {
  cacheResults?: boolean;
  temperature?: number;
  maxTokens?: number;
}

export function useOpenAI() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Génère du texte avec OpenAI
   */
  const generateText = async (prompt: string, options: OpenAIOptions = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await openai.generateText(prompt, options);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: "Erreur lors de la génération de texte",
        description: error.message,
        variant: "destructive"
      });
      return '';
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Traite une conversation complète avec OpenAI
   */
  const chatCompletion = async (messages: any[], options: OpenAIOptions = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await openai.chatCompletion(messages, options);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: "Erreur de communication avec l'IA",
        description: error.message,
        variant: "destructive"
      });
      return '';
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Génère une image avec DALL-E
   */
  const generateImage = async (prompt: string, options: any = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const imageUrl = await openai.generateImage(prompt, options);
      return imageUrl;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: "Erreur lors de la génération d'image",
        description: error.message,
        variant: "destructive"
      });
      return '';
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Analyse une émotion à partir d'un texte
   */
  const analyzeEmotion = async (text: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const analysis = await openai.analyzeEmotion(text);
      return analysis;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: "Erreur lors de l'analyse émotionnelle",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    generateText,
    chatCompletion,
    generateImage,
    analyzeEmotion,
    isLoading,
    error
  };
}

export default useOpenAI;
