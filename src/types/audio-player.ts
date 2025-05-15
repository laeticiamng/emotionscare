
export interface UseAudioPlayerStateReturn {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  currentTime: number;
  duration: number;
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => Promise<void>;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
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
