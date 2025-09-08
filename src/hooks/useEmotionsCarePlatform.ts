/**
 * 🎯 HOOK UNIFIÉ EMOTIONSCARE PREMIUM
 * Interface React optimisée pour la plateforme unifiée
 */

import { useState, useCallback, useEffect } from 'react';
import { emotionsCareUnified, EmotionsCareTrack, TherapeuticSession, WellnessInsights } from '@/services/EmotionsCareUnifiedPlatform';
import { UnifiedEmotionAnalysis, EmotionLabel } from '@/types/unified-emotions';
import { useToast } from '@/hooks/use-toast';

interface PlatformState {
  isLoading: boolean;
  error: string | null;
  currentSession: TherapeuticSession | null;
  insights: WellnessInsights | null;
}

export const useEmotionsCarePlatform = (userId: string) => {
  const [state, setState] = useState<PlatformState>({
    isLoading: false,
    error: null,
    currentSession: null,
    insights: null
  });

  const { toast } = useToast();

  /**
   * 🧠 Analyse émotionnelle complète optimisée
   */
  const analyzeEmotion = useCallback(async (data: {
    text?: string;
    audioBlob?: Blob;
    imageBlob?: Blob;
  }): Promise<UnifiedEmotionAnalysis | null> => {
    if (!userId) {
      toast({
        title: "⚠️ Utilisateur requis",
        description: "Veuillez vous connecter pour continuer",
        variant: "destructive"
      });
      return null;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const analysis = await emotionsCareUnified.analyzeCompleteEmotion({
        ...data,
        userId
      });

      setState(prev => ({ ...prev, isLoading: false }));

      toast({
        title: `🎯 Émotion détectée: ${analysis.primaryEmotion}`,
        description: `Confiance: ${Math.round(analysis.overallConfidence * 100)}%`,
        duration: 3000
      });

      return analysis;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analyse échouée';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));

      toast({
        title: "❌ Erreur d'analyse",
        description: errorMessage,
        variant: "destructive"
      });

      return null;
    }
  }, [userId, toast]);

  /**
   * 🎵 Génération musicale thérapeutique
   */
  const generateTherapeuticMusic = useCallback(async (params: {
    currentEmotion: EmotionLabel;
    targetEmotion: EmotionLabel;
    duration?: number;
    intensity?: number;
  }): Promise<EmotionsCareTrack | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const track = await emotionsCareUnified.generateTherapeuticMusic({
        ...params,
        userId
      });

      setState(prev => ({ ...prev, isLoading: false }));

      toast({
        title: `🎼 Musique générée: ${track.title}`,
        description: `Score thérapeutique: ${track.therapeuticScore}/100`,
        duration: 4000
      });

      return track;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Génération échouée';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));

      toast({
        title: "❌ Erreur génération musicale",
        description: errorMessage,
        variant: "destructive"
      });

      return null;
    }
  }, [userId, toast]);

  /**
   * 🌟 Session thérapeutique complète
   */
  const startCompleteSession = useCallback(async (params: {
    analysisData: {
      text?: string;
      audioBlob?: Blob;
      imageBlob?: Blob;
    };
    goal: 'relax' | 'energize' | 'focus' | 'balance' | 'sleep';
    duration: number;
  }): Promise<TherapeuticSession | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // 1. Analyse émotionnelle
      const emotionAnalysis = await emotionsCareUnified.analyzeCompleteEmotion({
        ...params.analysisData,
        userId
      });

      // 2. Création session thérapeutique
      const session = await emotionsCareUnified.startTherapeuticSession({
        userId,
        emotionAnalysis,
        goal: params.goal,
        duration: params.duration
      });

      setState(prev => ({
        ...prev,
        isLoading: false,
        currentSession: session
      }));

      toast({
        title: "🚀 Session thérapeutique démarrée",
        description: `${session.playlist.length} pistes • Objectif: ${params.goal}`,
        duration: 5000
      });

      return session;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Session échouée';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));

      toast({
        title: "❌ Erreur session thérapeutique",
        description: errorMessage,
        variant: "destructive"
      });

      return null;
    }
  }, [userId, toast]);

  /**
   * 📊 Chargement des insights bien-être
   */
  const loadWellnessInsights = useCallback(async (): Promise<WellnessInsights | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const insights = await emotionsCareUnified.generateWellnessInsights(userId);

      setState(prev => ({
        ...prev,
        isLoading: false,
        insights
      }));

      toast({
        title: `📈 Insights mis à jour`,
        description: `Score bien-être: ${insights.wellnessScore}/100`,
        duration: 3000
      });

      return insights;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Chargement insights échoué';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));

      toast({
        title: "❌ Erreur chargement insights",
        description: errorMessage,
        variant: "destructive"
      });

      return null;
    }
  }, [userId, toast]);

  /**
   * 🎯 Analyse express (texte seulement)
   */
  const quickTextAnalysis = useCallback(async (text: string): Promise<UnifiedEmotionAnalysis | null> => {
    return analyzeEmotion({ text });
  }, [analyzeEmotion]);

  /**
   * 🔄 Mise à jour du progrès de session
   */
  const updateSessionProgress = useCallback((progress: number) => {
    setState(prev => {
      if (!prev.currentSession) return prev;
      
      const updatedSession = {
        ...prev.currentSession,
        progress: Math.min(100, Math.max(0, progress))
      };

      return {
        ...prev,
        currentSession: updatedSession
      };
    });
  }, []);

  /**
   * 🏁 Fin de session
   */
  const endCurrentSession = useCallback(async (effectiveness?: number) => {
    setState(prev => {
      if (!prev.currentSession) return prev;

      const endedSession = {
        ...prev.currentSession,
        isActive: false,
        endTime: new Date(),
        effectiveness: effectiveness || prev.currentSession.effectiveness
      };

      toast({
        title: "✅ Session terminée",
        description: `Efficacité: ${endedSession.effectiveness}/100`,
        duration: 4000
      });

      return {
        ...prev,
        currentSession: null
      };
    });
  }, [toast]);

  /**
   * 🧹 Nettoyage des caches
   */
  const clearCache = useCallback(() => {
    emotionsCareUnified.clearCache();
    toast({
      title: "🧹 Cache nettoyé",
      description: "Performances optimisées"
    });
  }, [toast]);

  // Chargement automatique des insights au montage
  useEffect(() => {
    if (userId) {
      loadWellnessInsights();
    }
  }, [userId, loadWellnessInsights]);

  return {
    // État
    isLoading: state.isLoading,
    error: state.error,
    currentSession: state.currentSession,
    insights: state.insights,

    // Actions principales
    analyzeEmotion,
    generateTherapeuticMusic,
    startCompleteSession,
    loadWellnessInsights,

    // Actions rapides
    quickTextAnalysis,
    updateSessionProgress,
    endCurrentSession,

    // Utilitaires
    clearCache,

    // États calculés
    hasActiveSession: !!state.currentSession?.isActive,
    wellnessScore: state.insights?.wellnessScore || 0,
    emotionTrend: state.insights?.emotionTrend || 'stable'
  };
};