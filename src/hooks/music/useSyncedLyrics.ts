/**
 * Hook pour récupérer et afficher les paroles d'un track
 * Connecté à l'API Suno lyrics
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface LyricLine {
  time: number;
  text: string;
  translation?: string;
}

export interface LRCData {
  title?: string;
  artist?: string;
  album?: string;
  by?: string;
  offset?: number;
  lines: LyricLine[];
}

interface UseSyncedLyricsOptions {
  trackId?: string;
  trackTitle?: string;
  autoFetch?: boolean;
}

interface UseSyncedLyricsReturn {
  lrcData: LRCData | null;
  isLoading: boolean;
  error: string | null;
  fetchLyrics: (prompt?: string) => Promise<void>;
  parseLRC: (lrc: string) => LRCData;
}

/**
 * Parse un fichier LRC en objet structuré
 */
function parseLRC(lrc: string): LRCData {
  const lines: LyricLine[] = [];
  const metadata: Partial<LRCData> = {};

  const lrcLines = lrc.split('\n');

  for (const line of lrcLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Parse metadata [key:value]
    const metaMatch = trimmed.match(/^\[([a-z]+):(.+)\]$/i);
    if (metaMatch) {
      const [, key, value] = metaMatch;
      switch (key.toLowerCase()) {
        case 'ti':
          metadata.title = value;
          break;
        case 'ar':
          metadata.artist = value;
          break;
        case 'al':
          metadata.album = value;
          break;
        case 'by':
          metadata.by = value;
          break;
        case 'offset':
          metadata.offset = parseInt(value, 10);
          break;
      }
      continue;
    }

    // Parse time tags [mm:ss.xx]
    const timeTagRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;
    const times: number[] = [];
    let match: RegExpExecArray | null;

    while ((match = timeTagRegex.exec(trimmed)) !== null) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const centiseconds = parseInt(match[3].padEnd(3, '0'), 10);
      const timeInSeconds = minutes * 60 + seconds + centiseconds / 1000;
      times.push(timeInSeconds);
    }

    // Extract text after time tags
    const text = trimmed.replace(timeTagRegex, '').trim();

    // Add line for each time tag
    times.forEach(time => {
      lines.push({ time, text });
    });
  }

  // Sort by time
  lines.sort((a, b) => a.time - b.time);

  return {
    ...metadata,
    lines
  };
}

/**
 * Convertit les paroles brutes (text simple) en format LRC simulé
 */
function textToLRC(text: string, title?: string): LRCData {
  const lines = text.split('\n').filter(line => line.trim());
  const avgDuration = 4; // 4 secondes par ligne en moyenne

  return {
    title,
    lines: lines.map((line, index) => ({
      time: index * avgDuration,
      text: line.trim()
    }))
  };
}

export function useSyncedLyrics(options: UseSyncedLyricsOptions = {}): UseSyncedLyricsReturn {
 const { trackTitle, autoFetch = false } = options;

  const [lrcData, setLrcData] = useState<LRCData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLyrics = useCallback(async (prompt?: string) => {
    const searchPrompt = prompt || trackTitle || '';
    
    if (!searchPrompt) {
      setError('Aucun titre ou prompt fourni');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      logger.info('[useSyncedLyrics] Fetching lyrics for:', { prompt: searchPrompt }, 'Hooks');

      // Appeler l'API Suno pour générer des paroles
      const { data, error: fnError } = await supabase.functions.invoke('suno-lyrics', {
        body: { action: 'generate', prompt: searchPrompt }
      });

      if (fnError) throw fnError;

      if (!data?.success || !data?.data?.taskId) {
        throw new Error(data?.error || 'Failed to start lyrics generation');
      }

      const taskId = data.data.taskId;

      // Poll pour le résultat
      let attempts = 0;
      const maxAttempts = 30;

      const pollForLyrics = async (): Promise<void> => {
        if (attempts >= maxAttempts) {
          throw new Error('Lyrics generation timeout');
        }

        const { data: statusData, error: statusError } = await supabase.functions.invoke('suno-lyrics', {
          body: { action: 'status', taskId }
        });

        if (statusError) throw statusError;

        if (statusData?.data?.status === 'completed' && statusData?.data?.lyrics) {
          // Convertir les paroles en format LRC
          const lrc = textToLRC(statusData.data.lyrics, statusData.data.title);
          setLrcData(lrc);
          logger.info('[useSyncedLyrics] Lyrics fetched successfully', undefined, 'Hooks');
          return;
        }

        // Continue polling
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 2000));
        return pollForLyrics();
      };

      await pollForLyrics();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      logger.error('[useSyncedLyrics] Error fetching lyrics:', err as Error, 'Hooks');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [trackTitle]);

  // Auto-fetch si demandé
  useEffect(() => {
    if (autoFetch && trackTitle && !lrcData && !isLoading) {
      fetchLyrics();
    }
  }, [autoFetch, trackTitle, lrcData, isLoading, fetchLyrics]);

  return {
    lrcData,
    isLoading,
    error,
    fetchLyrics,
    parseLRC
  };
}

export default useSyncedLyrics;
