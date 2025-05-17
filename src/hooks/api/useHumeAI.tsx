
import { useState } from 'react';
import { humeAI } from '@/services';
import { useToast } from '@/hooks/use-toast';
import { EmotionResult } from '@/types/emotion';

export function useHumeAI() {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Analyse les émotions dans un fichier vocal
   */
  const analyzeVoiceEmotion = async (audioFile: File | Blob): Promise<EmotionResult | null> => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await humeAI.analyzeVoiceEmotion(audioFile);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: "Erreur d'analyse émotionnelle",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  /**
   * Analyse les émotions dans un texte
   */
  const analyzeTextEmotion = async (text: string): Promise<EmotionResult | null> => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await humeAI.analyzeTextEmotion(text);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: "Erreur d'analyse émotionnelle",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  /**
   * Analyse les émotions faciales dans une image
   */
  const analyzeFacialEmotion = async (imageFile: File | Blob): Promise<EmotionResult | null> => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await humeAI.analyzeFacialEmotion(imageFile);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: "Erreur d'analyse émotionnelle faciale",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return {
    analyzeVoiceEmotion,
    analyzeTextEmotion,
    analyzeFacialEmotion,
    isAnalyzing,
    error
  };
}

export default useHumeAI;
