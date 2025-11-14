/**
 * useAudioUrls Hook
 * Gestion du chargement asynchrone des URLs audio depuis Supabase Storage
 * avec fallback sur URLs externes et cache localStorage
 */

import { useState, useEffect } from 'react';
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
  timestamp: number;
}

/**
 * Lit le cache depuis localStorage
 */
function readCache(): AudioUrlMapping | null {
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
    
    return data.urls;
  } catch (error) {
    logger.warn('Failed to read audio URLs cache', error as Error, 'MUSIC');
    return null;
  }
}

/**
 * Écrit le cache dans localStorage
 */
function writeCache(urls: AudioUrlMapping): void {
  if (typeof window === 'undefined') return;
  
  try {
    const data: CachedData = {
      urls,
      timestamp: Date.now()
    };
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    logger.warn('Failed to write audio URLs cache', error as Error, 'MUSIC');
  }
}

/**
 * Hook pour charger les URLs audio de manière asynchrone
 * 
 * @param config - Mapping trackId -> { fileName, fallbackUrl }
 * @returns { urls, isLoading, error }
 * 
 * @example
 * const { urls, isLoading } = useAudioUrls({
 *   'vinyl-1': { fileName: 'ambient-soft.mp3', fallbackUrl: 'https://...' },
 *   'vinyl-2': { fileName: 'focus-clarity.mp3', fallbackUrl: 'https://...' }
 * });
 */
export function useAudioUrls(
  config: Record<string, AudioUrlConfig>
): {
  urls: AudioUrlMapping;
  sources: AudioUrlSource;
  isLoading: boolean;
  error: string | null;
} {
  const [urls, setUrls] = useState<AudioUrlMapping>(() => {
    // Initialiser avec le cache ou les fallbacks
    const cached = readCache();
    if (cached) {
      logger.debug('Audio URLs loaded from cache', { count: Object.keys(cached).length }, 'MUSIC');
      return cached;
    }
    
    // Sinon, utiliser les fallbacks par défaut
    const fallbackUrls: AudioUrlMapping = {};
    Object.entries(config).forEach(([trackId, { fallbackUrl }]) => {
      fallbackUrls[trackId] = fallbackUrl;
    });
    return fallbackUrls;
  });
  
  const [sources, setSources] = useState<AudioUrlSource>(() => {
    // Initialiser toutes les sources comme fallback
    const initialSources: AudioUrlSource = {};
    Object.keys(config).forEach(trackId => {
      initialSources[trackId] = 'fallback';
    });
    return initialSources;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function loadSupabaseUrls() {
      // Si on a déjà du cache, pas besoin de recharger
      const cached = readCache();
      if (cached) {
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      const supabaseUrls: AudioUrlMapping = {};
      let successCount = 0;
      let failCount = 0;
      
      const urlSources: AudioUrlSource = {};
      
      try {
        // Charger toutes les URLs en parallèle
        const promises = Object.entries(config).map(async ([trackId, { fileName, fallbackUrl }]) => {
          try {
            const supabaseUrl = await getPublicMusicUrl(fileName);
            if (supabaseUrl) {
              supabaseUrls[trackId] = supabaseUrl;
              urlSources[trackId] = 'supabase';
              successCount++;
            } else {
              supabaseUrls[trackId] = fallbackUrl;
              urlSources[trackId] = 'fallback';
              failCount++;
            }
          } catch (err) {
            logger.warn(`Failed to load Supabase URL for ${fileName}`, err as Error, 'MUSIC');
            supabaseUrls[trackId] = fallbackUrl;
            urlSources[trackId] = 'fallback';
            failCount++;
          }
        });
        
        await Promise.all(promises);
        
        if (!isMounted) return;
        
        // Si au moins une URL Supabase a fonctionné, mettre à jour
        if (successCount > 0) {
          setUrls(supabaseUrls);
          setSources(urlSources);
          writeCache(supabaseUrls);
          logger.info(
            'Audio URLs loaded from Supabase Storage',
            { success: successCount, failed: failCount },
            'MUSIC'
          );
        } else {
          // Toutes ont échoué, garder les fallbacks
          logger.warn(
            'All Supabase URLs failed, using fallbacks',
            { count: failCount },
            'MUSIC'
          );
          setError('Supabase Storage non disponible, URLs de secours utilisées');
        }
        
      } catch (err) {
        if (!isMounted) return;
        
        const errorMsg = 'Failed to load audio URLs from Supabase';
        logger.error(errorMsg, err as Error, 'MUSIC');
        setError(errorMsg);
        
        // En cas d'erreur globale, utiliser les fallbacks
        const fallbackUrls: AudioUrlMapping = {};
        Object.entries(config).forEach(([trackId, { fallbackUrl }]) => {
          fallbackUrls[trackId] = fallbackUrl;
        });
        setUrls(fallbackUrls);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    
    loadSupabaseUrls();
    
    return () => {
      isMounted = false;
    };
  }, [config]);

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
