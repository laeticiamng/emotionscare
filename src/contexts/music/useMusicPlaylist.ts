/**
 * Music Playlist Hook - Gestion playlists
 */

import { useCallback, Dispatch } from 'react';
import { MusicState, MusicAction, MusicTrack } from './types';

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

  const toggleFavorite = useCallback((trackId: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: trackId });
  }, [dispatch]);

  const getRecommendationsForEmotion = useCallback(async (emotion: string): Promise<MusicTrack[]> => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { logger } = await import('@/lib/logger');

      const { data, error } = await supabase.functions.invoke('emotionscare-music-generator', {
        body: {
          emotion,
          type: 'recommendations',
          count: 10
        }
      });

      if (error) throw error;

      return data.tracks || [];
    } catch (error) {
      const { logger } = await import('@/lib/logger');
      logger.error('Music recommendations error', error as Error, 'MUSIC');
      return [];
    }
  }, []);

  return {
    setPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    shufflePlaylist,
    toggleFavorite,
    getRecommendationsForEmotion,
  };
};
