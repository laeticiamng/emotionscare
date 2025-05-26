
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MusicTrack, MusicPlaylist, MusicPlayerState } from '@/types/music';

interface MusicContextType {
  currentPlaylist: MusicPlaylist | null;
  playerState: MusicPlayerState;
  setCurrentPlaylist: (playlist: MusicPlaylist) => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [playerState, setPlayerState] = useState<MusicPlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false
  });

  const playTrack = (track: MusicTrack) => {
    setPlayerState(prev => ({
      ...prev,
      currentTrack: track,
      isPlaying: true
    }));
  };

  const pauseTrack = () => {
    setPlayerState(prev => ({
      ...prev,
      isPlaying: false
    }));
  };

  const nextTrack = () => {
    if (!currentPlaylist || !playerState.currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(
      track => track.id === playerState.currentTrack?.id
    );
    const nextIndex = (currentIndex + 1) % currentPlaylist.tracks.length;
    playTrack(currentPlaylist.tracks[nextIndex]);
  };

  const previousTrack = () => {
    if (!currentPlaylist || !playerState.currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(
      track => track.id === playerState.currentTrack?.id
    );
    const prevIndex = currentIndex === 0 ? currentPlaylist.tracks.length - 1 : currentIndex - 1;
    playTrack(currentPlaylist.tracks[prevIndex]);
  };

  const setVolume = (volume: number) => {
    setPlayerState(prev => ({
      ...prev,
      volume: Math.max(0, Math.min(1, volume))
    }));
  };

  return (
    <MusicContext.Provider
      value={{
        currentPlaylist,
        playerState,
        setCurrentPlaylist,
        playTrack,
        pauseTrack,
        nextTrack,
        previousTrack,
        setVolume
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
