
import { useState, useCallback } from 'react';
import { EmotionResult } from '@/types/emotions';
import { analyzeEmotion, getLatestEmotion as fetchLatestEmotion } from '@/lib/scanService';

interface UseEmotionScanProps {
  userId?: string;
  onEmotionDetected?: (result: EmotionResult) => void;
}

export const useEmotionScan = (props?: UseEmotionScanProps) => {
  const [latestEmotion, setLatestEmotion] = useState<EmotionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const userId = props?.userId || 'current-user';
  
  // Récupérer la dernière émotion enregistrée
  const fetchLatest = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await fetchLatestEmotion(userId);
      setLatestEmotion(data);
      return data;
    } catch (err) {
      console.error('Error fetching latest emotion:', err);
      setError('Impossible de récupérer votre dernière émotion');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);
  
  // Analyser une émotion à partir de données fournies
  const scanEmotion = useCallback(async (data: {
    text?: string;
    emojis?: string;
    audio_url?: string;
  }) => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await analyzeEmotion(data);
      setLatestEmotion(result);
      
      if (props?.onEmotionDetected) {
        props.onEmotionDetected(result);
      }
      
      return result;
    } catch (err) {
      console.error('Error scanning emotion:', err);
      setError('Impossible d\'analyser votre émotion');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [props]);
  
  // Créer un nouvel enregistrement d'émotion
  const createEmotion = useCallback(async (data: Partial<EmotionResult>) => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = {
        id: `emo-${Date.now()}`,
        userId,
        timestamp: new Date().toISOString(),
        ...data
      };
      
      setLatestEmotion(result);
      
      if (props?.onEmotionDetected) {
        props.onEmotionDetected(result);
      }
      
      return result;
    } catch (err) {
      console.error('Error creating emotion record:', err);
      setError('Impossible de créer un nouvel enregistrement d\'émotion');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId, props]);

  return {
    latestEmotion,
    isLoading,
    error,
    fetchLatest,
    createEmotion,
    scanEmotion,
    getLatestEmotion: fetchLatest,
    setLatestEmotion
  };
};

export default useEmotionScan;
