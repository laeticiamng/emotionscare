/**
 * useMusicOffline - Gestion du mode hors-ligne pour la musique
 * Permet de télécharger et jouer des pistes en cache
 */

import { useState, useCallback, useEffect } from 'react';
import { logger } from '@/lib/logger';
import type { MusicTrack } from '@/types/music';

interface CachedTrack {
  id: string;
  track: MusicTrack;
  blob: Blob;
  cachedAt: string;
  size: number;
}

interface OfflineStats {
  totalCached: number;
  totalSize: number;
  lastSync: string | null;
}

const DB_NAME = 'emotionscare-music-offline';
const DB_VERSION = 1;
const STORE_NAME = 'tracks';

export const useMusicOffline = () => {
  const [cachedTracks, setCachedTracks] = useState<CachedTrack[]>([]);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [stats, setStats] = useState<OfflineStats>({
    totalCached: 0,
    totalSize: 0,
    lastSync: null,
  });

  // Ouvrir la base IndexedDB
  const openDB = useCallback((): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }, []);

  // Charger les pistes en cache
  const loadCachedTracks = useCallback(async () => {
    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      return new Promise<CachedTrack[]>((resolve) => {
        request.onsuccess = () => {
          const tracks = request.result as CachedTrack[];
          setCachedTracks(tracks);
          setStats({
            totalCached: tracks.length,
            totalSize: tracks.reduce((acc, t) => acc + t.size, 0),
            lastSync: tracks.length > 0 
              ? tracks.sort((a, b) => new Date(b.cachedAt).getTime() - new Date(a.cachedAt).getTime())[0].cachedAt
              : null,
          });
          resolve(tracks);
        };
        request.onerror = () => resolve([]);
      });
    } catch (error) {
      logger.warn('Failed to load cached tracks', error, 'MUSIC');
      return [];
    }
  }, [openDB]);

  // Télécharger une piste pour le mode hors-ligne
  const downloadTrack = useCallback(async (track: MusicTrack): Promise<boolean> => {
    if (!track.url) return false;

    setDownloading(track.id);

    try {
      const response = await fetch(track.url);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      
      const cachedTrack: CachedTrack = {
        id: track.id,
        track,
        blob,
        cachedAt: new Date().toISOString(),
        size: blob.size,
      };

      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      await new Promise<void>((resolve, reject) => {
        const request = store.put(cachedTrack);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      await loadCachedTracks();
      return true;
    } catch (error) {
      logger.error('Failed to download track for offline', error as Error, 'MUSIC');
      return false;
    } finally {
      setDownloading(null);
    }
  }, [openDB, loadCachedTracks]);

  // Supprimer une piste du cache
  const removeFromCache = useCallback(async (trackId: string): Promise<boolean> => {
    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      await new Promise<void>((resolve, reject) => {
        const request = store.delete(trackId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      await loadCachedTracks();
      return true;
    } catch (error) {
      logger.error('Failed to remove track from cache', error as Error, 'MUSIC');
      return false;
    }
  }, [openDB, loadCachedTracks]);

  // Vider tout le cache
  const clearCache = useCallback(async (): Promise<boolean> => {
    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      await new Promise<void>((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      setCachedTracks([]);
      setStats({ totalCached: 0, totalSize: 0, lastSync: null });
      return true;
    } catch (error) {
      logger.error('Failed to clear music cache', error as Error, 'MUSIC');
      return false;
    }
  }, [openDB]);

  // Obtenir l'URL de lecture (cache ou en ligne)
  const getPlaybackUrl = useCallback((track: MusicTrack): string => {
    const cached = cachedTracks.find(t => t.id === track.id);
    if (cached) {
      return URL.createObjectURL(cached.blob);
    }
    return track.url || '';
  }, [cachedTracks]);

  // Vérifier si une piste est en cache
  const isTrackCached = useCallback((trackId: string): boolean => {
    return cachedTracks.some(t => t.id === trackId);
  }, [cachedTracks]);

  // Surveiller la connectivité
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Charger les pistes au montage
  useEffect(() => {
    loadCachedTracks();
  }, [loadCachedTracks]);

  return {
    cachedTracks,
    isOnline,
    downloading,
    stats,
    downloadTrack,
    removeFromCache,
    clearCache,
    getPlaybackUrl,
    isTrackCached,
    refresh: loadCachedTracks,
  };
};
