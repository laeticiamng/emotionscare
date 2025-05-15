
import { MusicTrack } from './music';

export interface UseAudioPlayerStateReturn {
  isReady: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  error: Error | null;
  audioElement: HTMLAudioElement | null;
  currentTrack: MusicTrack | null;
  play: () => Promise<void>;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setTrack: (track: MusicTrack) => void;
}

export interface EnhancedMusicVisualizerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  color?: string;
  height?: number | string;
  width?: number | string;
  barWidth?: number;
  gap?: number;
  sensitivity?: number;
  barCount?: number;
  className?: string;
  visualizationType?: 'bars' | 'wave' | 'circle';
}
