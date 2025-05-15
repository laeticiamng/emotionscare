
export interface UseAudioPlayerStateReturn {
  playing: boolean;
  muted: boolean;
  volume: number;
  duration: number;
  currentTime: number;
  progress: number;
  loading: boolean;
  togglePlayPause: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
}

export interface EnhancedMusicVisualizerProps {
  height?: number;
  showControls?: boolean;
  mood?: string;
  intensity?: number;
  volume?: number;
  className?: string;
}
