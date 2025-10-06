// @ts-nocheck
import { useState, useCallback } from 'react';
import { buildSunoRequest } from '@/services/openai-orchestrator';
import { generateMusic } from '@/services/suno-client';
import { sunoRateLimiter } from '@/services/rate-limit';
import { getVerbalBadge, sanitizeEmotionData } from '@/services/privacy';
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
      
      // 2. Générer le badge verbal (pas de scores numériques)
      const badge = getVerbalBadge(cleanedEmotion.valence, cleanedEmotion.arousal);
      setEmotionBadge(badge);

      // 3. Orchestrer la requête Suno via OpenAI Structured Outputs
      toast.info('Analyse de votre état émotionnel...');
      const sunoRequest = await buildSunoRequest(cleanedEmotion, userContext);
      
      // 4. Acquérir le rate limit token
      await sunoRateLimiter.acquire();

      // 5. Générer la musique via Suno
      toast.info('Création de votre musique personnalisée...');
      const result = await generateMusic(sunoRequest);

      if (!result?.data?.taskId) {
        throw new Error('Aucun taskId reçu de Suno');
      }

      const taskId = result.data.taskId;
      setCurrentTask(taskId);

      console.log('✅ Génération lancée:', { taskId, badge });
      toast.success('Votre musique est en cours de création !');

      return {
        taskId,
        emotionBadge: badge,
        estimatedDuration: sunoRequest.durationSeconds || 120
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
