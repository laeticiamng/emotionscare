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
    // TODO: Appeler edge function adaptive-music
    return [];
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
