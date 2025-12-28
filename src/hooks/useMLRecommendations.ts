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
import { supabase } from '@/integrations/supabase/client';

export const useMLRecommendations = (userId?: string) => {
  const [isTraining, setIsTraining] = useState(false);
  const [predictions, setPredictions] = useState<MLPrediction | null>(null);
  const [optimizedParams, setOptimizedParams] = useState<OptimizedSunoParams | null>(null);
  const [proactiveSuggestions, setProactiveSuggestions] = useState<ProactiveSuggestion[]>([]);
  const [userHistory, setUserHistory] = useState<UserHistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Charger l'historique depuis Supabase
  useEffect(() => {
    if (userId) {
      loadUserHistory();
    }
  }, [userId]);

  const loadUserHistory = useCallback(async () => {
    try {
      if (!userId) return;

      // Charger depuis music_listening_history ou session_emotions
      const { data: sessionData, error: sessionError } = await supabase
        .from('session_emotions')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(50);

      if (sessionError) {
        logger.warn('Session emotions not available, using fallback', {}, 'ML');
      }

      if (sessionData && sessionData.length > 0) {
        const history: UserHistoryEntry[] = sessionData.map((entry: any) => ({
          timestamp: entry.timestamp || entry.created_at,
          emotion: entry.primary_emotion || entry.emotion || 'neutral',
          intensity: entry.intensity || 0.5,
          musicGenerated: entry.music_generated ?? false,
          sunoParams: entry.suno_params || {},
          sessionDuration: entry.duration_seconds || 15,
          userFeedback: entry.feedback || 'neutral',
          timeOfDay: new Date(entry.timestamp || entry.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        }));

        setUserHistory(history);
        logger.info('📊 User history loaded from Supabase', { entries: history.length }, 'ML');
        return;
      }

      // Fallback: charger depuis user_settings
      const { data: settingsData } = await supabase
        .from('user_settings')
        .select('value')
        .eq('user_id', userId)
        .eq('key', 'ml_history')
        .single();

      if (settingsData?.value) {
        try {
          const history = typeof settingsData.value === 'string' 
            ? JSON.parse(settingsData.value) 
            : settingsData.value;
          if (Array.isArray(history)) {
            setUserHistory(history);
            logger.info('📊 User history loaded from settings', { entries: history.length }, 'ML');
            return;
          }
        } catch (e) {
          logger.warn('Failed to parse ML history from settings', {}, 'ML');
        }
      }

      // Si aucune donnée, utiliser des données de démo minimales
      const demoHistory: UserHistoryEntry[] = [
        {
          timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
          emotion: 'calm',
          intensity: 0.7,
          musicGenerated: true,
          sessionDuration: 15,
          userFeedback: 'positive',
          timeOfDay: '18:00',
        },
        {
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          emotion: 'focus',
          intensity: 0.6,
          musicGenerated: true,
          sessionDuration: 20,
          userFeedback: 'positive',
          timeOfDay: '10:00',
        },
      ];
      
      setUserHistory(demoHistory);
      logger.info('📊 Using demo history (no user data found)', { entries: demoHistory.length }, 'ML');
    } catch (err) {
      logger.error('Error loading history', err as Error, 'ML');
      setUserHistory([]);
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
