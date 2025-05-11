
import React, { createContext, useContext, useState } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types';

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  playlists: MusicPlaylist[];
  queue: MusicTrack[];
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  addTrackToQueue: (track: MusicTrack) => void;
  clearQueue: () => void;
  duration: number;
  currentTime: number;
  seek: (time: number) => void;
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
}

const defaultMusicContext: MusicContextType = {
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  playlists: [],
  queue: [],
  playTrack: () => {},
  pauseTrack: () => {},
  togglePlay: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  setVolume: () => {},
  addTrackToQueue: () => {},
  clearQueue: () => {},
  duration: 0,
  currentTime: 0,
  seek: () => {},
  openDrawer: false,
  setOpenDrawer: () => {}
};

const MusicContext = createContext<MusicContextType>(defaultMusicContext);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };
  
  const pauseTrack = () => {
    setIsPlaying(false);
  };
  
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };
  
  const nextTrack = () => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      const newQueue = queue.slice(1);
      setCurrentTrack(nextTrack);
      setQueue(newQueue);
      setIsPlaying(true);
    }
  };
  
  const prevTrack = () => {
    // Mock implementation - would need track history
    console.log('Previous track');
  };
  
  const addTrackToQueue = (track: MusicTrack) => {
    setQueue(prev => [...prev, track]);
  };
  
  const clearQueue = () => {
    setQueue([]);
  };
  
  const seek = (time: number) => {
    setCurrentTime(time);
    // Would also set the audio element's current time
  };

  return (
    <MusicContext.Provider value={{
      currentTrack,
      isPlaying,
      volume,
      playlists,
      queue,
      playTrack,
      pauseTrack,
      togglePlay,
      nextTrack,
      prevTrack,
      setVolume,
      addTrackToQueue,
      clearQueue,
      duration,
      currentTime,
      seek,
      openDrawer,
      setOpenDrawer
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
