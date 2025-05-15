
export interface UseAudioPlayerStateReturn {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  error: Error | null;
  progress: number;
  audioElement: HTMLAudioElement | null;
  play: () => Promise<void> | void;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setTrack: (url: string) => void;
  onEnded?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  loadTrack?: (track: any) => void;
  isReady?: boolean;
}

export interface EnhancedMusicVisualizerProps {
  audioElement?: HTMLAudioElement | null;
  mode?: 'bars' | 'wave' | 'circle';
  color?: string;
  className?: string;
  barCount?: number;
  height?: number | string;
  width?: number | string;
  sensitivity?: number;
  isPlaying?: boolean;
}
