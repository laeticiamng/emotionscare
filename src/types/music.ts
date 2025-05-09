
// Music-related types
import { MusicTrack, MusicPlaylist, MusicEmotion } from './index';

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  loading: boolean;
  error: boolean | string;
}

export interface TrackInfoProps {
  currentTrack: MusicTrack;
  loadingTrack?: boolean;
  audioError?: boolean | string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  loading: boolean;
  error: boolean | string;
  playTrack: (track: MusicTrack) => void;
  playPlaylist: (playlist: MusicPlaylist, trackIndex?: number) => void;
  loadPlaylistForEmotion: (emotion: string) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

// Re-export types for backward compatibility
export type { MusicTrack, MusicPlaylist, MusicEmotion };
