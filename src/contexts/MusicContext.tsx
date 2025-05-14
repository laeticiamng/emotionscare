
import React, { createContext, useContext, useState, useCallback } from 'react';
import { MusicPlaylist, MusicTrack } from '@/types';

interface MusicContextType {
  currentPlaylist: MusicPlaylist | null;
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  loadPlaylistForEmotion: (emotion: string) => Promise<void>;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);

  const getMockPlaylistForEmotion = (emotion: string): MusicPlaylist => {
    // Mock playlists based on emotion
    const playlists: Record<string, MusicPlaylist> = {
      joy: {
        id: 'joy-playlist',
        title: 'Happy Vibes',
        tracks: [
          { id: 'joy-1', title: 'Walking on Sunshine', artist: 'Katrina & The Waves', audio_url: '/audio/happy-1.mp3' },
          { id: 'joy-2', title: 'Happy', artist: 'Pharrell Williams', audio_url: '/audio/happy-2.mp3' },
          { id: 'joy-3', title: 'Good Vibrations', artist: 'The Beach Boys', audio_url: '/audio/happy-3.mp3' },
        ]
      },
      sadness: {
        id: 'sadness-playlist',
        title: 'Comfort Zone',
        tracks: [
          { id: 'sad-1', title: 'Someone Like You', artist: 'Adele', audio_url: '/audio/sad-1.mp3' },
          { id: 'sad-2', title: 'Fix You', artist: 'Coldplay', audio_url: '/audio/sad-2.mp3' },
          { id: 'sad-3', title: 'Skinny Love', artist: 'Bon Iver', audio_url: '/audio/sad-3.mp3' },
        ]
      },
      neutral: {
        id: 'neutral-playlist',
        title: 'Balanced Mood',
        tracks: [
          { id: 'neutral-1', title: 'Weightless', artist: 'Marconi Union', audio_url: '/audio/neutral-1.mp3' },
          { id: 'neutral-2', title: 'Gymnopédie No.1', artist: 'Erik Satie', audio_url: '/audio/neutral-2.mp3' },
          { id: 'neutral-3', title: 'The Hours', artist: 'Philip Glass', audio_url: '/audio/neutral-3.mp3' },
        ]
      },
      calm: {
        id: 'calm-playlist',
        title: 'Peaceful Moments',
        tracks: [
          { id: 'calm-1', title: 'Meditation Ambience', artist: 'Zen Sounds', audio_url: '/audio/calm-1.mp3' },
          { id: 'calm-2', title: 'Ocean Waves', artist: 'Nature Sounds', audio_url: '/audio/calm-2.mp3' },
          { id: 'calm-3', title: 'Sleeping Forest', artist: 'Ambient Dreams', audio_url: '/audio/calm-3.mp3' },
        ]
      },
    };
    
    // Default to neutral if the emotion isn't recognized
    return playlists[emotion.toLowerCase()] || playlists.neutral;
  };

  const loadPlaylistForEmotion = useCallback(async (emotion: string) => {
    // In a real app, this would call an API to get a playlist
    // Here we're just mocking the behavior
    try {
      console.log(`Loading playlist for emotion: ${emotion}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const playlist = getMockPlaylistForEmotion(emotion);
      setCurrentPlaylist(playlist);
      
      // Auto-select the first track
      if (playlist.tracks.length > 0) {
        setCurrentTrack(playlist.tracks[0]);
      }
    } catch (error) {
      console.error('Error loading playlist:', error);
    }
  }, []);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const next = useCallback(() => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex < currentPlaylist.tracks.length - 1) {
      setCurrentTrack(currentPlaylist.tracks[currentIndex + 1]);
    }
  }, [currentPlaylist, currentTrack]);

  const previous = useCallback(() => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > 0) {
      setCurrentTrack(currentPlaylist.tracks[currentIndex - 1]);
    }
  }, [currentPlaylist, currentTrack]);

  const value = {
    currentPlaylist,
    currentTrack,
    isPlaying,
    volume,
    loadPlaylistForEmotion,
    play,
    pause,
    next,
    previous,
    setVolume,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  
  return context;
};
