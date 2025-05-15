
import { MusicTrack } from './music';

/**
 * Return type for useAudioPlayerState hook
 */
export interface UseAudioPlayerStateReturn {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  repeat: boolean;
  shuffle: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  loadingTrack: boolean;
  error: string | null;
  setCurrentTrack?: (track: MusicTrack) => void;
  setIsPlaying?: (isPlaying: boolean) => void;
  setVolume?: (volume: number) => void;
  setRepeat?: (repeat: boolean) => void;
  setShuffle?: (shuffle: boolean) => void;
  setProgress?: (progress: number) => void;
  setCurrentTime?: (time: number) => void;
  setDuration?: (duration: number) => void;
  setLoadingTrack?: (loading: boolean) => void;
  setError?: (error: string | Error | null) => void;
  toggleRepeat?: () => void;
  toggleShuffle?: () => void;
  togglePlay?: () => void;
}

/**
 * Props for enhanced music visualizer component
 */
export interface EnhancedMusicVisualizerProps {
  audioElement?: HTMLAudioElement | null;
  mode?: 'wave' | 'bars' | 'circle';
  color?: string;
  height?: number;
  width?: number;
  className?: string;
  isPlaying?: boolean;
  emotionColor?: string;
}
