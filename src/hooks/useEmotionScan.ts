
import { useState, useCallback } from 'react';
import { EmotionResult } from '@/types/emotions';
import { analyzeEmotion, fetchLatestEmotion } from '@/lib/scanService';

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
      if (data) {
        // Ensure data conforms to EmotionResult type
        const result: EmotionResult = {
          ...data,
          id: data.id || `emotion-${Date.now()}`,
          emotion: data.emotion || 'neutral',
          confidence: data.confidence ?? 0,
          emojis: Array.isArray(data.emojis) ? data.emojis : data.emojis ? [data.emojis] : []
        };
        setLatestEmotion(result);
      }
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
      // Convert the object to a string for the analyzeEmotion function
      const textToAnalyze = data.text || '';
      const rawResult = await analyzeEmotion(textToAnalyze);
      
      if (rawResult) {
        const result: EmotionResult = {
          ...rawResult,
          id: rawResult.id || `emotion-${Date.now()}`,
          emotion: rawResult.emotion || 'neutral',
          confidence: rawResult.confidence ?? 0,
          emojis: Array.isArray(rawResult.emojis) ? rawResult.emojis : rawResult.emojis ? [rawResult.emojis] : []
        };
        
        setLatestEmotion(result);
        
        if (props?.onEmotionDetected) {
          props.onEmotionDetected(result);
        }
        
        return result;
      }
      
      return null;
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
      const result: EmotionResult = {
        id: data.id || `emo-${Date.now()}`,
        userId: userId,
        timestamp: data.timestamp || new Date().toISOString(),
        emotion: data.emotion || 'neutral',
        confidence: data.confidence ?? 0,
        emojis: Array.isArray(data.emojis) ? data.emojis : data.emojis ? [data.emojis] : [],
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
    setLatestEmotion: (emotion: EmotionResult | null) => setLatestEmotion(emotion)
  };
};

export default useEmotionScan;
