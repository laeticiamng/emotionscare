
import { MusicTrack } from './music';

export interface AudioTrack extends MusicTrack {
  id: string;
  title: string;
  url: string;
  duration: number;
  artist?: string;
  cover?: string;
}

export interface UseAudioPlayerStateReturn {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
  progress: number;
  setProgress: (progress: number) => void; // Added this field
  volume: number;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  error: Error | null;
  setError: (error: Error | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  loadingTrack: boolean;
  setLoadingTrack: (loading: boolean) => void;
  currentTrack: MusicTrack | null;
  setCurrentTrack: (track: MusicTrack | null) => void;
}

export interface AudioPlayerContextType {
  state: UseAudioPlayerStateReturn;
  controls: {
    play: () => Promise<void>;
    pause: () => void;
    togglePlay: () => Promise<void>;
    seek: (seconds: number) => void;
    setVolume: (volume: number) => void;
    toggleMute: () => void;
    playTrack: (track: AudioTrack) => Promise<void>;
  };
}
