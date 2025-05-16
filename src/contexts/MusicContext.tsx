
import React, { createContext, useState, useContext, useCallback } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types/music';

interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  currentPlaylist: MusicPlaylist | null;
  openDrawer: boolean;
  emotion: string | null;
  setCurrentTrack: (track: MusicTrack | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentPlaylist: (playlist: MusicPlaylist | null) => void;
  setOpenDrawer: (open: boolean) => void;
  setEmotion: (emotion: string | null) => void;
  toggleDrawer: () => void;
}

const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  isPlaying: false,
  currentPlaylist: null,
  openDrawer: false,
  emotion: null,
  setCurrentTrack: () => {},
  setIsPlaying: () => {},
  setCurrentPlaylist: () => {},
  setOpenDrawer: () => {},
  setEmotion: () => {},
  toggleDrawer: () => {},
});

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [emotion, setEmotion] = useState<string | null>(null);

  const toggleDrawer = useCallback(() => {
    setOpenDrawer(prev => !prev);
  }, []);

  const value = {
    currentTrack,
    isPlaying,
    currentPlaylist,
    openDrawer,
    emotion,
    setCurrentTrack,
    setIsPlaying,
    setCurrentPlaylist,
    setOpenDrawer,
    setEmotion,
    toggleDrawer,
  };

  return (
    <MusicContext.Provider value={value}>
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

export default MusicContext;
