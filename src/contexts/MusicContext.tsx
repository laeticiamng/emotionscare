
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types';

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  initializeMusicSystem: () => Promise<void>;
  error: Error | null;
}

// Create context with default values
const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  playlist: null,
  isPlaying: false,
  volume: 80,
  playTrack: () => {},
  pauseTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  setVolume: () => {},
  initializeMusicSystem: async () => {},
  error: null
});

export const useMusic = () => useContext(MusicContext);
