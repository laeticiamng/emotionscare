/**
 * 🎯 HOOK GESTIONNAIRE DE PLATEFORME UNIFIÉ
 * Interface React pour le gestionnaire de services unifié
 */

import { useState, useEffect, useCallback } from 'react';
import { serviceManager } from '@/services/UnifiedServiceManager';
import { UnifiedEmotionAnalysis, EmotionLabel } from '@/types/unified-emotions';
import { UnifiedMusicTrack, MusicPlaylist, MusicTherapySession } from '@/services/UnifiedMusicService';
import { useToast } from '@/hooks/use-toast';

interface PlatformState {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  currentSession: any | null;
}

export const usePlatformManager = () => {
  const [state, setState] = useState<PlatformState>({
    isInitialized: false,
    isLoading: false,
    error: null,
    currentSession: null
  });

  const { toast } = useToast();

  // Initialisation du gestionnaire
  useEffect(() => {
    const initializePlatform = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        await serviceManager.initialize();
        
        setState(prev => ({ 
          ...prev, 
          isInitialized: true, 
          isLoading: false 
        }));

        toast({
          title: "🚀 Plateforme initialisée",
          description: "Tous les services sont opérationnels"
        });

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: errorMessage 
        }));

        toast({
          title: "❌ Erreur d'initialisation",
          description: errorMessage,
          variant: "destructive"
        });
      }
    };

    if (!state.isInitialized && !state.isLoading) {
      initializePlatform();
    }
  }, [state.isInitialized, state.isLoading, toast]);

  /**
   * Analyse émotionnelle unifiée
   */
  const analyzeEmotion = useCallback(async (params: {
    text?: string;
    audioBlob?: Blob;
    imageBlob?: Blob;
    sources?: ('hume_face' | 'hume_voice' | 'openai_text')[];
    mode?: 'quick' | 'detailed' | 'realtime';
  }): Promise<UnifiedEmotionAnalysis | null> => {
    if (!state.isInitialized) {
      toast({
        title: "⚠️ Plateforme non initialisée",
        description: "Veuillez attendre l'initialisation",
        variant: "destructive"
      });
      return null;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result = await serviceManager.analyzeEmotion(params);
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      toast({
        title: `🧠 Émotion détectée: ${result.primaryEmotion}`,
        description: `Confiance: ${Math.round(result.overallConfidence * 100)}%`
      });
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'analyse';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      
      toast({
        title: "❌ Erreur d'analyse émotionnelle",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    }
  }, [state.isInitialized, toast]);

  /**
   * Génération musicale unifiée
   */
  const generateMusic = useCallback(async (params: {
    emotion: string;
    style?: string;
    duration?: number;
    intensity?: number;
    therapeutic?: boolean;
  }): Promise<UnifiedMusicTrack | null> => {
    if (!state.isInitialized) {
      toast({
        title: "⚠️ Plateforme non initialisée",
        description: "Veuillez attendre l'initialisation",
        variant: "destructive"
      });
      return null;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result = await serviceManager.generateMusic(params);
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      toast({
        title: `🎵 Musique générée: ${result.title}`,
        description: `Style: ${result.genre} • Durée: ${Math.round(result.duration / 60)}min`
      });
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de génération';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      
      toast({
        title: "❌ Erreur de génération musicale",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    }
  }, [state.isInitialized, toast]);

  /**
   * Création de playlist thérapeutique
   */
  const createTherapeuticPlaylist = useCallback(async (params: {
    currentEmotion: string;
    targetEmotion?: string;
    duration: number;
  }): Promise<MusicPlaylist | null> => {
    if (!state.isInitialized) return null;

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result = await serviceManager.createTherapeuticPlaylist(params);
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      toast({
        title: `🎼 Playlist créée: ${result.name}`,
        description: `${result.tracks.length} pistes • ${Math.round(result.totalDuration / 60)}min`
      });
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de création';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      
      toast({
        title: "❌ Erreur de création de playlist",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    }
  }, [state.isInitialized, toast]);

  /**
   * Session complète de bien-être
   */
  const startWellnessSession = useCallback(async (params: {
    userId: string;
    analysisData: {
      text?: string;
      audioBlob?: Blob;
      imageBlob?: Blob;
    };
    sessionDuration: number;
    goal: 'relax' | 'energize' | 'focus' | 'mood_boost' | 'sleep' | 'anxiety_relief';
  }) => {
    if (!state.isInitialized) return null;

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const session = await serviceManager.startWellnessSession(params);
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        currentSession: session 
      }));
      
      toast({
        title: "🌟 Session de bien-être démarrée",
        description: `Objectif: ${params.goal} • Durée: ${params.sessionDuration}min`
      });
      
      return session;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de session';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      
      toast({
        title: "❌ Erreur de démarrage de session",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    }
  }, [state.isInitialized, toast]);

  /**
   * Nettoyage du cache
   */
  const clearCache = useCallback(() => {
    serviceManager.clearCache();
    toast({
      title: "🧹 Cache nettoyé",
      description: "Toutes les données en cache ont été supprimées"
    });
  }, [toast]);

  /**
   * Statistiques des services
   */
  const getServiceStats = useCallback(() => {
    return serviceManager.getServiceStats();
  }, []);

  /**
   * Réinitialisation en cas d'erreur
   */
  const resetPlatform = useCallback(() => {
    setState({
      isInitialized: false,
      isLoading: false,
      error: null,
      currentSession: null
    });
    serviceManager.clearCache();
  }, []);

  return {
    // État
    isInitialized: state.isInitialized,
    isLoading: state.isLoading,
    error: state.error,
    currentSession: state.currentSession,

    // Actions principales
    analyzeEmotion,
    generateMusic,
    createTherapeuticPlaylist,
    startWellnessSession,

    // Utilitaires
    clearCache,
    getServiceStats,
    resetPlatform
  };
};