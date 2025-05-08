
import React, { createContext, useContext, useEffect } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types';
import { useMusicState } from '@/hooks/useMusicState';
import { useMusicPlaylist } from '@/hooks/useMusicPlaylist';
import { useMusicControls } from '@/hooks/useMusicControls';

interface MusicContextType {
  currentTrack: MusicTrack | null;
  setCurrentTrack: (track: MusicTrack | null) => void;
  currentPlaylist: MusicPlaylist | null;
  currentEmotion: string;
  isPlaying: boolean;
  volume: number;
  setVolume: (volume: number) => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  loadPlaylistForEmotion: (emotion: string) => MusicPlaylist | null;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  
  // Properties for audio player functionality
  currentTime: number;
  duration: number;
  formatTime: (time: number) => string;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleVolumeChange: (values: number[]) => void;
  repeat: boolean;
  toggleRepeat: () => void;
  shuffle: boolean;
  toggleShuffle: () => void;
  loadingTrack: boolean;
  
  // Required properties
  initializeMusicSystem: () => Promise<void>;
  error: string | null;
  playlists: MusicPlaylist[];
  loadPlaylistById: (id: string) => Promise<MusicPlaylist | null>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentTrack,
    setCurrentTrack,
    currentEmotion,
    setCurrentEmotion,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    error,
    isInitialized,
    initializeMusicSystem
  } = useMusicState();

  const {
    currentPlaylist,
    playlists,
    loadPlaylistForEmotion,
    loadPlaylistById
  } = useMusicPlaylist();

  const {
    isPlaying,
    volume,
    setVolume,
    playTrack: playTrackControl,
    pauseTrack,
    nextTrack: nextTrackControl,
    previousTrack: previousTrackControl,
    currentTime,
    duration,
    formatTime,
    handleProgressClick,
    handleVolumeChange,
    repeat,
    toggleRepeat,
    shuffle,
    toggleShuffle,
    loadingTrack
  } = useMusicControls();

  // Adapter les fonctions de contrôle pour utiliser les données actuelles
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    playTrackControl(track);
  };

  const nextTrack = () => {
    if (!currentTrack || !currentPlaylist) return;
    nextTrackControl(currentTrack, currentPlaylist.tracks);
  };

  const previousTrack = () => {
    if (!currentTrack || !currentPlaylist) return;
    previousTrackControl(currentTrack, currentPlaylist.tracks);
  };

  // Initialiser le système musical au chargement du contexte
  useEffect(() => {
    if (!isInitialized) {
      initializeMusicSystem();
    }
  }, [isInitialized, initializeMusicSystem]);

  return (
    <MusicContext.Provider value={{
      currentTrack,
      setCurrentTrack,
      currentPlaylist,
      currentEmotion,
      isPlaying,
      volume,
      setVolume,
      playTrack,
      pauseTrack,
      nextTrack,
      previousTrack,
      loadPlaylistForEmotion,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      currentTime,
      duration,
      formatTime,
      handleProgressClick,
      handleVolumeChange,
      repeat,
      toggleRepeat,
      shuffle,
      toggleShuffle,
      loadingTrack,
      initializeMusicSystem,
      error,
      playlists,
      loadPlaylistById
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  
  return context;
};
