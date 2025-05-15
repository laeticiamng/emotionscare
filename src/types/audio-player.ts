
export interface UseAudioPlayerStateReturn {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  error: Error | null;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

export interface EnhancedMusicVisualizerProps {
  audioUrl?: string;
  isPlaying?: boolean;
  type?: 'bars' | 'wave' | 'circle';
  color?: string;
  height?: number;
  width?: number;
  barCount?: number;
  barWidth?: number;
  barGap?: number;
  sensitivity?: number;
  className?: string;
}
