
import { MusicTrack } from './music';

export interface UseAudioPlayerStateReturn {
  currentTrack?: MusicTrack | null;
  isPlaying?: boolean;
  volume?: number;
  muted?: boolean;
  repeat?: boolean;
  shuffle?: boolean;
  progress?: number;
  currentTime?: number;
  duration?: number;
  loadingTrack?: boolean;
  error?: string | Error | null;
  audioRef?: React.RefObject<HTMLAudioElement>;
  play?: () => Promise<void>;
  pause?: () => void;
  togglePlay?: () => void;
  seek?: (time: number) => void;
  setVolume?: (volume: number) => void;
  toggleMute?: () => void;
  setPlaybackRate?: (rate: number) => void;
  playbackRate?: number;
  toggleRepeat?: () => void;
  toggleShuffle?: () => void;
  setCurrentTrack?: (track: MusicTrack) => void;
  setIsPlaying?: (isPlaying: boolean) => void;
  setProgress?: (progress: number) => void;
  setDuration?: (duration: number) => void;
  setLoadingTrack?: (loading: boolean) => void;
  setError?: (error: Error | string | null) => void;
  setRepeat?: (repeat: boolean) => void;
  setShuffle?: (shuffle: boolean) => void;
  formatTime?: (seconds: number) => string;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverUrl?: string;
  cover?: string;
  album?: string;
  genre?: string;
  description?: string;
}

export interface AudioPlayerContextType {
  track: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  currentTime: number;
  isMuted: boolean;
  loading: boolean;
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (seconds: number) => void;
  formatTime: (seconds: number) => string;
}
