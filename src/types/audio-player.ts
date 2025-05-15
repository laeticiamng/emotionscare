
export interface UseAudioPlayerStateReturn {
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  currentTime: number;
  playTrack: (track: any) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
}

export interface EnhancedMusicVisualizerProps {
  emotion?: string;
  mood?: string;
  height?: number;
  showControls?: boolean;
  intensity?: number;
  volume?: number;
  className?: string;
}
