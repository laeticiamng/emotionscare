// @ts-nocheck
import { useState, useCallback, useRef, useEffect } from 'react';
import { useEmotionAnalysisEngine } from './useEmotionAnalysisEngine';
import { useMusicGeneration } from './useMusicGeneration';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from './use-toast';
import type { EmotionResult, MusicTrack } from '@/types';

interface OptimizedEmotionsCareState {
  currentEmotion: EmotionResult | null;
  generatedTrack: MusicTrack | null;
  isAnalyzing: boolean;
  isGenerating: boolean;
  isPlaying: boolean;
  analysisHistory: EmotionResult[];
  error: string | null;
}

interface OptimizedEmotionsCareConfig {
  autoGenerateMusic?: boolean;
  autoPlay?: boolean;
  saveHistory?: boolean;
  maxHistorySize?: number;
  analysisTimeout?: number;
}

/**
 * Hook optimisé pour la gestion complète d'EmotionsCare
 * Combine analyse émotionnelle, génération musicale et lecture
 */
export const useOptimizedEmotionsCare = (config: OptimizedEmotionsCareConfig = {}) => {
  const {
    autoGenerateMusic = true,
    autoPlay = false,
    saveHistory = true,
    maxHistorySize = 50,
    analysisTimeout = 30000
  } = config;

  // État central
  const [state, setState] = useState<OptimizedEmotionsCareState>({
    currentEmotion: null,
    generatedTrack: null,
    isAnalyzing: false,
    isGenerating: false,
    isPlaying: false,
    analysisHistory: [],
    error: null
  });

  // Hooks de services
  const { analyzeEmotion } = useEmotionAnalysisEngine();
  const { generateMusic } = useMusicGeneration();
  const { playTrack } = useEmotionsCareMusicContext();
  const { toast } = useToast();

  // Refs pour optimisation
  const analysisTimeoutRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  // Nettoyage des timeouts
  useEffect(() => {
    return () => {
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Fonction de mise à jour d'état optimisée
  const updateState = useCallback((updates: Partial<OptimizedEmotionsCareState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Analyse émotionnelle avec timeout et gestion d'erreur
  const performEmotionAnalysis = useCallback(async (
    type: 'text' | 'image' | 'audio' | 'video',
    data: any
  ): Promise<EmotionResult | null> => {
    // Annuler toute analyse précédente
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    updateState({ isAnalyzing: true, error: null });

    // Timeout de sécurité
    analysisTimeoutRef.current = setTimeout(() => {
      abortControllerRef.current?.abort();
      updateState({ 
        isAnalyzing: false, 
        error: 'Timeout: L\'analyse a pris trop de temps'
      });
      toast({
        title: "Timeout d'analyse",
        description: "L'analyse émotionnelle a pris trop de temps",
        variant: "destructive"
      });
    }, analysisTimeout);

    try {
      const result = await analyzeEmotion(type, data, {
        signal: abortControllerRef.current.signal
      });

      if (result) {
        // Mettre à jour l'historique si activé
        const newHistory = saveHistory 
          ? [result, ...state.analysisHistory.slice(0, maxHistorySize - 1)]
          : state.analysisHistory;

        updateState({
          currentEmotion: result,
          analysisHistory: newHistory,
          isAnalyzing: false,
          error: null
        });

        // Auto-génération de musique si activée
        if (autoGenerateMusic) {
          await generateMusicForEmotion(result);
        }

        toast({
          title: "Analyse terminée",
          description: `Émotion détectée: ${result.dominantEmotion}`,
          duration: 3000
        });

        return result;
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        const errorMessage = error.message || 'Erreur lors de l\'analyse émotionnelle';
        updateState({ 
          isAnalyzing: false, 
          error: errorMessage 
        });
        
        toast({
          title: "Erreur d'analyse",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } finally {
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
      }
    }

    return null;
  }, [analyzeEmotion, autoGenerateMusic, saveHistory, maxHistorySize, analysisTimeout, state.analysisHistory, updateState, toast]);

  // Génération musicale optimisée
  const generateMusicForEmotion = useCallback(async (
    emotion: EmotionResult,
    customPrompt?: string,
    intensity?: number
  ): Promise<MusicTrack | null> => {
    updateState({ isGenerating: true, error: null });

    try {
      const track = await generateMusic(
        emotion.dominantEmotion,
        customPrompt,
        emotion.overallMood,
        intensity || 0.5
      );

      if (track) {
        updateState({
          generatedTrack: track,
          isGenerating: false,
          error: null
        });

        // Auto-play si activé
        if (autoPlay) {
          await playMusicTrack(track);
        }

        toast({
          title: "Musique générée",
          description: `"${track.title}" est prête`,
          duration: 4000
        });

        return track;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Erreur lors de la génération musicale';
      updateState({ 
        isGenerating: false, 
        error: errorMessage 
      });
      
      toast({
        title: "Erreur de génération",
        description: errorMessage,
        variant: "destructive"
      });
    }

    return null;
  }, [generateMusic, autoPlay, updateState, toast]);

  // Lecture musicale avec gestion d'état
  const playMusicTrack = useCallback(async (track: MusicTrack): Promise<void> => {
    updateState({ isPlaying: true, error: null });

    try {
      await playTrack(track);
      
      toast({
        title: "Lecture démarrée",
        description: `"${track.title}" en cours`,
        duration: 2000
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Erreur lors de la lecture';
      updateState({ 
        isPlaying: false, 
        error: errorMessage 
      });
      
      toast({
        title: "Erreur de lecture",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [playTrack, updateState, toast]);

  // Workflow complet: analyse + génération + lecture
  const performCompleteWorkflow = useCallback(async (
    type: 'text' | 'image' | 'audio' | 'video',
    data: any,
    musicOptions?: {
      customPrompt?: string;
      intensity?: number;
      autoPlay?: boolean;
    }
  ): Promise<{ emotion: EmotionResult | null; track: MusicTrack | null }> => {
    const emotion = await performEmotionAnalysis(type, data);
    
    if (!emotion) {
      return { emotion: null, track: null };
    }

    const track = await generateMusicForEmotion(
      emotion,
      musicOptions?.customPrompt,
      musicOptions?.intensity
    );

    if (track && (musicOptions?.autoPlay ?? autoPlay)) {
      await playMusicTrack(track);
    }

    return { emotion, track };
  }, [performEmotionAnalysis, generateMusicForEmotion, playMusicTrack, autoPlay]);

  // Réinitialisation de l'état
  const resetState = useCallback(() => {
    // Annuler toutes les opérations en cours
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }

    setState({
      currentEmotion: null,
      generatedTrack: null,
      isAnalyzing: false,
      isGenerating: false,
      isPlaying: false,
      analysisHistory: saveHistory ? state.analysisHistory : [],
      error: null
    });
  }, [saveHistory, state.analysisHistory]);

  // Statistiques de l'historique
  const getHistoryStats = useCallback(() => {
    if (state.analysisHistory.length === 0) {
      return null;
    }

    const emotions = state.analysisHistory.map(result => result.dominantEmotion);
    const emotionCounts = emotions.reduce((acc, emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommon = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)[0];

    const averageConfidence = state.analysisHistory
      .reduce((sum, result) => sum + result.confidence, 0) / state.analysisHistory.length;

    return {
      totalAnalyses: state.analysisHistory.length,
      mostCommonEmotion: mostCommon[0],
      mostCommonCount: mostCommon[1],
      averageConfidence: Math.round(averageConfidence * 100),
      emotionDistribution: emotionCounts
    };
  }, [state.analysisHistory]);

  return {
    // État
    ...state,
    
    // Actions principales
    performEmotionAnalysis,
    generateMusicForEmotion,
    playMusicTrack,
    performCompleteWorkflow,
    
    // Utilitaires
    resetState,
    getHistoryStats,
    
    // État calculé
    isLoading: state.isAnalyzing || state.isGenerating,
    hasCurrentEmotion: !!state.currentEmotion,
    hasGeneratedTrack: !!state.generatedTrack,
    canPlay: !!state.generatedTrack && !state.isPlaying
  };
};

export default useOptimizedEmotionsCare;