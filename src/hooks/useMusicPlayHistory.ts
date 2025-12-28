/**
 * useMusicPlayHistory - Hook pour gérer l'historique d'écoute
 * Connecté à la table music_play_logs
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import type { MusicTrack } from '@/types/music';

interface PlayLogEntry {
  id: string;
  track_id: string;
  emotion_context: string | null;
  play_timestamp: string;
  session_metadata: {
    title?: string;
    artist?: string;
    duration?: number;
    mood?: string;
    completed?: boolean;
  } | null;
}

interface ListenEntry {
  track: MusicTrack;
  timestamp: Date;
  duration: number;
  completed: boolean;
}

export function useMusicPlayHistory(limit = 50) {
  const { user } = useAuth();
  const [history, setHistory] = useState<ListenEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch play history from database
  const fetchHistory = useCallback(async () => {
    if (!user) {
      setHistory([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('music_play_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('play_timestamp', { ascending: false })
        .limit(limit);

      if (fetchError) throw fetchError;

      // Transform to ListenEntry format
      const entries: ListenEntry[] = (data || []).map((log: PlayLogEntry) => ({
        track: {
          id: log.track_id,
          title: log.session_metadata?.title || 'Musique inconnue',
          artist: log.session_metadata?.artist || 'Artiste inconnu',
          url: '',
          audioUrl: '',
          duration: log.session_metadata?.duration || 180,
          mood: log.emotion_context || log.session_metadata?.mood,
        },
        timestamp: new Date(log.play_timestamp),
        duration: log.session_metadata?.duration || 0,
        completed: log.session_metadata?.completed ?? false,
      }));

      setHistory(entries);
      setError(null);
    } catch (err) {
      logger.error('Failed to fetch play history', err as Error, 'MUSIC');
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [user, limit]);

  // Log a play event
  const logPlay = useCallback(async (
    track: MusicTrack,
    options: {
      emotionContext?: string;
      completed?: boolean;
      listenDuration?: number;
    } = {}
  ) => {
    if (!user) return;

    try {
      const { error: insertError } = await supabase
        .from('music_play_logs')
        .insert({
          user_id: user.id,
          track_id: track.id,
          emotion_context: options.emotionContext || track.mood || null,
          session_metadata: {
            title: track.title,
            artist: track.artist,
            duration: options.listenDuration || track.duration,
            mood: track.mood,
            completed: options.completed ?? false,
          },
        });

      if (insertError) throw insertError;

      // Add to local history
      setHistory(prev => [{
        track,
        timestamp: new Date(),
        duration: options.listenDuration || track.duration,
        completed: options.completed ?? false,
      }, ...prev.slice(0, limit - 1)]);

      logger.info('Play logged', { trackId: track.id }, 'MUSIC');
    } catch (err) {
      logger.error('Failed to log play', err as Error, 'MUSIC');
    }
  }, [user, limit]);

  // Initial fetch
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Real-time updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('music-play-logs-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'music_play_logs',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const log = payload.new as PlayLogEntry;
          const entry: ListenEntry = {
            track: {
              id: log.track_id,
              title: log.session_metadata?.title || 'Musique inconnue',
              artist: log.session_metadata?.artist || 'Artiste inconnu',
              url: '',
              audioUrl: '',
              duration: log.session_metadata?.duration || 180,
              mood: log.emotion_context || log.session_metadata?.mood,
            },
            timestamp: new Date(log.play_timestamp),
            duration: log.session_metadata?.duration || 0,
            completed: log.session_metadata?.completed ?? false,
          };
          
          setHistory(prev => [entry, ...prev.slice(0, limit - 1)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, limit]);

  return {
    history,
    isLoading,
    error,
    logPlay,
    refetch: fetchHistory,
  };
}

export default useMusicPlayHistory;
