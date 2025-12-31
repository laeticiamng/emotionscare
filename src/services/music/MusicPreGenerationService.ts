/**
 * MusicPreGenerationService
 * Service client pour la pré-génération et le cache intelligent de musique
 * Anticipe les besoins musicaux basés sur les patterns émotionnels
 */
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

// Types
export interface EmotionPattern {
  emotion: string;
  frequency: number;
  avgIntensity: number;
  timeSlots: string[];
  lastSeen: string;
}

export interface EmotionPrediction {
  emotion: string;
  probability: number;
  reason: string;
}

export interface PreGeneratedTrack {
  id: string;
  emotion: string;
  audioUrl: string;
  status: 'generating' | 'completed' | 'failed';
  duration?: number;
  bpm?: number;
  style?: string;
  createdAt: string;
  expiresAt?: string;
}

export interface CacheStatus {
  totalCached: number;
  byEmotion: Record<string, {
    status: string;
    audioUrl?: string;
    updatedAt: string;
  }>;
  globalCached: number;
}

// Cache local en mémoire pour les pistes pré-chargées
const localAudioCache = new Map<string, {
  audio: HTMLAudioElement;
  blob: Blob;
  loadedAt: number;
}>();

const MAX_LOCAL_CACHE_SIZE = 5;
const LOCAL_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

class MusicPreGenerationService {
  private analysisInterval: NodeJS.Timeout | null = null;
  private isAnalyzing = false;
  private lastAnalysis: Date | null = null;

  /**
   * Initialiser le service avec analyse automatique périodique
   */
  async initialize(userId: string, autoAnalyze = true): Promise<void> {
    logger.info('[MusicPreGen] Initializing service', { userId, autoAnalyze }, 'MUSIC');

    // Analyse initiale
    await this.analyzeAndPregenerate(userId);

    // Configurer l'analyse périodique
    if (autoAnalyze) {
      this.startPeriodicAnalysis(userId);
    }
  }

  /**
   * Arrêter l'analyse périodique
   */
  stop(): void {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }
    logger.info('[MusicPreGen] Service stopped', undefined, 'MUSIC');
  }

  /**
   * Démarrer l'analyse périodique (toutes les 15 minutes)
   */
  private startPeriodicAnalysis(userId: string): void {
    this.analysisInterval = setInterval(async () => {
      await this.analyzeAndPregenerate(userId);
    }, 15 * 60 * 1000); // 15 minutes
  }

  /**
   * Analyser les patterns et pré-générer la musique
   */
  async analyzeAndPregenerate(userId: string): Promise<{
    patterns: EmotionPattern[];
    predictions: EmotionPrediction[];
    pregenerationTasks: Array<{ emotion: string; status: string }>;
  }> {
    if (this.isAnalyzing) {
      logger.debug('[MusicPreGen] Analysis already in progress', undefined, 'MUSIC');
      return { patterns: [], predictions: [], pregenerationTasks: [] };
    }

    this.isAnalyzing = true;
    this.lastAnalysis = new Date();

    try {
      logger.info('[MusicPreGen] Starting analysis', { userId }, 'MUSIC');

      const { data, error } = await supabase.functions.invoke('music-pregeneration-engine', {
        body: { action: 'analyze', userId }
      });

      if (error) {
        throw error;
      }

      logger.info('[MusicPreGen] Analysis complete', {
        patterns: data.patterns?.length,
        predictions: data.predictions?.length,
        tasks: data.pregenerationTasks?.length
      }, 'MUSIC');

      // Pré-charger les pistes prioritaires en local
      await this.preloadTopPredictions(data.predictions || []);

      return {
        patterns: data.patterns || [],
        predictions: data.predictions || [],
        pregenerationTasks: data.pregenerationTasks || []
      };
    } catch (error) {
      logger.error('[MusicPreGen] Analysis error', error as Error, 'MUSIC');
      return { patterns: [], predictions: [], pregenerationTasks: [] };
    } finally {
      this.isAnalyzing = false;
    }
  }

  /**
   * Pré-générer manuellement pour des émotions spécifiques
   */
  async pregenerate(
    emotions: string[],
    userId?: string,
    forceRegenerate = false
  ): Promise<Array<{ emotion: string; status: string; taskId?: string }>> {
    try {
      logger.info('[MusicPreGen] Manual pregeneration', { emotions, forceRegenerate }, 'MUSIC');

      const { data, error } = await supabase.functions.invoke('music-pregeneration-engine', {
        body: {
          action: 'pregenerate',
          emotions,
          userId,
          forceRegenerate
        }
      });

      if (error) throw error;

      return data.results || [];
    } catch (error) {
      logger.error('[MusicPreGen] Pregeneration error', error as Error, 'MUSIC');
      return emotions.map(e => ({ emotion: e, status: 'error' }));
    }
  }

  /**
   * Récupérer une piste pré-générée (avec fallback)
   */
  async getCachedTrack(
    emotion: string,
    userId?: string
  ): Promise<PreGeneratedTrack | null> {
    try {
      // Vérifier d'abord le cache local
      const localKey = `${userId || 'global'}_${emotion}`;
      const localEntry = localAudioCache.get(localKey);

      if (localEntry && Date.now() - localEntry.loadedAt < LOCAL_CACHE_TTL) {
        logger.debug('[MusicPreGen] Found in local cache', { emotion }, 'MUSIC');
        return {
          id: localKey,
          emotion,
          audioUrl: URL.createObjectURL(localEntry.blob),
          status: 'completed',
          createdAt: new Date(localEntry.loadedAt).toISOString()
        };
      }

      // Sinon chercher dans le backend
      const { data, error } = await supabase.functions.invoke('music-pregeneration-engine', {
        body: {
          action: 'get-cached',
          emotions: [emotion],
          userId
        }
      });

      if (error) throw error;

      if (data.fromCache && data.track) {
        logger.info('[MusicPreGen] Retrieved from backend cache', { emotion }, 'MUSIC');

        // Précharger en local pour la prochaine fois
        if (data.track.audio_url) {
          this.preloadAudio(localKey, data.track.audio_url);
        }

        return {
          id: data.track.id,
          emotion: data.track.emotion,
          audioUrl: data.track.audio_url,
          status: data.track.status,
          duration: data.track.duration,
          bpm: data.track.bpm,
          createdAt: data.track.created_at
        };
      }

      return null;
    } catch (error) {
      logger.error('[MusicPreGen] getCachedTrack error', error as Error, 'MUSIC');
      return null;
    }
  }

  /**
   * Obtenir le statut du cache
   */
  async getCacheStatus(userId?: string): Promise<CacheStatus> {
    try {
      const { data, error } = await supabase.functions.invoke('music-pregeneration-engine', {
        body: { action: 'status', userId }
      });

      if (error) throw error;

      return data.cache || {
        totalCached: 0,
        byEmotion: {},
        globalCached: 0
      };
    } catch (error) {
      logger.error('[MusicPreGen] getCacheStatus error', error as Error, 'MUSIC');
      return { totalCached: 0, byEmotion: {}, globalCached: 0 };
    }
  }

  /**
   * Pré-charger les pistes pour les prédictions prioritaires
   */
  private async preloadTopPredictions(predictions: EmotionPrediction[]): Promise<void> {
    const topPredictions = predictions.slice(0, 3);

    for (const prediction of topPredictions) {
      if (prediction.probability > 0.3) {
        const track = await this.getCachedTrack(prediction.emotion);
        if (track?.audioUrl) {
          await this.preloadAudio(`pregen_${prediction.emotion}`, track.audioUrl);
        }
      }
    }
  }

  /**
   * Précharger un fichier audio en local
   */
  private async preloadAudio(key: string, url: string): Promise<void> {
    try {
      // Limiter la taille du cache
      if (localAudioCache.size >= MAX_LOCAL_CACHE_SIZE) {
        const oldestKey = this.getOldestCacheKey();
        if (oldestKey) {
          const entry = localAudioCache.get(oldestKey);
          if (entry?.audio) {
            entry.audio.src = '';
          }
          localAudioCache.delete(oldestKey);
        }
      }

      // Télécharger et cacher
      const response = await fetch(url);
      if (!response.ok) return;

      const blob = await response.blob();
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = URL.createObjectURL(blob);

      localAudioCache.set(key, {
        audio,
        blob,
        loadedAt: Date.now()
      });

      logger.debug('[MusicPreGen] Audio preloaded', { key }, 'MUSIC');
    } catch (error) {
      logger.warn('[MusicPreGen] Preload failed', { key, error }, 'MUSIC');
    }
  }

  /**
   * Obtenir la clé la plus ancienne du cache
   */
  private getOldestCacheKey(): string | null {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    localAudioCache.forEach((entry, key) => {
      if (entry.loadedAt < oldestTime) {
        oldestTime = entry.loadedAt;
        oldestKey = key;
      }
    });

    return oldestKey;
  }

  /**
   * Obtenir un audio préchargé depuis le cache local
   */
  getPreloadedAudio(emotion: string, userId?: string): HTMLAudioElement | null {
    const key = `${userId || 'global'}_${emotion}`;
    const entry = localAudioCache.get(key);

    if (entry && Date.now() - entry.loadedAt < LOCAL_CACHE_TTL) {
      return entry.audio;
    }

    // Essayer la clé générique
    const genericEntry = localAudioCache.get(`pregen_${emotion}`);
    if (genericEntry && Date.now() - genericEntry.loadedAt < LOCAL_CACHE_TTL) {
      return genericEntry.audio;
    }

    return null;
  }

  /**
   * Vider le cache local
   */
  clearLocalCache(): void {
    localAudioCache.forEach(entry => {
      if (entry.audio) {
        entry.audio.src = '';
      }
    });
    localAudioCache.clear();
    logger.info('[MusicPreGen] Local cache cleared', undefined, 'MUSIC');
  }

  /**
   * Nettoyer le cache backend
   */
  async cleanupBackendCache(): Promise<number> {
    try {
      const { data, error } = await supabase.functions.invoke('music-pregeneration-engine', {
        body: { action: 'cleanup' }
      });

      if (error) throw error;

      return data.cleanedCount || 0;
    } catch (error) {
      logger.error('[MusicPreGen] Cleanup error', error as Error, 'MUSIC');
      return 0;
    }
  }

  /**
   * Écouter les mises à jour du cache en temps réel
   */
  subscribeToUpdates(
    userId: string,
    onUpdate: (track: PreGeneratedTrack) => void
  ): () => void {
    const channel = supabase
      .channel('music-pregeneration-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'music_pregeneration_cache',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const track = payload.new as any;
          if (track.status === 'completed' && track.audio_url) {
            onUpdate({
              id: track.id,
              emotion: track.emotion,
              audioUrl: track.audio_url,
              status: track.status,
              duration: track.duration,
              bpm: track.bpm,
              createdAt: track.created_at
            });

            // Précharger le nouvel audio
            this.preloadAudio(`${userId}_${track.emotion}`, track.audio_url);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}

// Export singleton
export const musicPreGenerationService = new MusicPreGenerationService();
export default musicPreGenerationService;
