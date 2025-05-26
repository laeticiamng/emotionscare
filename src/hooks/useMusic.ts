
import { useState, useEffect } from 'react';
import { MusicTrack } from '@/types/music';

interface MusicState {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  isMuted: boolean;
  isInitialized: boolean;
}

export const useMusic = () => {
  const [state, setState] = useState<MusicState>({
    currentTrack: null,
    isPlaying: false,
    isLoading: false,
    volume: 0.5,
    isMuted: false,
    isInitialized: true
  });

  const play = () => {
    setState(prev => ({ ...prev, isPlaying: true }));
  };

  const pause = () => {
    setState(prev => ({ ...prev, isPlaying: false }));
  };

  const setVolume = (volume: number) => {
    setState(prev => ({ ...prev, volume, isMuted: volume === 0 }));
  };

  const toggleMute = () => {
    setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const setCurrentTrack = (track: MusicTrack | null) => {
    setState(prev => ({ ...prev, currentTrack: track }));
  };

  return {
    ...state,
    play,
    pause,
    setVolume,
    toggleMute,
    setCurrentTrack
  };
};
