
import { MusicTrack } from './index';

export interface UseAudioPlayerStateReturn {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  currentTime: number;
  duration: number;
  loadingTrack: boolean;
  error: Error | null;
  isMuted: boolean;
  isLoading: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  setCurrentTrack: (track: MusicTrack | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setLoadingTrack: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setIsMuted: (muted: boolean) => void;
  setIsLoading: (loading: boolean) => void;
}
