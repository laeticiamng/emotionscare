
import React, { createContext, useContext, useState } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types/music';

interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  currentPlaylist: MusicPlaylist | null;
  play: (track: MusicTrack) => void;
  pause: () => void;
  stop: () => void;
  setPlaylist: (playlist: MusicPlaylist) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);

  const play = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const stop = () => {
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  const setPlaylist = (playlist: MusicPlaylist) => {
    setCurrentPlaylist(playlist);
  };

  const value: MusicContextType = {
    currentTrack,
    isPlaying,
    currentPlaylist,
    play,
    pause,
    stop,
    setPlaylist
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
