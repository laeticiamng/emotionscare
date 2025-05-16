
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { MusicContextType, MusicPlaylist, MusicTrack, EmotionMusicParams } from '@/types/music';

// Create mock data for development
const mockPlaylist: MusicPlaylist = {
  id: 'playlist-1',
  name: 'Relaxing Music',
  tracks: [
    {
      id: 'track-1',
      title: 'Peaceful Mind',
      artist: 'Ambient Sounds',
      url: '/sounds/peaceful-mind.mp3',
      duration: 180,
      coverUrl: '/images/cover-peaceful.jpg',
    },
    {
      id: 'track-2',
      title: 'Ocean Waves',
      artist: 'Nature Sounds',
      url: '/sounds/ocean-waves.mp3',
      duration: 240,
      coverUrl: '/images/cover-ocean.jpg',
    },
  ],
  coverUrl: '/images/playlist-cover.jpg',
};

// Create context with default values
const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  playlist: null,
  isPlaying: false,
  volume: 0.5,
  progress: 0,
  loadTrack: () => {},
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  setVolume: () => {},
  adjustVolume: () => {},
  seekTo: () => {},
  togglePlay: () => {},
  setPlaylist: () => {},
  loadPlaylistForEmotion: async () => null,
  setEmotion: () => {},
  openDrawer: false,
  setOpenDrawer: () => {},
});

export const MusicProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [emotion, setEmotionState] = useState<string | null>(null);
  const [openDrawer, setOpenDrawerState] = useState(false);

  const loadTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(false);
    setProgress(0);
  }, []);

  const playTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
  }, []);

  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const resumeTrack = useCallback(() => {
    if (currentTrack) {
      setIsPlaying(true);
    }
  }, [currentTrack]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const nextTrack = useCallback(() => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex < playlist.tracks.length - 1) {
      setCurrentTrack(playlist.tracks[currentIndex + 1]);
      setProgress(0);
    }
  }, [currentTrack, playlist]);

  const previousTrack = useCallback(() => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > 0) {
      setCurrentTrack(playlist.tracks[currentIndex - 1]);
      setProgress(0);
    }
  }, [currentTrack, playlist]);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
  }, []);

  const adjustVolume = useCallback((increment: boolean) => {
    setVolumeState(prev => {
      const newVolume = prev + (increment ? 0.1 : -0.1);
      return Math.max(0, Math.min(1, newVolume));
    });
  }, []);

  const seekTo = useCallback((time: number) => {
    setProgress(time);
  }, []);

  const setOpenDrawer = useCallback((open: boolean) => {
    setOpenDrawerState(open);
  }, []);

  const setEmotion = useCallback((newEmotion: string) => {
    setEmotionState(newEmotion);
  }, []);

  const loadPlaylistForEmotion = useCallback(async (emotion: string | EmotionMusicParams): Promise<MusicPlaylist | null> => {
    // Mock implementation - in production, this would fetch from an API
    console.log('Loading playlist for emotion:', emotion);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock playlist
    return mockPlaylist;
  }, []);

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        playlist,
        isPlaying,
        volume,
        progress,
        loadTrack,
        playTrack,
        pauseTrack,
        resumeTrack,
        nextTrack,
        previousTrack,
        setVolume,
        adjustVolume,
        seekTo,
        togglePlay,
        setPlaylist,
        loadPlaylistForEmotion,
        setEmotion,
        openDrawer,
        setOpenDrawer,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
