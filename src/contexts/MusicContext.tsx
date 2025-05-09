
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types';
import { useMusicState } from '@/hooks/useMusicState';

interface MusicContextType {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  currentPlaylist: MusicPlaylist | null;
  currentEmotion: string;
  playlists: MusicPlaylist[];
  volume: number;
  error: string | null;
  
  // Player controls
  play: (track: MusicTrack) => void;
  pause: () => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  
  // Playlist management
  loadPlaylistForEmotion: (emotion: string) => MusicPlaylist | null;
  loadPlaylistById: (id: string) => void;
  
  // Drawer controls
  openDrawer: () => void;
  closeDrawer: () => void;
  isDrawerOpen: boolean;
  
  // System initialization
  initializeMusicSystem: () => Promise<void>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Placeholder for initialization
  const initializeMusicSystem = useCallback(async () => {
    try {
      console.log('Initializing music system...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Initialize with some default playlists
      const defaultPlaylists: MusicPlaylist[] = [
        {
          id: 'happy',
          name: 'Happy Vibes',
          description: 'Energetic and positive music',
          tracks: [
            {
              id: 'happy-1',
              title: 'Good Day',
              artist: 'Happy Artist',
              duration: 180,
              url: 'https://example.com/track1.mp3'
            },
            {
              id: 'happy-2',
              title: 'Sunshine',
              artist: 'Positive Band',
              duration: 210,
              url: 'https://example.com/track2.mp3'
            }
          ]
        },
        {
          id: 'calm',
          name: 'Calming Sounds',
          description: 'Peaceful and relaxing tracks',
          tracks: [
            {
              id: 'calm-1',
              title: 'Ocean Waves',
              artist: 'Nature Sounds',
              duration: 240,
              url: 'https://example.com/calm1.mp3'
            },
            {
              id: 'calm-2',
              title: 'Gentle Rain',
              artist: 'Meditation Music',
              duration: 300,
              url: 'https://example.com/calm2.mp3'
            }
          ]
        },
        {
          id: 'neutral',
          name: 'Neutral Focus',
          description: 'Background music for focus',
          tracks: [
            {
              id: 'neutral-1',
              title: 'Deep Focus',
              artist: 'Concentration',
              duration: 320,
              url: 'https://example.com/neutral1.mp3'
            }
          ]
        }
      ];
      
      setPlaylists(defaultPlaylists);
      setCurrentPlaylist(defaultPlaylists[2]); // Set neutral as default
      
    } catch (err) {
      console.error('Error initializing music system:', err);
      setError('Failed to initialize music system');
    }
  }, []);
  
  // Track playback controls
  const play = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);
  
  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);
  
  // Aliases for play/pause to match component expectations
  const playTrack = play;
  const pauseTrack = pause;
  
  // Navigation between tracks
  const nextTrack = useCallback(() => {
    if (!currentTrack || !currentPlaylist) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex >= currentPlaylist.tracks.length - 1) {
      // Loop back to the beginning if at the end
      play(currentPlaylist.tracks[0]);
    } else {
      play(currentPlaylist.tracks[currentIndex + 1]);
    }
  }, [currentTrack, currentPlaylist, play]);
  
  const previousTrack = useCallback(() => {
    if (!currentTrack || !currentPlaylist) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex <= 0) {
      // Go to the end if at the beginning
      play(currentPlaylist.tracks[currentPlaylist.tracks.length - 1]);
    } else {
      play(currentPlaylist.tracks[currentIndex - 1]);
    }
  }, [currentTrack, currentPlaylist, play]);
  
  // Playlist management
  const loadPlaylistForEmotion = useCallback((emotion: string): MusicPlaylist | null => {
    const normalizedEmotion = emotion.toLowerCase();
    
    // Find matching playlist or fall back to neutral
    const playlist = playlists.find(p => p.id === normalizedEmotion) || 
                    playlists.find(p => p.id === 'neutral');
    
    if (playlist) {
      setCurrentPlaylist(playlist);
      setCurrentEmotion(normalizedEmotion);
      return playlist;
    }
    
    return null;
  }, [playlists]);
  
  const loadPlaylistById = useCallback((id: string) => {
    const playlist = playlists.find(p => p.id === id);
    if (playlist) {
      setCurrentPlaylist(playlist);
      setCurrentEmotion(playlist.id);
    }
  }, [playlists]);
  
  // Drawer controls
  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);
  
  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  // Export the context value
  const contextValue: MusicContextType = {
    isPlaying,
    currentTrack,
    currentPlaylist,
    currentEmotion,
    playlists,
    volume,
    error,
    
    play,
    pause,
    playTrack,
    pauseTrack,
    nextTrack,
    previousTrack,
    setVolume,
    
    loadPlaylistForEmotion,
    loadPlaylistById,
    
    openDrawer,
    closeDrawer,
    isDrawerOpen,
    
    initializeMusicSystem
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};
