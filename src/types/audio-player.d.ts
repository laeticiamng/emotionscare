
import { MusicTrack } from './music';

export interface UseAudioPlayerStateReturn {
  currentTrack?: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  repeat?: boolean;
  shuffle?: boolean;
  progress?: number;
  currentTime: number;
  duration: number;
  loadingTrack?: boolean;
  error: Error | null;
  isMuted?: boolean;
  playbackRate?: number;
  setCurrentTrack?: (track: MusicTrack | null) => void;
  setIsPlaying?: (isPlaying: boolean) => void;
  setVolume?: (volume: number) => void;
  setRepeat?: (repeat: boolean) => void;
  setShuffle?: (shuffle: boolean) => void;
  setProgress?: (progress: number) => void;
  setDuration?: (duration: number) => void;
  setLoadingTrack?: (loading: boolean) => void;
  setError?: (error: Error | string | null) => void;
  toggleRepeat?: () => void;
  toggleShuffle?: () => void;
  play?: () => void;
  pause?: () => void;
  togglePlay?: () => void;
  seek?: (time: number) => void;
  toggleMute?: () => void;
  setPlaybackRate?: (rate: number) => void;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
  coverUrl?: string;
  audioUrl?: string;
}

export interface AudioPlayerContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  muted: boolean;
  loading: boolean;
  play: (track?: AudioTrack) => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  next: () => void;
  previous: () => void;
}
