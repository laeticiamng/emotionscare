
import { useState, useCallback, useRef, useEffect } from 'react';
import { MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { useMusic } from '@/hooks/useMusic';
import { useMusicCache } from './useMusicCache';
import { toast } from '@/hooks/use-toast';

const DEBOUNCE_DELAY = 300;

export const useOptimizedMusicRecommendation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { loadPlaylistForEmotion } = useMusic();
  const cache = useMusicCache();
  const debounceRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  const loadRecommendation = useCallback(async (
    params: EmotionMusicParams,
    options: { useCache?: boolean; showToast?: boolean } = {}
  ): Promise<MusicPlaylist | null> => {
    const { useCache = true, showToast = true } = options;

    // Check cache first
    if (useCache) {
      const cachedPlaylist = cache.getFromCache(params);
      if (cachedPlaylist) {
        setCurrentPlaylist(cachedPlaylist);
        setError(null);
        return cachedPlaylist;
      }
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Check if already loading
    if (cache.isLoading(params)) {
      console.log('[MusicRecommendation] Request already in progress');
      return null;
    }

    abortControllerRef.current = new AbortController();
    cache.setLoading(params, true);
    setIsLoading(true);
    setError(null);

    try {
      if (!loadPlaylistForEmotion) {
        throw new Error('Service de musique non disponible');
      }

      const playlist = await loadPlaylistForEmotion(params);
      
      if (playlist) {
        cache.addToCache(params, playlist);
        setCurrentPlaylist(playlist);
        
        if (showToast) {
          toast({
            title: "Playlist chargée",
            description: `${playlist.tracks?.length || 0} morceaux pour ${params.emotion}`,
          });
        }
        
        return playlist;
      } else {
        setError('Aucune playlist trouvée');
        return null;
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('[MusicRecommendation] Request aborted');
        return null;
      }
      
      const errorMessage = err.message || 'Erreur lors du chargement';
      setError(errorMessage);
      
      if (showToast) {
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      return null;
    } finally {
      cache.setLoading(params, false);
      setIsLoading(false);
    }
  }, [loadPlaylistForEmotion, cache, toast]);

  const debouncedLoadRecommendation = useCallback((
    params: EmotionMusicParams,
    options?: { useCache?: boolean; showToast?: boolean }
  ) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      loadRecommendation(params, options);
    }, DEBOUNCE_DELAY);
  }, [loadRecommendation]);

  const preloadRecommendation = useCallback(async (params: EmotionMusicParams) => {
    // Silent preload without UI updates
    await loadRecommendation(params, { useCache: true, showToast: false });
  }, [loadRecommendation]);

  const refreshRecommendation = useCallback(async (params: EmotionMusicParams) => {
    // Force refresh bypassing cache
    return await loadRecommendation(params, { useCache: false, showToast: true });
  }, [loadRecommendation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    currentPlaylist,
    isLoading,
    error,
    loadRecommendation,
    debouncedLoadRecommendation,
    preloadRecommendation,
    refreshRecommendation,
    cacheStats: cache.getCacheStats(),
    clearCache: cache.clearCache
  };
};
