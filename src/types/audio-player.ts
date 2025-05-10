
import { ChangeEvent } from 'react';
import { MusicTrack } from './music';

// Return type for useAudioPlayerState hook
export interface UseAudioPlayerStateReturn {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  repeat: boolean;
  shuffle: boolean;
  currentTime: number;
  duration: number;
  loadingTrack: boolean;
  error: string | null;
  progress: number;
  
  setCurrentTrack: (track: MusicTrack | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setRepeat: (repeat: boolean) => void;
  setShuffle: (shuffle: boolean) => void;
  setProgress: (time: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setLoadingTrack: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
}

export interface UseAudioPlayerReturn {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  repeat: boolean;
  shuffle: boolean;
  progress: number;
  duration: number;
  loading: boolean;
  error: string | null;
  currentTime: number;
  loadingTrack: boolean;
  
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: (currentTrack: MusicTrack | null, currentPlaylist: MusicTrack[] | null) => void;
  previousTrack: (currentTrack: MusicTrack | null, currentPlaylist: MusicTrack[] | null) => void;
  
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  setCurrentTrack: (track: MusicTrack | null) => void;
  formatTime: (time: number) => string;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleVolumeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
}

export interface UseMusicControlsReturn {
  isPlaying: boolean;
  volume: number;
  setVolume: (volume: number) => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: (currentTrack: MusicTrack | null, currentPlaylist: MusicTrack[] | null) => void;
  previousTrack: (currentTrack: MusicTrack | null, currentPlaylist: MusicTrack[] | null) => void;
  currentTime: number;
  duration: number;
  formatTime: (time: number) => string;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleVolumeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  repeat: boolean;
  toggleRepeat: () => void;
  shuffle: boolean;
  toggleShuffle: () => void;
  loadingTrack: boolean;
}
