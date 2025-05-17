
/**
 * Hook useOpenAI
 * 
 * Ce hook fournit une interface React pour utiliser les services OpenAI
 * avec gestion d'état, chargement, et gestion d'erreurs.
 */
import { useState, useCallback } from 'react';
import { openai } from '@/services';
import { ChatMessage } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';

interface UseOpenAIOptions {
  autoShowErrors?: boolean;
  autoShowSuccess?: boolean;
  onError?: (error: Error) => void;
}

export function useOpenAI(options: UseOpenAIOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const { 
    autoShowErrors = true, 
    autoShowSuccess = false,
    onError 
  } = options;

  /**
   * Gère les erreurs de l'API
   */
  const handleError = useCallback((error: Error, operation: string) => {
    setError(error);
    console.error(`OpenAI ${operation} error:`, error);
    
    if (onError) onError(error);
    
    if (autoShowErrors) {
      toast({
        title: "Erreur d'IA",
        description: `Un problème est survenu lors de ${operation}. Veuillez réessayer.`,
        variant: "destructive",
      });
    }
    
    return error;
  }, [autoShowErrors, onError, toast]);

  /**
   * Génère du texte via l'API OpenAI
   */
  const generateText = useCallback(async (prompt: string, systemPrompt?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await openai.generateText(prompt, {
        systemPrompt
      });
      
      if (autoShowSuccess) {
        toast({
          title: "Texte généré",
          description: "Le texte a été généré avec succès.",
        });
      }
      
      return result;
    } catch (err) {
      handleError(err as Error, "la génération de texte");
      return '';
    } finally {
      setIsLoading(false);
    }
  }, [autoShowSuccess, handleError, toast]);

  /**
   * Traite une conversation complète via l'API OpenAI
   */
  const chatCompletion = useCallback(async (messages: ChatMessage[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await openai.chatCompletion(messages);
      return result;
    } catch (err) {
      handleError(err as Error, "la conversation");
      return '';
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /**
   * Génère une image via DALL-E
   */
  const generateImage = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await openai.generateImage(prompt);
      
      if (autoShowSuccess) {
        toast({
          title: "Image générée",
          description: "L'image a été générée avec succès.",
        });
      }
      
      return result;
    } catch (err) {
      handleError(err as Error, "la génération d'image");
      return '';
    } finally {
      setIsLoading(false);
    }
  }, [autoShowSuccess, handleError, toast]);

  /**
   * Analyse émotionnelle d'un texte via GPT
   */
  const analyzeEmotion = useCallback(async (text: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await openai.analyzeEmotion(text);
      return result;
    } catch (err) {
      handleError(err as Error, "l'analyse émotionnelle");
      return {
        primaryEmotion: 'neutral',
        intensity: 5,
        analysis: 'Analyse indisponible.',
        suggestions: ['Veuillez réessayer plus tard.']
      };
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /**
   * Modération de contenu
   */
  const moderateContent = useCallback(async (content: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await openai.moderateContent(content);
      return result;
    } catch (err) {
      handleError(err as Error, "la modération de contenu");
      return {
        flagged: false,
        categories: {},
        categoryScores: {}
      };
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);
  
  return {
    isLoading,
    error,
    generateText,
    chatCompletion,
    generateImage,
    analyzeEmotion,
    moderateContent
  };
}

export default useOpenAI;
