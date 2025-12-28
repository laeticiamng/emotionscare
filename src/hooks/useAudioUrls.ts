/**
 * useAudioUrls Hook
 * Retourne directement les URLs fallback pour éviter les problèmes avec Supabase Storage
 * Les fichiers audio de démonstration ne sont pas sur Supabase
 */

import { useMemo, useEffect } from 'react';

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

// Clés de cache à nettoyer (anciennes URLs potentiellement corrompues)
const CACHE_KEYS_TO_CLEAR = [
  'music:audio-urls-cache',
  'music:history',
  'music:player-state',
  'music:current-track',
  'music:playlist',
];

/**
 * Hook pour obtenir les URLs audio
 * Utilise TOUJOURS les fallbacks car les fichiers ne sont pas sur Supabase Storage
 */
export function useAudioUrls(
  config: Record<string, AudioUrlConfig>
): {
  urls: AudioUrlMapping;
  sources: AudioUrlSource;
  isLoading: boolean;
  error: string | null;
} {
  // Nettoyer TOUS les caches au montage pour éviter les URLs Supabase corrompues
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        CACHE_KEYS_TO_CLEAR.forEach(key => {
          window.localStorage.removeItem(key);
        });
        // Nettoyer aussi tout ce qui commence par 'music:'
        Object.keys(window.localStorage).forEach(key => {
          if (key.startsWith('music:')) {
            window.localStorage.removeItem(key);
          }
        });
      } catch {
        // Ignore silently
      }
    }
  }, []);

  // Retourner directement les URLs fallback
  const urls = useMemo(() => {
    const result: AudioUrlMapping = {};
    Object.entries(config).forEach(([trackId, { fallbackUrl }]) => {
      result[trackId] = fallbackUrl;
    });
    return result;
  }, [config]);

  const sources = useMemo(() => {
    const result: AudioUrlSource = {};
    Object.keys(config).forEach(trackId => {
      result[trackId] = 'fallback';
    });
    return result;
  }, [config]);

  return { urls, sources, isLoading: false, error: null };
}

/**
 * Utilitaire pour vider le cache (utile pour debug)
 */
export function clearAudioUrlsCache(): void {
  if (typeof window === 'undefined') return;
  try {
    CACHE_KEYS_TO_CLEAR.forEach(key => {
      window.localStorage.removeItem(key);
    });
    Object.keys(window.localStorage).forEach(key => {
      if (key.startsWith('music:')) {
        window.localStorage.removeItem(key);
      }
    });
  } catch {
    // Ignore silently
  }
}
