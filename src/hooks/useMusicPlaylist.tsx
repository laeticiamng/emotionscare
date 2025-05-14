
import { useCallback } from 'react';
import { MusicPlaylist } from '@/types/types';
import { usePlaylistNotifications } from '@/hooks/music/usePlaylistNotifications';

// Updating to use proper types
interface PlaylistManager {
  playlists: MusicPlaylist[];
  getPlaylistById: (id: string) => MusicPlaylist;
  getPlaylistByEmotion: (emotion: string) => MusicPlaylist;
}

export function useMusicPlaylist() {
  const { notifyPlaylistError } = usePlaylistNotifications();
  
  // Mock data for playlists
  const playlists: MusicPlaylist[] = [
    {
      id: 'calm-1',
      name: 'Calm Meditation',
      title: 'Calm Meditation',
      description: 'Relaxing music to help you meditate',
      tracks: [],
      emotion: 'calm'
    },
    {
      id: 'joy-1',
      name: 'Happy Vibes',
      title: 'Happy Vibes',
      description: 'Music to boost your mood',
      tracks: [],
      emotion: 'joy'
    }
  ];

  // Function to load a playlist based on emotion
  const loadPlaylistForEmotion = useCallback(async (emotion: string): Promise<MusicPlaylist | null> => {
    try {
      // Find a playlist matching the emotion
      const playlist = playlists.find(p => p.emotion?.toLowerCase() === emotion.toLowerCase());
      
      if (!playlist) {
        console.log(`No playlist found for emotion: ${emotion}`);
        return null;
      }
      
      return playlist;
    } catch (error) {
      console.error(`Error loading playlist for emotion ${emotion}:`, error);
      notifyPlaylistError(error instanceof Error ? error.message : 'Unknown error loading playlist');
      return null;
    }
  }, [notifyPlaylistError]);

  // Function to load a playlist by ID
  const loadPlaylistById = useCallback(async (id: string): Promise<MusicPlaylist | null> => {
    try {
      const playlist = playlists.find(p => p.id === id);
      
      if (!playlist) {
        console.log(`No playlist found with ID: ${id}`);
        return null;
      }
      
      return playlist;
    } catch (error) {
      console.error(`Error loading playlist with ID ${id}:`, error);
      notifyPlaylistError(error instanceof Error ? error.message : 'Unknown error loading playlist');
      return null;
    }
  }, [notifyPlaylistError]);

  return {
    currentPlaylist: null, // This will need to be managed elsewhere
    playlists,
    loadPlaylistForEmotion,
    loadPlaylistById
  };
}

export default useMusicPlaylist;
