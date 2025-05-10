
import { MusicTrack } from './music';

export interface AudioPlayerState {
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  repeat: boolean;
  shuffle: boolean;
  currentTime: number;
  duration: number;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
  showLabel?: boolean;
  className?: string;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek?: (time: number) => void;
  showTimestamps?: boolean;
  className?: string;
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
  error: Error | null;
  currentTime: number;
  loadingTrack: boolean;
  
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  setCurrentTrack: (track: MusicTrack | null) => void;
  formatTime: (seconds: number) => string;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleVolumeChange: (value: number[]) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
}
