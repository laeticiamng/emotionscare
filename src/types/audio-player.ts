
import { MusicTrack } from './index';

export interface UseAudioPlayerStateReturn {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  currentTime: number;
  duration: number;
  loadingTrack: boolean;
  error: Error | null;
  isMuted: boolean;
  isLoading: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  setCurrentTrack: (track: MusicTrack | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setLoadingTrack: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setIsMuted: (muted: boolean) => void;
  setIsLoading: (loading: boolean) => void;
}

export interface ProgressBarProps {
  value: number;
  max?: number;
  currentTime?: number;
  duration?: number;
  formatTime?: (seconds: number) => string;
  // Add missing properties
  onSeek?: (value: number) => void;
  className?: string;
  showTimestamps?: boolean;
  showLabel?: boolean;
  variant?: string;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange?: (volume: number) => void;
  isMuted?: boolean;
  onMuteToggle?: () => void;
  // Add missing properties
  onChange?: (value: number) => void;
  className?: string;
  showLabel?: boolean;
}

// Add MusicDrawerProps interface
export interface MusicDrawerProps {
  children?: React.ReactNode;
  // Add any other properties needed
}
