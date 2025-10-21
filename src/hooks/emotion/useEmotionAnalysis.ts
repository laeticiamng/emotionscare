// @ts-nocheck
import { useState, useCallback, useEffect } from 'react';
import { emotionAnalysisService } from '@/services';
import type { ApiResponse, EmotionData, TherapeuticSession } from '@/services/types';
import { logger } from '@/lib/logger';

interface EmotionAnalysisHook {
  // État
  isAnalyzing: boolean;
  currentSession: string | null;
  sessionProgress: any;
  emotionHistory: EmotionData[];
  insights: any;
  recommendations: string[];
  error: string | null;
  
  // Gestion des sessions
  createSession: (type: TherapeuticSession['type']) => Promise<string>;
  endSession: (outcome?: any) => Promise<ApiResponse>;
  
  // Analyse
  analyzeMultiModal: (input: any, sessionId?: string) => Promise<ApiResponse>;
  getEmotionalTrends: (timeRange: { start: Date; end: Date }) => Promise<ApiResponse>;
  getPersonalizedRecommendations: (
    emotions: EmotionData[], 
    context?: any
  ) => Promise<ApiResponse>;
  
  // Utilitaires
  reset: () => void;
}

export const useEmotionAnalysis = (userId: string = 'current-user'): EmotionAnalysisHook => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [sessionProgress, setSessionProgress] = useState<any>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Créer une nouvelle session thérapeutique
  const createSession = useCallback(async (type: TherapeuticSession['type']): Promise<string> => {
    try {
      setError(null);
      const sessionId = await emotionAnalysisService.createSession(userId, type);
      setCurrentSession(sessionId);
      setEmotionHistory([]);
      setInsights(null);
      setRecommendations([]);
      return sessionId;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la création de session';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [userId]);

  // Terminer la session actuelle
  const endSession = useCallback(async (outcome?: {
    moodImprovement: number;
    stressReduction: number;
    satisfaction: number;
  }): Promise<ApiResponse> => {
    if (!currentSession) {
      const error = 'Aucune session active à terminer';
      setError(error);
      return {
        success: false,
        error,
        timestamp: new Date()
      };
    }

    try {
      const response = await emotionAnalysisService.endSession(currentSession, outcome);
      
      if (response.success) {
        setCurrentSession(null);
        setSessionProgress(null);
      } else if (response.error) {
        setError(response.error);
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la fin de session';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    }
  }, [currentSession]);

  // Analyser les données multi-modales
  const analyzeMultiModal = useCallback(async (
    input: {
      text?: string;
      image?: string | File;
      audio?: File;
      video?: File;
    },
    sessionId?: string
  ): Promise<ApiResponse> => {
    const hasInput = Object.values(input).some(value => 
      value !== undefined && value !== null && value !== ''
    );

    if (!hasInput) {
      const error = 'Au moins un type de données (texte, image, audio) est requis';
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
      const response = await emotionAnalysisService.analyzeMultiModal(
        input, 
        sessionId || currentSession || undefined
      );

      if (response.success && response.data) {
        const { emotions, insights: newInsights, therapeutic_suggestions } = response.data;
        
        // Mettre à jour l'historique émotionnel
        setEmotionHistory(prev => [...emotions, ...prev].slice(0, 50)); // Garder les 50 dernières
        
        // Mettre à jour les insights
        setInsights(newInsights);
        
        // Mettre à jour les recommandations
        setRecommendations(therapeutic_suggestions || []);
        
      } else if (response.error) {
        setError(response.error);
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de l\'analyse multi-modale';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    } finally {
      setIsAnalyzing(false);
    }
  }, [currentSession]);

  // Obtenir les tendances émotionnelles
  const getEmotionalTrends = useCallback(async (timeRange: { 
    start: Date; 
    end: Date; 
  }): Promise<ApiResponse> => {
    if (timeRange.start >= timeRange.end) {
      const error = 'La date de début doit être antérieure à la date de fin';
      setError(error);
      return {
        success: false,
        error,
        timestamp: new Date()
      };
    }

    try {
      setError(null);
      const response = await emotionAnalysisService.getEmotionalTrends(userId, timeRange);
      
      if (!response.success && response.error) {
        setError(response.error);
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de l\'obtention des tendances';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    }
  }, [userId]);

  // Obtenir des recommandations personnalisées
  const getPersonalizedRecommendations = useCallback(async (
    emotions: EmotionData[],
    context?: {
      time_of_day?: string;
      location?: string;
      recent_activities?: string[];
      goals?: string[];
    }
  ): Promise<ApiResponse> => {
    if (!emotions.length) {
      const error = 'Données émotionnelles requises pour les recommandations';
      setError(error);
      return {
        success: false,
        error,
        timestamp: new Date()
      };
    }

    try {
      setError(null);
      const response = await emotionAnalysisService.getPersonalizedRecommendations(
        userId,
        emotions,
        context
      );

      if (response.success && response.data) {
        const { immediate_actions, long_term_strategies } = response.data;
        setRecommendations([...immediate_actions, ...long_term_strategies]);
      } else if (response.error) {
        setError(response.error);
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de l\'obtention des recommandations';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    }
  }, [userId]);

  // Mettre à jour automatiquement le progrès de session
  useEffect(() => {
    if (!currentSession) return;

    const updateProgress = async () => {
      try {
        // Cette fonctionnalité nécessiterait une méthode getSessionProgress dans le service
        // Pour l'instant, on simule un progrès basé sur le nombre d'émotions analysées
        setSessionProgress({
          emotionsAnalyzed: emotionHistory.length,
          sessionDuration: Date.now(), // Durée depuis la création
          dominantEmotions: emotionHistory.slice(0, 3).map(e => e.emotion),
          moodTrend: emotionHistory.length > 5 ? 'improving' : 'stable'
        });
      } catch (error) {
        logger.error('Erreur lors de la mise à jour du progrès', error as Error, 'UI');
      }
    };

    // Mettre à jour le progrès toutes les 30 secondes
    const progressInterval = setInterval(updateProgress, 30000);

    // Mise à jour initiale
    updateProgress();

    return () => clearInterval(progressInterval);
  }, [currentSession, emotionHistory]);

  // Réinitialiser l'état
  const reset = useCallback(() => {
    setCurrentSession(null);
    setSessionProgress(null);
    setEmotionHistory([]);
    setInsights(null);
    setRecommendations([]);
    setError(null);
    setIsAnalyzing(false);
  }, []);

  return {
    // État
    isAnalyzing,
    currentSession,
    sessionProgress,
    emotionHistory,
    insights,
    recommendations,
    error,
    
    // Méthodes
    createSession,
    endSession,
    analyzeMultiModal,
    getEmotionalTrends,
    getPersonalizedRecommendations,
    reset
  };
};