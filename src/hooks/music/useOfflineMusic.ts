/**
 * useOfflineMusic - Hook pour gérer le mode hors-ligne de la musique
 * Gère le cache des pistes via Service Worker dédié et Cache API
 */

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';

interface CachedTrack {
  id: string;
  url: string;
  title: string;
  cachedAt: Date;
  size?: number;
}

interface UseOfflineMusicReturn {
  cachedTracks: CachedTrack[];
  isCaching: boolean;
  isOffline: boolean;
  cacheTrack: (track: { id: string; url: string; title: string }) => Promise<boolean>;
  removeCachedTrack: (trackId: string) => Promise<boolean>;
  isTrackCached: (trackId: string) => boolean;
  clearCache: () => Promise<void>;
  getCacheSize: () => Promise<number>;
  swSupported: boolean;
  swRegistered: boolean;
}

const CACHE_NAME = 'emotionscare-audio-v1';
const STORAGE_KEY = 'music:offline-tracks';
const SW_MUSIC_URL = '/sw-music.js';

export function useOfflineMusic(): UseOfflineMusicReturn {
  const { toast } = useToast();
  const [cachedTracks, setCachedTracks] = useState<CachedTrack[]>([]);
  const [isCaching, setIsCaching] = useState(false);
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const [swSupported, setSwSupported] = useState(false);
  const [swRegistered, setSwRegistered] = useState(false);

  // Check service worker support and register music SW
  useEffect(() => {
    const supported = 'serviceWorker' in navigator && 'caches' in window;
    setSwSupported(supported);
    
    if (supported && typeof navigator !== 'undefined') {
      // Register the music-specific service worker
      navigator.serviceWorker.register(SW_MUSIC_URL, { scope: '/app/music' })
        .then((registration) => {
          setSwRegistered(true);
          logger.info('[useOfflineMusic] Music SW registered', { scope: registration.scope }, 'MUSIC');
        })
        .catch((error) => {
          logger.warn('[useOfflineMusic] Music SW registration failed', { error: String(error) }, 'MUSIC');
        });
    }
  }, []);

  // Listen for online/offline events
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleOnline = () => {
      setIsOffline(false);
      toast({
        title: '📡 Connexion rétablie',
        description: 'Vous êtes de nouveau en ligne',
      });
    };
    const handleOffline = () => {
      setIsOffline(true);
      toast({
        title: '📴 Mode hors-ligne',
        description: 'Utilisation du cache local',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Load cached tracks from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const tracks = JSON.parse(stored) as CachedTrack[];
        setCachedTracks(tracks.map(t => ({
          ...t,
          cachedAt: new Date(t.cachedAt)
        })));
      }
    } catch (error) {
      logger.warn('[useOfflineMusic] Failed to load cached tracks', {}, 'MUSIC');
    }
  }, []);

  // Save cached tracks to localStorage
  const saveCachedTracks = useCallback((tracks: CachedTrack[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
      setCachedTracks(tracks);
    } catch (error) {
      logger.error('[useOfflineMusic] Failed to save cached tracks', error as Error, 'MUSIC');
    }
  }, []);

  // Cache a track using Cache API
  const cacheTrack = useCallback(async (track: { id: string; url: string; title: string }): Promise<boolean> => {
    if (!swSupported) {
      toast({
        title: 'Non supporté',
        description: 'Le mode hors-ligne n\'est pas supporté par votre navigateur',
        variant: 'destructive',
      });
      return false;
    }

    // Check if already cached
    if (cachedTracks.some(t => t.id === track.id)) {
      toast({
        title: 'Déjà en cache',
        description: `"${track.title}" est déjà disponible hors-ligne`,
      });
      return true;
    }

    setIsCaching(true);

    try {
      // Use Cache API directly
      const cache = await caches.open(CACHE_NAME);
      const response = await fetch(track.url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch audio');
      }

      // Get size before caching
      const blob = await response.blob();
      const size = blob.size;

      // Cache the response
      await cache.put(track.url, new Response(blob, {
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg',
        }
      }));

      // Update local state
      const newTrack: CachedTrack = {
        id: track.id,
        url: track.url,
        title: track.title,
        cachedAt: new Date(),
        size,
      };

      const updatedTracks = [...cachedTracks, newTrack];
      saveCachedTracks(updatedTracks);

      toast({
        title: '✅ Téléchargé',
        description: `"${track.title}" disponible hors-ligne`,
      });

      logger.info('[useOfflineMusic] Track cached', { trackId: track.id }, 'MUSIC');
      return true;

    } catch (error) {
      logger.error('[useOfflineMusic] Failed to cache track', error as Error, 'MUSIC');
      toast({
        title: 'Erreur',
        description: 'Impossible de télécharger ce morceau',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsCaching(false);
    }
  }, [swSupported, cachedTracks, saveCachedTracks, toast]);

  // Remove a cached track
  const removeCachedTrack = useCallback(async (trackId: string): Promise<boolean> => {
    const track = cachedTracks.find(t => t.id === trackId);
    if (!track) return false;

    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.delete(track.url);

      const updatedTracks = cachedTracks.filter(t => t.id !== trackId);
      saveCachedTracks(updatedTracks);

      toast({
        title: 'Supprimé',
        description: `"${track.title}" retiré du cache`,
      });

      return true;
    } catch (error) {
      logger.error('[useOfflineMusic] Failed to remove cached track', error as Error, 'MUSIC');
      return false;
    }
  }, [cachedTracks, saveCachedTracks, toast]);

  // Check if track is cached
  const isTrackCached = useCallback((trackId: string): boolean => {
    return cachedTracks.some(t => t.id === trackId);
  }, [cachedTracks]);

  // Clear all cached audio
  const clearCache = useCallback(async (): Promise<void> => {
    try {
      await caches.delete(CACHE_NAME);
      saveCachedTracks([]);
      toast({
        title: 'Cache vidé',
        description: 'Tous les morceaux hors-ligne ont été supprimés',
      });
    } catch (error) {
      logger.error('[useOfflineMusic] Failed to clear cache', error as Error, 'MUSIC');
    }
  }, [saveCachedTracks, toast]);

  // Get total cache size
  const getCacheSize = useCallback(async (): Promise<number> => {
    return cachedTracks.reduce((total, track) => total + (track.size || 0), 0);
  }, [cachedTracks]);

  return {
    cachedTracks,
    isCaching,
    isOffline,
    cacheTrack,
    removeCachedTrack,
    isTrackCached,
    clearCache,
    getCacheSize,
    swSupported,
    swRegistered,
  };
}

export default useOfflineMusic;
