
import { useCallback } from 'react';
import { MusicPlaylist } from '@/types/music';
import { usePlaylistManager } from '@/hooks/usePlaylistManager';
import { playlistToMusicPlaylist } from '@/services/music/converters';
import { loadPlaylistById } from '@/services/music/playlist-utils';
import { usePlaylistNotifications } from '@/hooks/music/usePlaylistNotifications';

export function useMusicPlaylist() {
  const { notifyPlaylistError } = usePlaylistNotifications();
  const { 
    playlists: playlistsData, 
    loadPlaylistForEmotion: loadPlaylist 
  } = usePlaylistManager();
  
  // Conversion of playlists to MusicPlaylist[] format
  const playlists = playlistsData || [];

  // Function to load a playlist based on emotion
  const loadPlaylistForEmotion = useCallback(async (emotion: string) => {
    try {
      const playlist = await loadPlaylist(emotion);
      return playlist;
    } catch (error) {
      console.error(`Error loading playlist for emotion ${emotion}:`, error);
      return null;
    }
  }, [loadPlaylist]);

  // Function to load a playlist by ID
  const handleLoadPlaylistById = useCallback(async (id: string) => {
    return loadPlaylistById(id, notifyPlaylistError);
  }, [notifyPlaylistError]);

  return {
    currentPlaylist: null, // This will need to be managed elsewhere
    playlists,
    loadPlaylistForEmotion,
    loadPlaylistById: handleLoadPlaylistById
  };
}

export default useMusicPlaylist;
