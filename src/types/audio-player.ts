
/**
 * Return type for useAudioPlayer hook
 */
export interface UseAudioPlayerStateReturn {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  muted: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

/**
 * Props for enhanced music visualizer component
 */
export interface EnhancedMusicVisualizerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  color?: string;
  height?: number;
  width?: number;
  barCount?: number;
  barWidth?: number;
  barSpacing?: number;
  intensity?: number;
  visualizationType?: 'bars' | 'wave' | 'circle' | 'particles';
  className?: string;
  autoStart?: boolean;
  responsive?: boolean;
}
