import React, { createContext, useContext, useState } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  currentTrack: string | null;
  volume: number;
  playlist: string[];
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
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
  children: React.ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);
  const [playlist, setPlaylist] = useState<string[]>([]);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);

  return (
    <MusicContext.Provider value={{
      isPlaying,
      currentTrack,
      volume,
      playlist,
      play,
      pause,
      setVolume,
    }}>
      {children}
    </MusicContext.Provider>
  );
};