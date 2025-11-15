/**
 * Module Music Unified - Hook React
 * Hook pour utiliser le service musical unifié dans les composants
 *
 * @module music-unified/useMusicUnified
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { musicUnifiedService } from './musicUnifiedService';
import type {
  MusicSession,
  MusicSessionType,
  TherapeuticPlaylist,
  MusicalMood,
  PlaylistGenerationConfig,
  EmotionComponent,
  MixingStrategy,
  EmotionBlend,
  PomsState,
  PomsTrend,
  PlaybackAdaptation,
  EmotionalPoint,
  SessionStatistics,
  MusicPreset,
  EmotionalSliders,
} from './types';

interface UseMusicUnifiedReturn {
  // État
  currentSession: MusicSession | null;
  isLoading: boolean;
  error: string | null;
  currentPlaylist: TherapeuticPlaylist | null;
  currentBlend: EmotionBlend | null;
  currentPomsTrend: PomsTrend | null;
  emotionalJourney: EmotionalPoint[];
  adaptations: PlaybackAdaptation[];

  // Session management
  createSession: (
    sessionType: MusicSessionType,
    config?: any
  ) => Promise<MusicSession | null>;
  startSession: (sessionId: string) => Promise<void>;
  completeSession: (completion: any) => Promise<MusicSession | null>;
  recordEmotionalPoint: (point: Omit<EmotionalPoint, 'timestamp'>) => void;

  // Therapeutic
  generatePlaylist: (config: PlaylistGenerationConfig) => Promise<TherapeuticPlaylist | null>;
  getRecommendation: (
    currentMood: MusicalMood,
    targetMood: MusicalMood,
    emotionalState: string
  ) => Promise<any>;

  // Blending
  createMix: (config: any) => Promise<any>;
  updateBlend: (elapsedSeconds: number) => void;
  slidersToComponents: (sliders: EmotionalSliders) => EmotionComponent[];

  // Adaptive
  analyzePoms: (state: PomsState) => any;
  checkAdaptation: (
    currentPreset: string,
    pomsState: PomsState
  ) => { should: boolean; reason?: string; newPreset?: string };
  recordAdaptation: (adaptation: PlaybackAdaptation) => void;

  // Stats & Presets
  getStatistics: (startDate: Date, endDate: Date) => Promise<SessionStatistics | null>;
  createPreset: (
    name: string,
    sliders: EmotionalSliders,
    playlistId?: string
  ) => Promise<MusicPreset | null>;
  getUserPresets: () => Promise<MusicPreset[]>;

  // Utilities
  clearError: () => void;
  reset: () => void;
}

/**
 * Hook pour utiliser le service musical unifié
 *
 * @param userId - ID de l'utilisateur
 *
 * @example
 * ```tsx
 * const { createSession, generatePlaylist, currentSession } = useMusicUnified(userId);
 *
 * // Créer une session thérapeutique
 * const session = await createSession('therapeutic', {
 *   moodBefore: { primary: 'anxious', intensity: 0.7, energy: 0.4, valence: -0.5 }
 * });
 *
 * // Générer une playlist
 * const playlist = await generatePlaylist({
 *   therapeutic_goal: {
 *     current_mood: currentMood,
 *     target_mood: targetMood,
 *     emotional_state: 'anxious'
 *   }
 * });
 * ```
 */
export function useMusicUnified(userId: string): UseMusicUnifiedReturn {
  const [currentSession, setCurrentSession] = useState<MusicSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<TherapeuticPlaylist | null>(null);
  const [currentBlend, setCurrentBlend] = useState<EmotionBlend | null>(null);
  const [currentPomsTrend, setCurrentPomsTrend] = useState<PomsTrend | null>(null);
  const [emotionalJourney, setEmotionalJourney] = useState<EmotionalPoint[]>([]);
  const [adaptations, setAdaptations] = useState<PlaybackAdaptation[]>([]);

  // Refs pour tracking
  const mixingStrategyRef = useRef<MixingStrategy | null>(null);
  const emotionComponentsRef = useRef<EmotionComponent[]>([]);
  const sessionStartTimeRef = useRef<number | null>(null);
  const lastAdaptationRef = useRef<PlaybackAdaptation | null>(null);

  // ==========================================================================
  // SESSION MANAGEMENT
  // ==========================================================================

  const createSession = useCallback(
    async (sessionType: MusicSessionType, config?: any): Promise<MusicSession | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const session = await musicUnifiedService.createSession(userId, sessionType, config);
        setCurrentSession(session);
        setEmotionalJourney([]);
        setAdaptations([]);
        return session;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erreur lors de la création de la session';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  const startSession = useCallback(async (sessionId: string): Promise<void> => {
    try {
      await musicUnifiedService.startSession(sessionId);
      sessionStartTimeRef.current = Date.now();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erreur lors du démarrage de la session';
      setError(errorMessage);
    }
  }, []);

  const completeSession = useCallback(
    async (completion: any): Promise<MusicSession | null> => {
      if (!currentSession) {
        setError('Aucune session active');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const completedSession = await musicUnifiedService.completeSession(currentSession.id, {
          ...completion,
          emotionalJourney,
          adaptations,
        });

        setCurrentSession(null);
        sessionStartTimeRef.current = null;
        return completedSession;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erreur lors de la complétion de la session';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [currentSession, emotionalJourney, adaptations]
  );

  const recordEmotionalPoint = useCallback(
    (point: Omit<EmotionalPoint, 'timestamp'>) => {
      const timestamp = sessionStartTimeRef.current
        ? Math.floor((Date.now() - sessionStartTimeRef.current) / 1000)
        : 0;

      setEmotionalJourney((prev) => [...prev, { ...point, timestamp }]);
    },
    []
  );

  // ==========================================================================
  // THERAPEUTIC
  // ==========================================================================

  const generatePlaylist = useCallback(
    async (config: PlaylistGenerationConfig): Promise<TherapeuticPlaylist | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const playlist = await musicUnifiedService.generateTherapeuticPlaylist(userId, config);
        setCurrentPlaylist(playlist);
        return playlist;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erreur lors de la génération de la playlist';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  const getRecommendation = useCallback(
    async (currentMood: MusicalMood, targetMood: MusicalMood, emotionalState: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const recommendation = await musicUnifiedService.getPlaylistRecommendation(
          userId,
          currentMood,
          targetMood,
          emotionalState
        );
        setCurrentPlaylist(recommendation.playlist);
        return recommendation;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erreur lors de la génération de recommandation';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  // ==========================================================================
  // BLENDING
  // ==========================================================================

  const createMix = useCallback(
    async (config: any) => {
      setIsLoading(true);
      setError(null);

      try {
        const mix = await musicUnifiedService.createPersonalizedMix(userId, config);
        mixingStrategyRef.current = mix.strategy;
        emotionComponentsRef.current = mix.emotions;
        return mix;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erreur lors de la création du mix';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  const updateBlend = useCallback((elapsedSeconds: number) => {
    if (!mixingStrategyRef.current || emotionComponentsRef.current.length === 0) {
      return;
    }

    const blend = musicUnifiedService.calculateBlendAtTime(
      emotionComponentsRef.current,
      mixingStrategyRef.current,
      elapsedSeconds
    );

    setCurrentBlend(blend);
  }, []);

  const slidersToComponents = useCallback((sliders: EmotionalSliders): EmotionComponent[] => {
    const components = musicUnifiedService.slidersToEmotionComponents(sliders);
    emotionComponentsRef.current = components;
    return components;
  }, []);

  // ==========================================================================
  // ADAPTIVE
  // ==========================================================================

  const analyzePoms = useCallback((state: PomsState) => {
    return musicUnifiedService.analyzePoms(state);
  }, []);

  const checkAdaptation = useCallback(
    (currentPreset: string, pomsState: PomsState) => {
      return musicUnifiedService.shouldAdapt(
        currentPreset,
        pomsState,
        lastAdaptationRef.current
      );
    },
    []
  );

  const recordAdaptation = useCallback((adaptation: PlaybackAdaptation) => {
    lastAdaptationRef.current = adaptation;
    setAdaptations((prev) => [...prev, adaptation]);
  }, []);

  // ==========================================================================
  // STATS & PRESETS
  // ==========================================================================

  const getStatistics = useCallback(
    async (startDate: Date, endDate: Date): Promise<SessionStatistics | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const stats = await musicUnifiedService.getStatistics(userId, startDate, endDate);
        return stats;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erreur lors de la récupération des statistiques';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  const createPreset = useCallback(
    async (
      name: string,
      sliders: EmotionalSliders,
      playlistId?: string
    ): Promise<MusicPreset | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const preset = await musicUnifiedService.createPreset(userId, name, sliders, playlistId);
        return preset;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erreur lors de la création du preset';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  const getUserPresets = useCallback(async (): Promise<MusicPreset[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const presets = await musicUnifiedService.getUserPresets(userId);
      return presets;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erreur lors de la récupération des presets';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // ==========================================================================
  // UTILITIES
  // ==========================================================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setCurrentSession(null);
    setCurrentPlaylist(null);
    setCurrentBlend(null);
    setCurrentPomsTrend(null);
    setEmotionalJourney([]);
    setAdaptations([]);
    setError(null);
    mixingStrategyRef.current = null;
    emotionComponentsRef.current = [];
    sessionStartTimeRef.current = null;
    lastAdaptationRef.current = null;
  }, []);

  return {
    // État
    currentSession,
    isLoading,
    error,
    currentPlaylist,
    currentBlend,
    currentPomsTrend,
    emotionalJourney,
    adaptations,

    // Session management
    createSession,
    startSession,
    completeSession,
    recordEmotionalPoint,

    // Therapeutic
    generatePlaylist,
    getRecommendation,

    // Blending
    createMix,
    updateBlend,
    slidersToComponents,

    // Adaptive
    analyzePoms,
    checkAdaptation,
    recordAdaptation,

    // Stats & Presets
    getStatistics,
    createPreset,
    getUserPresets,

    // Utilities
    clearError,
    reset,
  };
}
