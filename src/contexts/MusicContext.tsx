
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types';

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  initializeMusicSystem: () => Promise<void>;
  error: Error | null;
  
  // Additional properties used in components
  isDrawerOpen: boolean;
  closeDrawer: () => void;
  openDrawer: () => void;
  loadPlaylistForEmotion: (emotion: string) => void;
  loadPlaylistById: (id: string) => void;
  loadTrack: (track: any) => void;
  currentEmotion: string | null;
  playlists: MusicPlaylist[];
}

// Create context with default values
const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  playlist: null,
  isPlaying: false,
  volume: 80,
  playTrack: () => {},
  pauseTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  setVolume: () => {},
  initializeMusicSystem: async () => {},
  error: null,
  
  // Additional properties
  isDrawerOpen: false,
  closeDrawer: () => {},
  openDrawer: () => {},
  loadPlaylistForEmotion: () => {},
  loadPlaylistById: () => {},
  loadTrack: () => {},
  currentEmotion: null,
  playlists: []
});

export const useMusic = () => useContext(MusicContext);

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [error, setError] = useState<Error | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  
  // Mock playlists for different emotions
  const mockPlaylists: Record<string, MusicPlaylist> = {
    happy: {
      id: 'happy-playlist',
      name: 'Happy Vibes',
      emotion: 'happy',
      tracks: [
        {
          id: 'happy-1',
          title: 'Sunny Days',
          artist: 'Joy Beats',
          duration: 180,
          audioUrl: '/audio/happy-1.mp3',
          coverUrl: '/images/covers/happy-1.jpg',
          url: '/audio/happy-1.mp3', // Added for compatibility
          cover: '/images/covers/happy-1.jpg' // Added for compatibility
        },
        {
          id: 'happy-2',
          title: 'Upbeat Morning',
          artist: 'Positive Notes',
          duration: 210,
          audioUrl: '/audio/happy-2.mp3',
          coverUrl: '/images/covers/happy-2.jpg',
          url: '/audio/happy-2.mp3', // Added for compatibility
          cover: '/images/covers/happy-2.jpg' // Added for compatibility
        }
      ]
    },
    calm: {
      id: 'calm-playlist',
      name: 'Calm Moments',
      emotion: 'calm',
      tracks: [
        {
          id: 'calm-1',
          title: 'Ocean Waves',
          artist: 'Meditation Masters',
          duration: 300,
          audioUrl: '/audio/calm-1.mp3',
          coverUrl: '/images/covers/calm-1.jpg',
          url: '/audio/calm-1.mp3', // Added for compatibility
          cover: '/images/covers/calm-1.jpg' // Added for compatibility
        },
        {
          id: 'calm-2',
          title: 'Forest Sounds',
          artist: 'Nature Vibes',
          duration: 320,
          audioUrl: '/audio/calm-2.mp3',
          coverUrl: '/images/covers/calm-2.jpg',
          url: '/audio/calm-2.mp3', // Added for compatibility
          cover: '/images/covers/calm-2.jpg' // Added for compatibility
        }
      ]
    },
    focused: {
      id: 'focused-playlist',
      name: 'Deep Focus',
      emotion: 'focused',
      tracks: [
        {
          id: 'focused-1',
          title: 'Concentration',
          artist: 'Mind Focus',
          duration: 280,
          audioUrl: '/audio/focused-1.mp3',
          coverUrl: '/images/covers/focused-1.jpg',
          url: '/audio/focused-1.mp3', // Added for compatibility
          cover: '/images/covers/focused-1.jpg' // Added for compatibility
        }
      ]
    },
    neutral: {
      id: 'neutral-playlist',
      name: 'Balanced Sounds',
      emotion: 'neutral',
      tracks: [
        {
          id: 'neutral-1',
          title: 'Ambient Flow',
          artist: 'Balance Artist',
          duration: 240,
          audioUrl: '/audio/neutral-1.mp3',
          coverUrl: '/images/covers/neutral-1.jpg',
          url: '/audio/neutral-1.mp3', // Added for compatibility
          cover: '/images/covers/neutral-1.jpg' // Added for compatibility
        }
      ]
    }
  };
  
  // Initialize music system
  const initializeMusicSystem = async (): Promise<void> => {
    try {
      // In a real app, you would initialize your audio system, fetch playlists, etc.
      console.log('Initializing music system');
      
      // Set available playlists
      setPlaylists(Object.values(mockPlaylists));
      
      // Simulate loading completion
      return Promise.resolve();
    } catch (err: any) {
      console.error('Failed to initialize music system:', err);
      setError(err instanceof Error ? err : new Error(err?.message || 'Unknown error'));
      return Promise.reject(err);
    }
  };
  
  // Drawer control
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  
  // Load a playlist for a specific emotion
  const loadPlaylistForEmotion = (emotion: string) => {
    // Default to neutral if the emotion doesn't exist
    const normalizedEmotion = emotion.toLowerCase();
    const targetPlaylist = mockPlaylists[normalizedEmotion] || mockPlaylists.neutral;
    
    if (targetPlaylist) {
      setPlaylist(targetPlaylist);
      setCurrentEmotion(targetPlaylist.emotion);
      
      // Set the first track as current
      if (targetPlaylist.tracks.length > 0) {
        setCurrentTrack(targetPlaylist.tracks[0]);
      }
    }
  };
  
  // Load a playlist by ID
  const loadPlaylistById = (id: string) => {
    const foundPlaylist = Object.values(mockPlaylists).find(p => p.id === id);
    if (foundPlaylist) {
      setPlaylist(foundPlaylist);
      setCurrentEmotion(foundPlaylist.emotion);
      
      // Set the first track as current
      if (foundPlaylist.tracks.length > 0) {
        setCurrentTrack(foundPlaylist.tracks[0]);
      }
    }
  };
  
  // Load a specific track
  const loadTrack = (track: any) => {
    const trackWithCompatibility = {
      ...track,
      audioUrl: track.audioUrl || track.url,
      coverUrl: track.coverUrl || track.cover,
      url: track.url || track.audioUrl, // For compatibility
      cover: track.cover || track.coverUrl // For compatibility
    };
    
    setCurrentTrack(trackWithCompatibility as MusicTrack);
    setIsPlaying(true);
  };
  
  // Play track function
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };
  
  // Pause track function
  const pauseTrack = () => {
    setIsPlaying(false);
  };
  
  // Next track function
  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex < playlist.tracks.length - 1) {
      setCurrentTrack(playlist.tracks[currentIndex + 1]);
      setIsPlaying(true);
    }
  };
  
  // Previous track function
  const previousTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
      setCurrentTrack(playlist.tracks[currentIndex - 1]);
      setIsPlaying(true);
    }
  };
  
  // Initialize on component mount
  useEffect(() => {
    initializeMusicSystem().catch(err => {
      console.error('Failed to initialize music system:', err);
    });
  }, []);
  
  return (
    <MusicContext.Provider value={{
      currentTrack,
      playlist,
      isPlaying,
      volume,
      playTrack,
      pauseTrack,
      nextTrack,
      previousTrack,
      setVolume,
      initializeMusicSystem,
      error,
      isDrawerOpen,
      closeDrawer,
      openDrawer,
      loadPlaylistForEmotion,
      loadPlaylistById,
      loadTrack,
      currentEmotion,
      playlists
    }}>
      {children}
    </MusicContext.Provider>
  );
};
