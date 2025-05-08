
import { useCallback } from 'react';
import { MusicPlaylist } from '@/types';
import { usePlaylistManager } from '@/hooks/usePlaylistManager';
import { convertPlaylistToMusicPlaylist } from '@/services/music/converters';
import { loadPlaylistById, convertPlaylistsData } from '@/services/music/playlist-utils';
import { usePlaylistNotifications } from '@/hooks/music/usePlaylistNotifications';

export function useMusicPlaylist() {
  const { notifyPlaylistError } = usePlaylistNotifications();
  const { 
    playlists: playlistsData, 
    getCurrentPlaylist, 
    loadPlaylistForEmotion: loadPlaylist 
  } = usePlaylistManager();
  
  // Conversion of the playlist active to MusicPlaylist format
  const currentPlaylist = getCurrentPlaylist() 
    ? convertPlaylistToMusicPlaylist(getCurrentPlaylist()!) 
    : null;

  // Conversion of playlists to MusicPlaylist[] format
  const playlists = convertPlaylistsData(playlistsData);

  // Function to load a playlist based on emotion
  const loadPlaylistForEmotion = useCallback((emotion: string) => {
    const playlist = loadPlaylist(emotion);
    
    if (playlist) {
      return convertPlaylistToMusicPlaylist(playlist);
    }
    
    return null;
  }, [loadPlaylist]);

  // Function to load a playlist by ID
  const handleLoadPlaylistById = useCallback(async (id: string) => {
    return loadPlaylistById(id, notifyPlaylistError);
  }, [notifyPlaylistError]);

  return {
    currentPlaylist,
    playlists,
    loadPlaylistForEmotion,
    loadPlaylistById: handleLoadPlaylistById
  };
}

export default useMusicPlaylist;
