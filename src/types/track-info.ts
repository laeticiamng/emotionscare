
import { MusicTrack } from './music';

export interface TrackInfoProps {
  track?: MusicTrack;
  className?: string;
  compact?: boolean;
  title?: string;
  artist?: string;
  coverUrl?: string;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: MusicTrack;
  loadingTrack?: boolean;
  audioError?: Error | null;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
  className?: string;
  onChange?: (volume: number) => void;
  showLabel?: boolean;
}
