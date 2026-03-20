import { useState, useCallback, useEffect } from 'react';
import { humeService } from '@/services';
import type { EmotionData, ApiResponse } from '@/services/types';

interface HumeServiceHook {
  // État
  isAnalyzing: boolean;
  emotions: EmotionData[];
  isConnected: boolean;
  error: string | null;
  
  // Méthodes d'analyse
  analyzeImage: (image: string | File) => Promise<ApiResponse>;
  analyzeText: (text: string) => Promise<ApiResponse>;
  analyzeVoice: (audioFile: File) => Promise<ApiResponse>;
  
  // WebSocket temps réel
  startRealTimeAnalysis: (mediaStream: MediaStream, options?: any) => Promise<void>;
  stopRealTimeAnalysis: () => void;
  
  // Insights
  getEmotionInsights: (emotions: EmotionData[], timeRange?: 'hour' | 'day' | 'week') => Promise<ApiResponse>;
  
  // Utilitaires
  reset: () => void;
}

export const useHumeService = (): HumeServiceHook => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [emotions, setEmotions] = useState<EmotionData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);

  // Analyser une image
  const analyzeImage = useCallback(async (image: string | File): Promise<ApiResponse> => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await humeService.analyzeImage(image);
      
      if (response.success && response.data?.emotions) {
        setEmotions(response.data.emotions);
      } else if (response.error) {
        setError(response.error);
      }
      
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de l\'analyse d\'image';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Analyser un texte
  const analyzeText = useCallback(async (text: string): Promise<ApiResponse> => {
    if (!text.trim()) {
      const error = 'Le texte ne peut pas être vide';
      setError(error);
      return {
        success: false,
        error,
        timestamp: new Date()
      };
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await humeService.analyzeText(text);
      
      if (response.success && response.data?.emotions) {
        setEmotions(response.data.emotions);
      } else if (response.error) {
        setError(response.error);
      }
      
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de l\'analyse de texte';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Analyser un fichier audio
  const analyzeVoice = useCallback(async (audioFile: File): Promise<ApiResponse> => {
    if (!audioFile) {
      const error = 'Fichier audio requis';
      setError(error);
      return {
        success: false,
        error,
        timestamp: new Date()
      };
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await humeService.analyzeVoice(audioFile);
      
      if (response.success && response.data?.emotions) {
        setEmotions(response.data.emotions);
      } else if (response.error) {
        setError(response.error);
      }
      
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de l\'analyse vocale';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Analyser en temps réel
  const startRealTimeAnalysis = useCallback(async (
    mediaStream: MediaStream, 
    options: any = {}
  ): Promise<void> => {
    try {
      setError(null);
      
      // Démarrer la session temps réel
      const sessionData = await humeService.startRealTimeAnalysis(mediaStream, options);
      
      // Se connecter au WebSocket
      humeService.connectWebSocket(sessionData.wsUrl);
      
      // S'abonner aux mises à jour d'émotions
      const unsub = humeService.onEmotionUpdate((newEmotions: EmotionData[]) => {
        setEmotions(prevEmotions => {
          // Garder seulement les 10 dernières émotions pour éviter la surcharge
          const updated = [...newEmotions, ...prevEmotions].slice(0, 10);
          return updated;
        });
      });
      
      setUnsubscribe(() => unsub);
      setIsConnected(true);
      
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors du démarrage de l\'analyse temps réel';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Arrêter l'analyse temps réel
  const stopRealTimeAnalysis = useCallback(() => {
    if (unsubscribe) {
      unsubscribe();
      setUnsubscribe(null);
    }
    
    humeService.disconnect();
    setIsConnected(false);
  }, [unsubscribe]);

  // Obtenir des insights sur les émotions
  const getEmotionInsights = useCallback(async (
    emotionsData: EmotionData[], 
    timeRange: 'hour' | 'day' | 'week' = 'day'
  ): Promise<ApiResponse> => {
    if (!emotionsData.length) {
      const error = 'Aucune donnée émotionnelle fournie';
      setError(error);
      return {
        success: false,
        error,
        timestamp: new Date()
      };
    }

    try {
      setError(null);
      const response = await humeService.getEmotionInsights(emotionsData, timeRange);
      
      if (!response.success && response.error) {
        setError(response.error);
      }
      
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de l\'obtention des insights';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    }
  }, []);

  // Réinitialiser l'état
  const reset = useCallback(() => {
    setEmotions([]);
    setError(null);
    setIsAnalyzing(false);
    if (isConnected) {
      stopRealTimeAnalysis();
    }
  }, [isConnected, stopRealTimeAnalysis]);

  // Nettoyage lors du démontage du composant
  useEffect(() => {
    return () => {
      if (isConnected) {
        stopRealTimeAnalysis();
      }
    };
  }, [isConnected, stopRealTimeAnalysis]);

  return {
    // État
    isAnalyzing,
    emotions,
    isConnected,
    error,
    
    // Méthodes
    analyzeImage,
    analyzeText,
    analyzeVoice,
    startRealTimeAnalysis,
    stopRealTimeAnalysis,
    getEmotionInsights,
    reset
  };
};