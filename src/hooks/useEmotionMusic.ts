// @ts-nocheck
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { sunoRateLimiter } from '@/services/rate-limit';
import { sanitizeEmotionData } from '@/services/privacy';
import { toast } from 'sonner';

interface EmotionState {
  valence: number;
  arousal: number;
  dominantEmotion?: string;
  labels?: string[];
}

interface GenerationResult {
  taskId: string;
  emotionBadge: string;
  estimatedDuration: number;
}

export const useEmotionMusic = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [emotionBadge, setEmotionBadge] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const generateFromEmotion = useCallback(async (
    emotionState: EmotionState,
    userContext?: any
  ): Promise<GenerationResult | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      // Vérifier le rate limit
      const rateLimitStatus = sunoRateLimiter.getStatus();
      if (rateLimitStatus.remaining === 0) {
        toast.warning('Limite de génération atteinte. Veuillez patienter quelques secondes...');
        await sunoRateLimiter.acquire();
      }

      console.log('🎵 Génération musicale émotionnelle:', emotionState);

      // 1. Nettoyer et anonymiser les données émotionnelles
      const cleanedEmotion = sanitizeEmotionData(emotionState);

      // 2. Acquérir le rate limit token
      await sunoRateLimiter.acquire();

      // 3. Appeler l'Edge Function Supabase qui orchestre tout
      toast.info('Analyse de votre état émotionnel...');
      
      const { data, error: functionError } = await supabase.functions.invoke(
        'emotion-music-generate',
        {
          body: {
            emotionState: cleanedEmotion,
            userContext: userContext || {}
          }
        }
      );

      if (functionError) {
        console.error('❌ Edge Function error:', functionError);
        throw new Error(functionError.message || 'Erreur lors de la génération');
      }

      if (!data?.taskId) {
        throw new Error('Aucun taskId reçu');
      }

      const { taskId, emotionBadge, estimatedDuration } = data;
      setCurrentTask(taskId);
      setEmotionBadge(emotionBadge);

      console.log('✅ Génération lancée:', { taskId, emotionBadge });
      toast.success('Votre musique est en cours de création !');

      return {
        taskId,
        emotionBadge,
        estimatedDuration: estimatedDuration || 120
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération';
      console.error('❌ Erreur génération musique émotionnelle:', errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCurrentTask(null);
    setEmotionBadge('');
    setError(null);
  }, []);

  return {
    generateFromEmotion,
    isGenerating,
    currentTask,
    emotionBadge,
    error,
    reset,
    rateLimitStatus: sunoRateLimiter.getStatus()
  };
};
