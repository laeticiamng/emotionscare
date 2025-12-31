/**
 * useMusicPreGeneration
 * Hook React pour intégrer le système de pré-génération musicale anticipée
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import {
  musicPreGenerationService,
  type CacheStatus,
  type EmotionPattern,
  type EmotionPrediction,
  type PreGeneratedTrack
} from '@/services/music/MusicPreGenerationService';

export interface UseMusicPreGenerationOptions {
  autoInitialize?: boolean;
  autoAnalyze?: boolean;
  onTrackReady?: (track: PreGeneratedTrack) => void;
}

export interface UseMusicPreGenerationResult {
  // État
  isInitialized: boolean;
  isAnalyzing: boolean;
  cacheStatus: CacheStatus | null;
  patterns: EmotionPattern[];
  predictions: EmotionPrediction[];
  
  // Actions
  initialize: () => Promise<void>;
  analyzeAndPregenerate: () => Promise<void>;
  getCachedTrack: (emotion: string) => Promise<PreGeneratedTrack | null>;
  getPreloadedAudio: (emotion: string) => HTMLAudioElement | null;
  pregenerate: (emotions: string[], force?: boolean) => Promise<void>;
  refreshCacheStatus: () => Promise<void>;
  clearCache: () => void;
}

export const useMusicPreGeneration = (
  options: UseMusicPreGenerationOptions = {}
): UseMusicPreGenerationResult => {
  const { autoInitialize = true, autoAnalyze = true, onTrackReady } = options;
  const { user } = useAuth();
  const userId = user?.id;

  // État
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null);
  const [patterns, setPatterns] = useState<EmotionPattern[]>([]);
  const [predictions, setPredictions] = useState<EmotionPrediction[]>([]);

  // Refs
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const initAttemptedRef = useRef(false);

  // Initialiser le service
  const initialize = useCallback(async () => {
    if (!userId || isInitialized) return;

    try {
      logger.info('[useMusicPreGen] Initializing', { userId }, 'MUSIC');
      await musicPreGenerationService.initialize(userId, autoAnalyze);
      setIsInitialized(true);

      // S'abonner aux mises à jour en temps réel
      if (onTrackReady) {
        unsubscribeRef.current = musicPreGenerationService.subscribeToUpdates(
          userId,
          onTrackReady
        );
      }

      // Charger le statut initial
      await refreshCacheStatus();

    } catch (error) {
      logger.error('[useMusicPreGen] Initialize error', error as Error, 'MUSIC');
    }
  }, [userId, isInitialized, autoAnalyze, onTrackReady]);

  // Analyser et pré-générer
  const analyzeAndPregenerate = useCallback(async () => {
    if (!userId || isAnalyzing) return;

    setIsAnalyzing(true);
    try {
      const result = await musicPreGenerationService.analyzeAndPregenerate(userId);
      setPatterns(result.patterns);
      setPredictions(result.predictions);

      // Rafraîchir le statut du cache après l'analyse
      await refreshCacheStatus();

    } catch (error) {
      logger.error('[useMusicPreGen] Analyze error', error as Error, 'MUSIC');
    } finally {
      setIsAnalyzing(false);
    }
  }, [userId, isAnalyzing]);

  // Récupérer une piste depuis le cache
  const getCachedTrack = useCallback(async (emotion: string): Promise<PreGeneratedTrack | null> => {
    return musicPreGenerationService.getCachedTrack(emotion, userId);
  }, [userId]);

  // Récupérer un audio préchargé
  const getPreloadedAudio = useCallback((emotion: string): HTMLAudioElement | null => {
    return musicPreGenerationService.getPreloadedAudio(emotion, userId);
  }, [userId]);

  // Pré-générer manuellement
  const pregenerate = useCallback(async (emotions: string[], force = false) => {
    if (!emotions.length) return;

    setIsAnalyzing(true);
    try {
      await musicPreGenerationService.pregenerate(emotions, userId, force);
      await refreshCacheStatus();
    } catch (error) {
      logger.error('[useMusicPreGen] Pregenerate error', error as Error, 'MUSIC');
    } finally {
      setIsAnalyzing(false);
    }
  }, [userId]);

  // Rafraîchir le statut du cache
  const refreshCacheStatus = useCallback(async () => {
    try {
      const status = await musicPreGenerationService.getCacheStatus(userId);
      setCacheStatus(status);
    } catch (error) {
      logger.error('[useMusicPreGen] Cache status error', error as Error, 'MUSIC');
    }
  }, [userId]);

  // Vider le cache
  const clearCache = useCallback(() => {
    musicPreGenerationService.clearLocalCache();
    setCacheStatus(null);
    setPatterns([]);
    setPredictions([]);
  }, []);

  // Auto-initialisation
  useEffect(() => {
    if (autoInitialize && userId && !initAttemptedRef.current) {
      initAttemptedRef.current = true;
      initialize();
    }
  }, [autoInitialize, userId, initialize]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      musicPreGenerationService.stop();
    };
  }, []);

  // Rafraîchir le cache quand l'utilisateur change
  useEffect(() => {
    if (userId && isInitialized) {
      refreshCacheStatus();
    }
  }, [userId, isInitialized, refreshCacheStatus]);

  return {
    isInitialized,
    isAnalyzing,
    cacheStatus,
    patterns,
    predictions,
    initialize,
    analyzeAndPregenerate,
    getCachedTrack,
    getPreloadedAudio,
    pregenerate,
    refreshCacheStatus,
    clearCache
  };
};

export default useMusicPreGeneration;
