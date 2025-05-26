
import React, { createContext, useContext, useState } from 'react';

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
}

interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  playlist: MusicTrack[];
  setCurrentTrack: (track: MusicTrack) => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  setPlaylist: (tracks: MusicTrack[]) => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [playlist, setPlaylist] = useState<MusicTrack[]>([]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const value: MusicContextType = {
    currentTrack,
    isPlaying,
    volume,
    playlist,
    setCurrentTrack,
    togglePlayPause,
    setVolume,
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
