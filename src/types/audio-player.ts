
import { MusicTrack } from './music';

export interface TrackInfoProps {
  title?: string;
  artist?: string;
  coverUrl?: string;
  track?: MusicTrack;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: MusicTrack;
  loadingTrack?: boolean;
  audioError?: Error | null;
  className?: string;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  showLabel?: boolean;
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
  handleProgressClick: (position: number) => void;
  handleVolumeChange: (values: number[]) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
}
