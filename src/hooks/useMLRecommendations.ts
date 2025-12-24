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
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;

      if (targetUserId) {
        // Fetch from ml_history table
        const { data: historyData } = await supabase
          .from('ml_user_history')
          .select('*')
          .eq('user_id', targetUserId)
          .order('created_at', { ascending: false })
          .limit(50);

        if (historyData && historyData.length > 0) {
          const formattedHistory: UserHistoryEntry[] = historyData.map(h => ({
            timestamp: h.created_at,
            emotion: h.emotion,
            intensity: h.intensity || 0.5,
            musicGenerated: h.music_generated || false,
            sunoParams: h.suno_params || {},
            sessionDuration: h.session_duration || 0,
            userFeedback: h.user_feedback || 'neutral',
            timeOfDay: h.time_of_day || new Date(h.created_at).toTimeString().substring(0, 5),
          }));

          setUserHistory(formattedHistory);
          logger.info('📊 User history loaded from DB', { entries: formattedHistory.length }, 'ML');
          return;
        }
      }

      // Fallback: also check emotion_scans for basic history
      if (targetUserId) {
        const { data: scansData } = await supabase
          .from('emotion_scans')
          .select('*')
          .eq('user_id', targetUserId)
          .order('created_at', { ascending: false })
          .limit(20);

        if (scansData && scansData.length > 0) {
          const historyFromScans: UserHistoryEntry[] = scansData.map(s => ({
            timestamp: s.created_at,
            emotion: s.emotion || 'neutral',
            intensity: (s.valence || 50) / 100,
            musicGenerated: false,
            sunoParams: {},
            sessionDuration: 0,
            userFeedback: 'neutral',
            timeOfDay: new Date(s.created_at).toTimeString().substring(0, 5),
          }));

          setUserHistory(historyFromScans);
          logger.info('📊 User history loaded from scans', { entries: historyFromScans.length }, 'ML');
        }
      }
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
