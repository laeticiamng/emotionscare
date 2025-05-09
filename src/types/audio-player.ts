
import { MusicTrack } from './music';

export interface TrackInfoProps {
  currentTrack: MusicTrack;
  loadingTrack?: boolean;
  audioError?: Error | null;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (values: number[]) => void;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onProgressClick?: (percent: number) => void;
}

export interface UseAudioPlayerStateReturn {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  repeat: boolean;
  shuffle: boolean;
  progress: number;
  duration: number;
  loadingTrack: boolean;
  error: Error | null;
  currentTime: number;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
}

export interface UseAudioPlayerReturn extends UseAudioPlayerStateReturn {
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  setCurrentTrack: (track: MusicTrack) => void;
  formatTime: (seconds: number) => string;
  handleProgressClick: (percent: number) => void;
  handleVolumeChange: (values: number[]) => void;
}
