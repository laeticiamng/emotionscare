// @ts-nocheck
import { useState, useCallback, useEffect } from 'react';
import { 
  mlRecommendationService, 
  UserHistoryEntry,
  MLPrediction,
  OptimizedSunoParams,
  ProactiveSuggestion
} from '@/services/ml-recommendation-service';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

export const useMLRecommendations = (userId?: string) => {
  const [isTraining, setIsTraining] = useState(false);
  const [predictions, setPredictions] = useState<MLPrediction | null>(null);
  const [optimizedParams, setOptimizedParams] = useState<OptimizedSunoParams | null>(null);
  const [proactiveSuggestions, setProactiveSuggestions] = useState<ProactiveSuggestion[]>([]);
  const [userHistory, setUserHistory] = useState<UserHistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Simulate loading user history (in production, fetch from DB)
  useEffect(() => {
    if (userId) {
      loadUserHistory();
    }
  }, [userId]);

  const loadUserHistory = useCallback(async () => {
    try {
      // Mock history - in production, fetch from Supabase
      const mockHistory: UserHistoryEntry[] = [
        {
          timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
          emotion: 'anxious',
          intensity: 0.8,
          musicGenerated: true,
          sunoParams: { bpm: 70, style: 'ambient', mood: 'calme', tags: ['relax'] },
          sessionDuration: 15,
          userFeedback: 'positive',
          timeOfDay: '18:30',
        },
        {
          timestamp: new Date(Date.now() - 86400000 * 6).toISOString(),
          emotion: 'calm',
          intensity: 0.6,
          musicGenerated: true,
          sunoParams: { bpm: 80, style: 'piano', mood: 'serein', tags: ['peace'] },
          sessionDuration: 20,
          userFeedback: 'positive',
          timeOfDay: '08:00',
        },
        {
          timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
          emotion: 'happy',
          intensity: 0.7,
          musicGenerated: true,
          sunoParams: { bpm: 120, style: 'upbeat', mood: 'joyeux', tags: ['energy'] },
          sessionDuration: 10,
          userFeedback: 'neutral',
          timeOfDay: '12:00',
        },
        {
          timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
          emotion: 'sad',
          intensity: 0.6,
          musicGenerated: true,
          sunoParams: { bpm: 65, style: 'melancholic', mood: 'mélancolique', tags: ['healing'] },
          sessionDuration: 25,
          userFeedback: 'positive',
          timeOfDay: '20:00',
        },
        {
          timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
          emotion: 'focused',
          intensity: 0.75,
          musicGenerated: true,
          sunoParams: { bpm: 90, style: 'lofi', mood: 'concentré', tags: ['focus'] },
          sessionDuration: 45,
          userFeedback: 'positive',
          timeOfDay: '10:00',
        },
      ];
      
      setUserHistory(mockHistory);
      logger.info('📊 User history loaded', { entries: mockHistory.length }, 'ML');
    } catch (err) {
      logger.error('Error loading history', err as Error, 'ML');
    }
  }, [userId]);

  const trainAndPredict = useCallback(async (currentEmotion: string) => {
    if (userHistory.length === 0) {
      toast.error('Historique insuffisant pour l\'entraînement ML');
      return null;
    }

    setIsTraining(true);
    setError(null);

    try {
      const now = new Date();
      const timeOfDay = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

      const prediction = await mlRecommendationService.trainAndPredict(
        userHistory,
        currentEmotion,
        timeOfDay
      );

      if (prediction) {
        setPredictions(prediction);
        toast.success('🧠 Prédictions ML générées avec succès');
      } else {
        toast.error('Échec de la génération des prédictions');
      }

      return prediction;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur ML inconnue';
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    } finally {
      setIsTraining(false);
    }
  }, [userHistory]);

  const optimizeSunoForEmotion = useCallback(async (targetEmotion: string) => {
    if (userHistory.length === 0) {
      toast.error('Historique insuffisant pour l\'optimisation');
      return null;
    }

    setIsTraining(true);
    setError(null);

    try {
      const params = await mlRecommendationService.optimizeSunoParams(
        userHistory,
        targetEmotion
      );

      if (params) {
        setOptimizedParams(params);
        toast.success(`⚙️ Paramètres Suno optimisés pour "${targetEmotion}"`);
      }

      return params;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur optimisation';
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    } finally {
      setIsTraining(false);
    }
  }, [userHistory]);

  const getProactiveSuggestions = useCallback(async (currentEmotion: string) => {
    if (userHistory.length === 0) {
      return [];
    }

    setIsTraining(true);
    setError(null);

    try {
      const now = new Date();
      const timeOfDay = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

      const suggestions = await mlRecommendationService.getProactiveSuggestions(
        userHistory,
        currentEmotion,
        timeOfDay
      );

      setProactiveSuggestions(suggestions);
      
      if (suggestions.length > 0) {
        toast.success(`💡 ${suggestions.length} suggestions proactives disponibles`);
      }

      return suggestions;
    } catch (err) {
      logger.error('Error getting suggestions', err as Error, 'ML');
      return [];
    } finally {
      setIsTraining(false);
    }
  }, [userHistory]);

  const addHistoryEntry = useCallback((entry: UserHistoryEntry) => {
    setUserHistory(prev => [...prev, entry]);
    logger.info('📝 History entry added', { entry }, 'ML');
  }, []);

  return {
    isTraining,
    predictions,
    optimizedParams,
    proactiveSuggestions,
    userHistory,
    error,
    trainAndPredict,
    optimizeSunoForEmotion,
    getProactiveSuggestions,
    addHistoryEntry,
    loadUserHistory,
  };
};
