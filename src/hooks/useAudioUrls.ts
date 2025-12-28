/**
 * useAudioUrls Hook
 * Gestion du chargement asynchrone des URLs audio depuis Supabase Storage
 * avec fallback sur URLs externes et cache localStorage
 */

import { useState, useEffect, useMemo } from 'react';
import { getPublicMusicUrl } from '@/services/music/storage-service';
import { logger } from '@/lib/logger';

export interface AudioUrlMapping {
  [trackId: string]: string;
}

export interface AudioUrlSource {
  [trackId: string]: 'supabase' | 'fallback';
}

interface AudioUrlConfig {
  fileName: string;
  fallbackUrl: string;
}

const CACHE_KEY = 'music:audio-urls-cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 heures

interface CachedData {
  urls: AudioUrlMapping;
  sources: AudioUrlSource;
  timestamp: number;
}

/**
 * Lit le cache depuis localStorage
 */
function readCache(): CachedData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = window.localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const data: CachedData = JSON.parse(cached);
    const now = Date.now();
    
    // Vérifier si le cache est expiré
    if (now - data.timestamp > CACHE_DURATION) {
      window.localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    return data;
  } catch (error) {
    logger.warn('Failed to read audio URLs cache', error as Error, 'MUSIC');
    return null;
  }
}

/**
 * Écrit le cache dans localStorage
 */
function writeCache(urls: AudioUrlMapping, sources: AudioUrlSource): void {
  if (typeof window === 'undefined') return;
  
  try {
    const data: CachedData = {
      urls,
      sources,
      timestamp: Date.now()
    };
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    logger.warn('Failed to write audio URLs cache', error as Error, 'MUSIC');
  }
}

/**
 * Vérifie si une URL audio est accessible via HEAD request
 */
async function checkUrlAccessible(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    // no-cors ne donne pas le status, donc on vérifie juste que ça ne throw pas
    return true;
  } catch {
    return false;
  }
}

/**
 * Hook pour charger les URLs audio de manière asynchrone
 * Utilise directement les fallbacks pour éviter les problèmes de cache
 * 
 * @param config - Mapping trackId -> { fileName, fallbackUrl }
 * @returns { urls, isLoading, error }
 */
export function useAudioUrls(
  config: Record<string, AudioUrlConfig>
): {
  urls: AudioUrlMapping;
  sources: AudioUrlSource;
  isLoading: boolean;
  error: string | null;
} {
  // Générer les URLs fallback de manière stable
  const fallbackUrls = useMemo(() => {
    const urls: AudioUrlMapping = {};
    Object.entries(config).forEach(([trackId, { fallbackUrl }]) => {
      urls[trackId] = fallbackUrl;
    });
    return urls;
  }, [config]);

  const fallbackSources = useMemo(() => {
    const sources: AudioUrlSource = {};
    Object.keys(config).forEach(trackId => {
      sources[trackId] = 'fallback';
    });
    return sources;
  }, [config]);

  const [urls, setUrls] = useState<AudioUrlMapping>(() => {
    // Toujours vider le cache au démarrage pour éviter les URLs cassées
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(CACHE_KEY);
      } catch (e) {
        // Ignore
      }
    }
    // Utiliser directement les fallbacks (pas de cache potentiellement corrompu)
    return fallbackUrls;
  });
  
  const [sources, setSources] = useState<AudioUrlSource>(() => fallbackSources);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function verifyAndLoadUrls() {
      // Vérifier le cache
      const cached = readCache();
      if (cached && cached.urls && cached.sources) {
        if (isMounted) {
          setUrls(cached.urls);
          setSources(cached.sources);
        }
        return;
      }
      
      setIsLoading(true);
      
      try {
        // On utilise directement les fallbacks car Supabase Storage
        // ne contient pas les fichiers audio pour le moment
        // Cela évite les erreurs 404 répétées
        
        const resolvedUrls: AudioUrlMapping = {};
        const resolvedSources: AudioUrlSource = {};
        
        Object.entries(config).forEach(([trackId, { fallbackUrl }]) => {
          resolvedUrls[trackId] = fallbackUrl;
          resolvedSources[trackId] = 'fallback';
        });
        
        if (isMounted) {
          setUrls(resolvedUrls);
          setSources(resolvedSources);
          writeCache(resolvedUrls, resolvedSources);
          logger.debug('Audio URLs using fallbacks', { count: Object.keys(resolvedUrls).length }, 'MUSIC');
        }
      } catch (err) {
        if (isMounted) {
          logger.error('Failed to load audio URLs', err as Error, 'MUSIC');
          setError('Erreur lors du chargement des URLs audio');
          // En cas d'erreur, utiliser les fallbacks
          setUrls(fallbackUrls);
          setSources(fallbackSources);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    
    verifyAndLoadUrls();
    
    return () => {
      isMounted = false;
    };
  }, [config, fallbackUrls, fallbackSources]);

  return { urls, sources, isLoading, error };
}

/**
 * Utilitaire pour vider le cache (utile pour debug)
 */
export function clearAudioUrlsCache(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(CACHE_KEY);
    logger.debug('Audio URLs cache cleared', undefined, 'MUSIC');
  } catch (error) {
    logger.warn('Failed to clear audio URLs cache', error as Error, 'MUSIC');
  }
}
