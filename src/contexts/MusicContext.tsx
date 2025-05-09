
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  currentTrack: string | null;
  play: (track: string) => void;
  pause: () => void;
  openDrawer?: () => void;
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
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const play = (track: string) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <MusicContext.Provider value={{ isPlaying, currentTrack, play, pause, openDrawer }}>
      {children}
    </MusicContext.Provider>
  );
};
