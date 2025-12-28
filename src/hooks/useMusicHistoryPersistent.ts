/**
 * useMusicHistoryPersistent - Hook pour historique d'écoute persistant
 * Synchronise automatiquement avec Supabase + localStorage fallback
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import type { MusicTrack } from '@/types/music';
import { saveHistoryEntry, getRecentlyPlayed, calculateCompletionRate } from '@/services/music/history-service';

interface HistoryEntry {
  track: MusicTrack;
  playedAt: string;
  listenDuration?: number;
  completionRate?: number;
}

interface UseMusicHistoryPersistentReturn {
  history: HistoryEntry[];
  isLoading: boolean;
  addToHistory: (track: MusicTrack, duration?: number) => Promise<void>;
  clearHistory: () => Promise<void>;
  getRecentTracks: (limit?: number) => HistoryEntry[];
  updatePlayDuration: (trackId: string, duration: number, totalDuration: number) => void;
}

const LOCAL_STORAGE_KEY = 'music:history:persistent';
const MAX_LOCAL_HISTORY = 100;

export function useMusicHistoryPersistent(): UseMusicHistoryPersistentReturn {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const playStartTimeRef = useRef<Record<string, number>>({});

  // Load history on mount
  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        if (user) {
          // Load from Supabase
          const dbHistory = await getRecentlyPlayed(50);
          const entries: HistoryEntry[] = dbHistory.map(entry => ({
            track: {
              id: entry.track_id,
              title: entry.track_title || 'Unknown',
              artist: entry.track_artist || 'Unknown',
              url: entry.track_url || '',
              audioUrl: entry.track_url || '',
              duration: entry.track_duration || 0,
              emotion: entry.emotion || undefined,
              mood: entry.mood || undefined,
            },
            playedAt: entry.played_at,
            listenDuration: entry.listen_duration || undefined,
            completionRate: entry.completion_rate || undefined,
          }));
          setHistory(entries);
          logger.info(`Loaded ${entries.length} history entries from DB`, {}, 'MUSIC');
        } else {
          // Load from localStorage for anonymous users
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            setHistory(parsed.slice(0, MAX_LOCAL_HISTORY));
          }
        }
      } catch (error) {
        logger.error('Failed to load music history', error as Error, 'MUSIC');
        // Fallback to localStorage
        try {
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (stored) {
            setHistory(JSON.parse(stored).slice(0, MAX_LOCAL_HISTORY));
          }
        } catch {
          // Ignore
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [user]);

  // Save to localStorage as backup
  useEffect(() => {
    if (history.length > 0) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history.slice(0, MAX_LOCAL_HISTORY)));
      } catch {
        // Ignore storage errors
      }
    }
  }, [history]);

  const addToHistory = useCallback(async (track: MusicTrack, duration?: number) => {
    const entry: HistoryEntry = {
      track,
      playedAt: new Date().toISOString(),
      listenDuration: duration,
      completionRate: duration && track.duration ? calculateCompletionRate(duration, track.duration) : undefined,
    };

    // Track play start time
    playStartTimeRef.current[track.id] = Date.now();

    // Update local state immediately
    setHistory(prev => {
      // Remove duplicate if exists
      const filtered = prev.filter(h => h.track.id !== track.id);
      return [entry, ...filtered].slice(0, MAX_LOCAL_HISTORY);
    });

    // Persist to Supabase if authenticated
    if (user) {
      try {
        await saveHistoryEntry({
          track,
          listenDuration: duration,
          completionRate: entry.completionRate,
          source: 'player',
        });
      } catch (error) {
        logger.warn('Failed to persist history entry', error as Error, 'MUSIC');
      }
    }
  }, [user]);

  const updatePlayDuration = useCallback((trackId: string, currentTime: number, totalDuration: number) => {
    const startTime = playStartTimeRef.current[trackId];
    if (!startTime) return;

    const listenDuration = Math.floor((Date.now() - startTime) / 1000);
    const completionRate = calculateCompletionRate(currentTime, totalDuration);

    setHistory(prev => prev.map(entry => {
      if (entry.track.id === trackId) {
        return {
          ...entry,
          listenDuration,
          completionRate,
        };
      }
      return entry;
    }));
  }, []);

  const clearHistory = useCallback(async () => {
    setHistory([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);

    if (user) {
      try {
        const { error } = await supabase
          .from('music_history')
          .delete()
          .eq('user_id', user.id);
        
        if (error) throw error;
        logger.info('History cleared', {}, 'MUSIC');
      } catch (error) {
        logger.error('Failed to clear history from DB', error as Error, 'MUSIC');
      }
    }
  }, [user]);

  const getRecentTracks = useCallback((limit: number = 10): HistoryEntry[] => {
    return history.slice(0, limit);
  }, [history]);

  return {
    history,
    isLoading,
    addToHistory,
    clearHistory,
    getRecentTracks,
    updatePlayDuration,
  };
}

export default useMusicHistoryPersistent;
