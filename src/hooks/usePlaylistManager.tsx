
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getPlaylist } from '@/lib/musicService';
import { Track, Playlist } from '@/services/music/types';

/**
 * Hook to manage playlist loading and track navigation
 */
export function usePlaylistManager() {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const { toast } = useToast();

  /**
   * Load a playlist based on emotion
   */
  const loadPlaylistForEmotion = async (emotion: string) => {
    try {
      const musicPlaylist = await getPlaylist(emotion);
      
      // Convert MusicPlaylist to Playlist using our converter logic
      const convertedPlaylist: Playlist = {
        id: musicPlaylist.id,
        name: musicPlaylist.name,
        emotion: musicPlaylist.emotion,
        tracks: musicPlaylist.tracks.map(track => ({
          id: track.id,
          title: track.title,
          artist: track.artist,
          duration: track.duration,
          url: track.audioUrl,
          cover: track.coverUrl,
        }))
      };
      
      setPlaylist(convertedPlaylist);
      setCurrentEmotion(emotion);
      
      toast({
        title: "Playlist chargée",
        description: `Ambiance "${convertedPlaylist.name}" prête à être écoutée`,
      });

      return convertedPlaylist;
    } catch (error) {
      console.error('Error loading playlist:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger la playlist",
        variant: "destructive"
      });
      return null;
    }
  };

  /**
   * Get the next track in the playlist
   */
  const getNextTrack = (currentTrack: Track, shuffle: boolean): Track => {
    if (!playlist || !currentTrack) return currentTrack;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    
    if (shuffle) {
      const nextIndex = Math.floor(Math.random() * playlist.tracks.length);
      return playlist.tracks[nextIndex];
    } else {
      const nextIndex = (currentIndex + 1) % playlist.tracks.length;
      return playlist.tracks[nextIndex];
    }
  };

  /**
   * Get the previous track in the playlist
   */
  const getPreviousTrack = (currentTrack: Track, shuffle: boolean): Track => {
    if (!playlist || !currentTrack) return currentTrack;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    
    if (shuffle) {
      const prevIndex = Math.floor(Math.random() * playlist.tracks.length);
      return playlist.tracks[prevIndex];
    } else {
      const prevIndex = (currentIndex - 1 + playlist.tracks.length) % playlist.tracks.length;
      return playlist.tracks[prevIndex];
    }
  };

  return {
    playlist,
    currentEmotion,
    loadPlaylistForEmotion,
    getNextTrack,
    getPreviousTrack
  };
}
