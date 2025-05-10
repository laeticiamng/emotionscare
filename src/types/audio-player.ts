
import { MusicTrack } from './music';

export interface UseAudioPlayerStateReturn {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  repeat: boolean;
  shuffle: boolean;
  currentTime: number;
  duration: number;
  loadingTrack: boolean;
  progress: number;
  error: string | null;
  setCurrentTrack: (track: MusicTrack | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setRepeat: (repeat: boolean) => void;
  setShuffle: (shuffle: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setLoadingTrack: (loading: boolean) => void;
  setProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
}

export interface AudioPlayerState {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  repeat: boolean;
  shuffle: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  loading: boolean;
  error: string | null;
}

export interface UseAudioPlayerReturn {
  audioRef: React.RefObject<HTMLAudioElement>;
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  repeat: boolean;
  shuffle: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  loading: boolean;
  error: string | null;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  seekTo: (seconds: number) => void;
  setCurrentTrack: (track: MusicTrack | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleVolumeChange: (values: number[]) => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
}
