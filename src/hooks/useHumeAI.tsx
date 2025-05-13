
import { useState, useEffect, useRef } from 'react';
import { humeAIService, EmotionAnalysisResult, initializeHumeAI } from '@/lib/humeai/humeAIService';
import { useToast } from '@/hooks/use-toast';

interface UseHumeAIOptions {
  autoStart?: boolean;
  onEmotion?: (result: EmotionAnalysisResult) => void;
  apiKey?: string;
}

export const useHumeAI = (options: UseHumeAIOptions = {}) => {
  const { autoStart = false, onEmotion, apiKey } = options;
  const [isInitialized, setIsInitialized] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastEmotion, setLastEmotion] = useState<EmotionAnalysisResult | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { toast } = useToast();

  // Initialize the service
  useEffect(() => {
    if (apiKey) {
      initializeHumeAI(apiKey);
      setIsInitialized(true);
    }
  }, [apiKey]);
  
  // Set up the emotion callback
  useEffect(() => {
    humeAIService.onEmotion((result) => {
      setLastEmotion(result);
      if (onEmotion) {
        onEmotion(result);
      }
    });
  }, [onEmotion]);
  
  // Auto-start if requested
  useEffect(() => {
    if (autoStart && isInitialized && videoRef.current) {
      startFaceTracking();
    }
    
    return () => {
      // Clean up on unmount
      if (isActive) {
        humeAIService.stop();
      }
    };
  }, [autoStart, isInitialized]);
  
  const startFaceTracking = async () => {
    if (!videoRef.current) {
      setError("Référence vidéo non disponible");
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await humeAIService.initializeFaceTracking(videoRef.current);
      setIsActive(success);
      
      if (!success) {
        setError("Impossible d'initialiser l'analyse faciale");
        toast({
          title: "Échec de l'initialisation",
          description: "Impossible d'initialiser l'analyse émotionnelle faciale",
          variant: "destructive"
        });
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      setError(errorMessage);
      toast({
        title: "Erreur d'analyse faciale",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const stopFaceTracking = () => {
    humeAIService.stop();
    setIsActive(false);
  };
  
  const toggleFaceTracking = async () => {
    if (isActive) {
      stopFaceTracking();
      return false;
    } else {
      return await startFaceTracking();
    }
  };
  
  return {
    videoRef,
    isActive,
    isLoading,
    error,
    lastEmotion,
    startFaceTracking,
    stopFaceTracking,
    toggleFaceTracking
  };
};

export default useHumeAI;
