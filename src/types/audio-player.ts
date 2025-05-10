
export interface AudioPlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  buffered: number;
  loop: boolean;
  shuffle: boolean;
}

export interface VolumeControlProps {
  volume: number;
  muted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  className?: string;
}

export interface AudioVisualizerProps {
  isPlaying: boolean;
  audioRef?: React.RefObject<HTMLAudioElement>;
  color?: string;
  height?: number;
  width?: number;
  barCount?: number;
  barWidth?: number;
  gap?: number;
  sensitivityMultiplier?: number;
}
