/**
 * Music Playlist Hook - Gestion playlists
 */

import { useCallback, Dispatch } from 'react';
import { MusicState, MusicAction, MusicTrack } from './types';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export const useMusicPlaylist = (
  state: MusicState,
  dispatch: Dispatch<MusicAction>,
  play: (track?: MusicTrack) => Promise<void>
) => {
  const setPlaylist = useCallback((tracks: MusicTrack[]) => {
    dispatch({ type: 'SET_PLAYLIST', payload: tracks });
  }, [dispatch]);

  const addToPlaylist = useCallback((track: MusicTrack) => {
    const updatedPlaylist = [...state.playlist, track];
    dispatch({ type: 'SET_PLAYLIST', payload: updatedPlaylist });
  }, [state.playlist, dispatch]);

  const removeFromPlaylist = useCallback((trackId: string) => {
    const updatedPlaylist = state.playlist.filter(t => t.id !== trackId);
    dispatch({ type: 'SET_PLAYLIST', payload: updatedPlaylist });
  }, [state.playlist, dispatch]);

  const shufflePlaylist = useCallback(() => {
    dispatch({ type: 'TOGGLE_SHUFFLE' });
  }, [dispatch]);

  const setRepeatMode = useCallback((mode: 'none' | 'one' | 'all') => {
    dispatch({ type: 'SET_REPEAT_MODE', payload: mode });
  }, [dispatch]);

  const toggleFavorite = useCallback((trackId: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: trackId });
  }, [dispatch]);

  const getRecommendationsForEmotion = useCallback(async (emotion: string, intensity: number = 5): Promise<MusicTrack[]> => {
    try {
      // Get current session for auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        logger.warn('No session - cannot fetch music recommendations', {}, 'MUSIC');
        return [];
      }

      // Construct URL with query params - use direct URL instead of VITE env var
      const supabaseUrl = 'https://yaincoxihiqdksxgrsrk.supabase.co';
      const url = new URL(`${supabaseUrl}/functions/v1/adaptive-music/recommendations`);
      url.searchParams.set('emotion', emotion);
      url.searchParams.set('intensity', intensity.toString());

      // Call edge function directly with fetch
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        logger.error('Failed to get music recommendations', { status: response.status }, 'MUSIC');
        return [];
      }

      const data = await response.json();

      // Transform edge function response to MusicTrack format
      const tracks: MusicTrack[] = (data?.recommendations || []).map((track: any) => ({
        id: track.id,
        title: track.title,
        artist: track.artist,
        duration: track.duration,
        url: track.url,
        emotion_tags: track.emotion_tags,
        bpm: track.bpm,
        energy_level: track.energy_level,
      }));

      logger.info('Music recommendations fetched', {
        emotion,
        intensity,
        count: tracks.length
      }, 'MUSIC');

      return tracks;
    } catch (error) {
      logger.error('Exception fetching music recommendations', error as Error, 'MUSIC');
      return [];
    }
  }, []);

  return {
    setPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    shufflePlaylist,
    setRepeatMode,
    toggleFavorite,
    getRecommendationsForEmotion,
  };
};
