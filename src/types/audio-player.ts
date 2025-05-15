
import { MusicTrack } from './music';

export interface UseAudioPlayerStateReturn {
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  currentTrack: MusicTrack | null;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setCurrentTrack: (track: MusicTrack | null) => void;
  loadingTrack?: boolean;
  setLoadingTrack?: (loading: boolean) => void;
  error?: Error | null;
  setError?: (error: Error | null) => void;
}

export interface EnhancedMusicVisualizerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  color?: string;
  barCount?: number;
  height?: number;
  width?: string;
  className?: string;
}
