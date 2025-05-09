
// Audio player related types

import { MusicTrack } from './music';

export interface AudioPlayerState {
  currentTrack: MusicTrack | null;
  playing: boolean;
  volume: number;
  muted: boolean;
  duration: number;
  currentTime: number;
  loop: boolean;
  queue: MusicTrack[];
  history: MusicTrack[];
}

export interface AudioPlayerControls {
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleLoop: () => void;
  seek: (time: number) => void;
  queueTrack: (track: MusicTrack) => void;
  playTrack: (track: MusicTrack) => void;
}

// Add the missing interfaces
export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  formatTime: (seconds: number) => string;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export interface TrackInfoProps {
  currentTrack: MusicTrack;
  loadingTrack?: boolean;
  audioError?: Error | null;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (values: number[]) => void;
}

export interface EmotionToMusicMap {
  [key: string]: string;
}
