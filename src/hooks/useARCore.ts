/**
 * useARCore Hook - Phase 4.5
 * Manage AR sessions, permissions, and core AR functionality
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  ARService,
  arService,
  ARSessionConfig,
  AuraVisualization,
  BreathingPattern,
  EmotionData
} from '@/services/arService';
import { logger } from '@/lib/logger';

export interface UseARSessionOptions {
  autoStart?: boolean;
  config?: ARSessionConfig;
}

/**
 * Hook to manage AR sessions
 */
export function useARSession(options: UseARSessionOptions = {}) {
  const [isARSupported, setIsARSupported] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const configRef = useRef(options.config);

  useEffect(() => {
    const checkARSupport = async () => {
      try {
        const supported = await ARService.isARSupported();
        setIsARSupported(supported);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(errorMsg);
        logger.error('Failed to check AR support', err as Error, 'AR');
      } finally {
        setLoading(false);
      }
    };

    checkARSupport();
  }, []);

  const startSession = useCallback(
    async (config: ARSessionConfig = configRef.current || { experienceType: 'aura' }) => {
      try {
        setLoading(true);
        setError(null);

        const success = await arService.initARSession(config);
        if (success) {
          setSessionActive(true);
          logger.info('AR session started', { experienceType: config.experienceType }, 'AR');
        } else {
          setError('Failed to start AR session');
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(errorMsg);
        logger.error('Failed to start AR session', err as Error, 'AR');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const endSession = useCallback(async (moodAfter?: string) => {
    try {
      await arService.endARSession(moodAfter);
      setSessionActive(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      logger.error('Failed to end AR session', err as Error, 'AR');
    }
  }, []);

  const getSessionStatus = useCallback(() => {
    return arService.getSessionStatus();
  }, []);

  return {
    isARSupported,
    sessionActive,
    loading,
    error,
    startSession,
    endSession,
    getSessionStatus
  };
}

/**
 * Hook for emotional aura visualization
 */
export function useEmotionalAura(userId: string | undefined) {
  const [aura, setAura] = useState<AuraVisualization | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAura = useCallback(
    async (emotionScores: EmotionData) => {
      if (!userId) {
        setError('User ID required');
        return null;
      }

      try {
        setLoading(true);
        setError(null);

        const newAura = await arService.createAuraVisualization(userId, emotionScores);
        setAura(newAura);

        logger.info(
          'Emotional aura created',
          { emotion: newAura.dominantEmotion },
          'AR'
        );

        return newAura;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(errorMsg);
        logger.error('Failed to generate aura', err as Error, 'AR');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  return {
    aura,
    loading,
    error,
    generateAura
  };
}

/**
 * Hook for breathing AR experience
 */
export function useARBreathing(userId: string | undefined) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [pattern, setPattern] = useState<BreathingPattern | null>(null);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const metricsRef = useRef({
    avgBreathDepth: 0,
    avgBreathDuration: 0,
    consistencyScore: 0
  });

  const startBreathingSession = useCallback(
    async (
      patternType: '4-4-4' | '4-7-8' | 'box' | 'coherent' = '4-4-4',
      totalCycles: number = 10
    ) => {
      if (!userId) {
        setError('User ID required');
        return null;
      }

      try {
        setLoading(true);
        setError(null);

        const newSessionId = await arService.createBreathingARSession(
          userId,
          patternType,
          totalCycles
        );

        if (newSessionId) {
          setSessionId(newSessionId);
          const breathingPattern = arService.getBreathingPattern(patternType);
          setPattern(breathingPattern);

          logger.info(
            'Breathing AR session created',
            { patternType, totalCycles },
            'AR'
          );

          return newSessionId;
        } else {
          setError('Failed to create breathing session');
          return null;
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(errorMsg);
        logger.error('Failed to start breathing session', err as Error, 'AR');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const updateProgress = useCallback(
    async (
      cycles: number,
      breathDepth: number,
      breathDuration: number,
      consistency: number
    ) => {
      if (!sessionId) return;

      try {
        setCyclesCompleted(cycles);
        metricsRef.current = {
          avgBreathDepth: breathDepth,
          avgBreathDuration: breathDuration,
          consistencyScore: consistency
        };

        await arService.updateBreathingProgress(
          sessionId,
          cycles,
          breathDepth,
          breathDuration,
          consistency
        );
      } catch (err) {
        logger.error('Failed to update breathing progress', err as Error, 'AR');
      }
    },
    [sessionId]
  );

  const getBreathingPattern = useCallback((patternType: '4-4-4' | '4-7-8' | 'box' | 'coherent') => {
    return arService.getBreathingPattern(patternType);
  }, []);

  return {
    sessionId,
    pattern,
    cyclesCompleted,
    loading,
    error,
    startBreathingSession,
    updateProgress,
    getBreathingPattern,
    metrics: metricsRef.current
  };
}

/**
 * Hook for interactive bubbles in AR
 */
export function useARBubbles(userId: string | undefined) {
  const [bubblesActive, setBubblesActive] = useState(true);
  const [score, setScore] = useState(0);
  const [popCount, setPopCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const popBubble = useCallback((bubbleId: string, value: number = 10) => {
    try {
      setScore((prev) => prev + value);
      setPopCount((prev) => prev + 1);

      logger.info('Bubble popped', { bubbleId, value, totalScore: score + value }, 'AR');
    } catch (err) {
      logger.error('Failed to pop bubble', err as Error, 'AR');
    }
  }, [score]);

  const resetScore = useCallback(() => {
    setScore(0);
    setPopCount(0);
  }, []);

  return {
    bubblesActive,
    score,
    popCount,
    loading,
    error,
    popBubble,
    resetScore,
    setBubblesActive
  };
}

/**
 * Hook for music AR experience
 */
export function useMusicAR(userId: string | undefined) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [visualTheme, setVisualTheme] = useState<'galaxy' | 'waves' | 'particles'>('galaxy');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const metricsRef = useRef({
    timeWatchedSeconds: 0,
    averageFps: 0,
    trackInteractions: 0,
    immersionRating: 0,
    visualQualityRating: 0
  });

  const startMusicSession = useCallback(
    async (playlistId: string | null, trackIds: string[], theme: 'galaxy' | 'waves' | 'particles' = 'galaxy') => {
      if (!userId) {
        setError('User ID required');
        return null;
      }

      try {
        setLoading(true);
        setError(null);

        const newSessionId = await arService.createMusicARSession(
          userId,
          playlistId,
          trackIds,
          theme
        );

        if (newSessionId) {
          setSessionId(newSessionId);
          setVisualTheme(theme);
          setIsPlaying(true);

          logger.info(
            'Music AR session created',
            { theme, trackCount: trackIds.length },
            'AR'
          );

          return newSessionId;
        } else {
          setError('Failed to create music session');
          return null;
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(errorMsg);
        logger.error('Failed to start music session', err as Error, 'AR');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const updateMetrics = useCallback(
    async (metrics: {
      timeWatchedSeconds: number;
      averageFps: number;
      trackInteractions: number;
      immersionRating: number;
      visualQualityRating: number;
    }) => {
      if (!sessionId) return;

      try {
        metricsRef.current = metrics;

        await arService.updateMusicMetrics(
          sessionId,
          metrics.timeWatchedSeconds,
          metrics.averageFps,
          metrics.trackInteractions,
          metrics.immersionRating,
          metrics.visualQualityRating
        );
      } catch (err) {
        logger.error('Failed to update music metrics', err as Error, 'AR');
      }
    },
    [sessionId]
  );

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => prev + 1);
    metricsRef.current.trackInteractions++;
  }, []);

  const previousTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => Math.max(0, prev - 1));
    metricsRef.current.trackInteractions++;
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  return {
    sessionId,
    visualTheme,
    isPlaying,
    currentTrackIndex,
    loading,
    error,
    startMusicSession,
    updateMetrics,
    nextTrack,
    previousTrack,
    togglePlayPause,
    setVisualTheme,
    metrics: metricsRef.current
  };
}

/**
 * Hook to check AR capabilities
 */
export function useARCapabilities() {
  const [capabilities, setCapabilities] = useState<{
    supported: boolean;
    features: string[];
    deviceType: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCapabilities = async () => {
      try {
        const caps = await ARService.getARCapabilities();
        setCapabilities(caps);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(errorMsg);
        logger.error('Failed to get AR capabilities', err as Error, 'AR');
      } finally {
        setLoading(false);
      }
    };

    fetchCapabilities();
  }, []);

  return { capabilities, loading, error };
}
