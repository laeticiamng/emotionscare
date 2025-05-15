
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
}

export interface EnhancedMusicVisualizerProps {
  height?: number;
  showControls?: boolean;
  mood?: string;
  intensity?: number;
  volume?: number;
  className?: string;
}
