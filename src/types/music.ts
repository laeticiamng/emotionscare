
// Music-related types

// Re-export music types from index for backward compatibility
export type {
  MusicTrack,
  MusicPlaylist,
  MusicEmotion,
  Track,
  Playlist
} from './index';

// Additional music-specific types
export interface MusicPlayerState {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  repeat: 'off' | 'track' | 'playlist';
  shuffle: boolean;
  queue: MusicTrack[];
}

export interface MusicAction {
  type: string;
  payload?: any;
}

export interface MusicPlayerControls {
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
}
