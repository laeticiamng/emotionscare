
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  artwork?: string;
}

interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  playlist: Track[];
  currentTime: number;
  duration: number;
  isLoading: boolean;
  play: (track?: Track) => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  addToPlaylist: (track: Track) => void;
  removeFromPlaylist: (trackId: string) => void;
  setPlaylist: (tracks: Track[]) => void;
  clearPlaylist: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [playlist, setPlaylistState] = useState<Track[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const play = useCallback((track?: Track) => {
    if (track) {
      setCurrentTrack(track);
    }
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const next = useCallback(() => {
    if (playlist.length === 0 || !currentTrack) return;
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];
    
    if (nextTrack) {
      setCurrentTrack(nextTrack);
      setIsPlaying(true);
    }
  }, [playlist, currentTrack]);

  const previous = useCallback(() => {
    if (playlist.length === 0 || !currentTrack) return;
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    const prevTrack = playlist[prevIndex];
    
    if (prevTrack) {
      setCurrentTrack(prevTrack);
      setIsPlaying(true);
    }
  }, [playlist, currentTrack]);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
  }, []);

  const seek = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const addToPlaylist = useCallback((track: Track) => {
    setPlaylistState(prev => [...prev, track]);
  }, []);

  const removeFromPlaylist = useCallback((trackId: string) => {
    setPlaylistState(prev => prev.filter(track => track.id !== trackId));
  }, []);

  const setPlaylist = useCallback((tracks: Track[]) => {
    setPlaylistState(tracks);
  }, []);

  const clearPlaylist = useCallback(() => {
    setPlaylistState([]);
    setCurrentTrack(null);
    setIsPlaying(false);
  }, []);

  const value: MusicContextType = {
    currentTrack,
    isPlaying,
    volume,
    playlist,
    currentTime,
    duration,
    isLoading,
    play,
    pause,
    stop,
    next,
    previous,
    setVolume,
    seek,
    addToPlaylist,
    removeFromPlaylist,
    setPlaylist,
    clearPlaylist,
  };

  return (
    <MusicContext.Provider value={value}>
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
