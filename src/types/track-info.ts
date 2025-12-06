// @ts-nocheck

import { MusicTrack } from './music';

/**
 * Props for track info component
 */
export interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
  showArtist?: boolean;
  showCover?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Props for volume control component
 */
export interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
}
