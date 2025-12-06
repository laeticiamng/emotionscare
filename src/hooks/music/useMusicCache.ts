
import { useState, useEffect, useCallback, useRef } from 'react';
import { MusicPlaylist, EmotionMusicParams } from '@/types/music';

interface CacheEntry {
  playlist: MusicPlaylist;
  timestamp: number;
  emotion: string;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 10;

export const useMusicCache = () => {
  const [cache, setCache] = useState<Map<string, CacheEntry>>(new Map());
  const loadingRef = useRef<Set<string>>(new Set());

  const getCacheKey = useCallback((params: EmotionMusicParams): string => {
    return `${params.emotion}-${params.intensity || 0.5}-${params.genre || 'any'}`;
  }, []);

  const isCacheValid = useCallback((entry: CacheEntry): boolean => {
    return Date.now() - entry.timestamp < CACHE_DURATION;
  }, []);

  const getFromCache = useCallback((params: EmotionMusicParams): MusicPlaylist | null => {
    const key = getCacheKey(params);
    const entry = cache.get(key);
    
    if (entry && isCacheValid(entry)) {
      console.log(`[MusicCache] Cache hit for ${key}`);
      return entry.playlist;
    }
    
    if (entry && !isCacheValid(entry)) {
      console.log(`[MusicCache] Cache expired for ${key}`);
      setCache(prev => {
        const newCache = new Map(prev);
        newCache.delete(key);
        return newCache;
      });
    }
    
    return null;
  }, [cache, getCacheKey, isCacheValid]);

  const addToCache = useCallback((params: EmotionMusicParams, playlist: MusicPlaylist) => {
    const key = getCacheKey(params);
    
    setCache(prev => {
      const newCache = new Map(prev);
      
      // Remove oldest entries if cache is full
      if (newCache.size >= MAX_CACHE_SIZE) {
        const oldestKey = Array.from(newCache.keys())[0];
        newCache.delete(oldestKey);
      }
      
      newCache.set(key, {
        playlist,
        timestamp: Date.now(),
        emotion: params.emotion
      });
      
      console.log(`[MusicCache] Cached playlist for ${key}`);
      return newCache;
    });
  }, [getCacheKey]);

  const isLoading = useCallback((params: EmotionMusicParams): boolean => {
    const key = getCacheKey(params);
    return loadingRef.current.has(key);
  }, [getCacheKey]);

  const setLoading = useCallback((params: EmotionMusicParams, loading: boolean) => {
    const key = getCacheKey(params);
    
    if (loading) {
      loadingRef.current.add(key);
    } else {
      loadingRef.current.delete(key);
    }
  }, [getCacheKey]);

  const clearCache = useCallback(() => {
    setCache(new Map());
    loadingRef.current.clear();
    console.log('[MusicCache] Cache cleared');
  }, []);

  const getCacheStats = useCallback(() => {
    const validEntries = Array.from(cache.values()).filter(isCacheValid);
    return {
      total: cache.size,
      valid: validEntries.length,
      expired: cache.size - validEntries.length,
      emotions: [...new Set(validEntries.map(entry => entry.emotion))]
    };
  }, [cache, isCacheValid]);

  return {
    getFromCache,
    addToCache,
    isLoading,
    setLoading,
    clearCache,
    getCacheStats
  };
};
