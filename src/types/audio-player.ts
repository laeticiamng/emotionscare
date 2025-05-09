
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
