
import { MusicTrack } from './music';

export interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
  compact?: boolean;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
  className?: string;
}
