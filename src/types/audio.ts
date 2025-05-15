
import { MusicTrack } from './music';

export interface AudioTrack {
  id: string;
  url: string;
  title: string;
  artist: string;
  cover?: string;
  duration: number;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  loading: boolean;
}

export interface AudioPlayerContextType {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  state: AudioPlayerState;
  currentTrack: AudioTrack | null;
  playTrack: (track: AudioTrack) => void;
}

export interface UseAudioPlayerStateReturn {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  duration: number;
  currentTime: number;
  volume: number;
  muted: boolean;
  loading: boolean;
  error: Error | null;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTrack: (track: MusicTrack | null) => void;
  setDuration: (duration: number) => void;
  setCurrentTime: (time: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setLoadingTrack: (loading: boolean) => void;
  setProgress: (progress: number) => void;
}
