
import { MusicTrack } from './music';

export interface UseAudioPlayerStateReturn {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  repeat: boolean;
  shuffle: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  loadingTrack: boolean;
  error: string | null;
  setCurrentTrack: (track: MusicTrack | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setRepeat: (repeat: boolean) => void;
  setShuffle: (shuffle: boolean) => void;
  setProgress: (progress: number) => void;
  setCurrentTime?: (time: number) => void;
  setDuration: (duration: number) => void;
  setLoadingTrack: (loading: boolean) => void;
  setError: (error: Error | string | null) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
}

export interface AudioPlayerProps {
  track?: MusicTrack;
  autoPlay?: boolean;
  volume?: number;
  loop?: boolean;
  onEnded?: () => void;
  onError?: (error: Error) => void;
  onTimeUpdate?: (time: number) => void;
  onDurationChange?: (duration: number) => void;
  className?: string;
}
