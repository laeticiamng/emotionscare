
// Audio player related types
import { MusicTrack } from './music';

export interface PlayerControlsProps {
  isPlaying: boolean;
  loadingTrack?: boolean;
  onPlay: () => void;
  onPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  formatTime?: (seconds: number) => string;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export interface TrackInfoProps {
  track: MusicTrack | null;
  showCover?: boolean;
  showControls?: boolean;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number[]) => void;
}

export interface AudioPlayerOptions {
  autoplay?: boolean;
  volume?: number;
  muted?: boolean;
  loop?: boolean;
}
