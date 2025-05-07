
import { useState, useCallback } from 'react';
import { getPlaylist } from '@/lib/musicService';
import type { Track, Playlist } from '@/services/music/types';
import type { MusicTrack, MusicPlaylist } from '@/types/music';

// Helper function to convert between types
const convertMusicTrackToTrack = (musicTrack: MusicTrack): Track => ({
  id: musicTrack.id,
  title: musicTrack.title,
  artist: musicTrack.artist,
  duration: musicTrack.duration,
  url: musicTrack.audioUrl,
  cover: musicTrack.coverUrl,
});

const convertMusicPlaylistToPlaylist = (musicPlaylist: MusicPlaylist): Playlist => ({
  id: musicPlaylist.id,
  name: musicPlaylist.name,
  emotion: musicPlaylist.emotion,
  tracks: musicPlaylist.tracks.map(convertMusicTrackToTrack)
});

export function usePlaylistManager() {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const loadPlaylistForEmotion = useCallback(async (emotion: string): Promise<Playlist | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Loading playlist for emotion: ${emotion}`);
      const emotionPlaylist = await getPlaylist(emotion);
      
      // Ensure we have the correct type
      if (emotionPlaylist) {
        setPlaylist(emotionPlaylist);
        setCurrentEmotion(emotion);
      }
      return emotionPlaylist;
    } catch (err) {
      console.error('Error loading playlist:', err);
      setError(`Failed to load playlist: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const getNextTrack = useCallback((currentTrack: Track, shuffle: boolean): Track => {
    if (!playlist || !playlist.tracks.length) return currentTrack;
    
    if (shuffle) {
      // Return a random track different from current
      const availableTracks = playlist.tracks.filter(t => t.id !== currentTrack.id);
      if (availableTracks.length === 0) return currentTrack;
      
      const randomIndex = Math.floor(Math.random() * availableTracks.length);
      return availableTracks[randomIndex];
    } else {
      // Find current track index
      const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
      if (currentIndex === -1) return playlist.tracks[0];
      
      // Return next track or loop to first
      const nextIndex = (currentIndex + 1) % playlist.tracks.length;
      return playlist.tracks[nextIndex];
    }
  }, [playlist]);
  
  const getPreviousTrack = useCallback((currentTrack: Track, shuffle: boolean): Track => {
    if (!playlist || !playlist.tracks.length) return currentTrack;
    
    if (shuffle) {
      // For shuffle mode, previous is also random
      const availableTracks = playlist.tracks.filter(t => t.id !== currentTrack.id);
      if (availableTracks.length === 0) return currentTrack;
      
      const randomIndex = Math.floor(Math.random() * availableTracks.length);
      return availableTracks[randomIndex];
    } else {
      // Find current track index
      const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
      if (currentIndex === -1) return playlist.tracks[0];
      
      // Return previous track or loop to last
      const prevIndex = (currentIndex - 1 + playlist.tracks.length) % playlist.tracks.length;
      return playlist.tracks[prevIndex];
    }
  }, [playlist]);
  
  return {
    playlist,
    isLoading,
    error,
    currentEmotion,
    loadPlaylistForEmotion,
    getNextTrack,
    getPreviousTrack
  };
}
