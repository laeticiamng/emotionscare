
// Audio player preferences interface
export interface AudioPreference {
  volume: number;
  autoplay: boolean;
  equalizerEnabled: boolean;
  equalizerPresets: string[];
  selectedPreset: string;
  setVolume: (volume: number) => void;
  setAutoplay: (autoplay: boolean) => void;
  toggleEqualizer: () => void;
  setEqualizerPreset: (preset: string) => void;
}

// Audio player return interface with all necessary properties
export interface UseAudioPlayerReturn {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
}

// Complete audio player state interface with all required properties
export interface UseAudioPlayerStateReturn {
  currentTrack: any;
  isPlaying: boolean;
  volume: number;
  repeat: boolean;
  shuffle: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  loadingTrack: boolean;
  error: string | null;
  
  // Setters
  setCurrentTrack: (track: any) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setRepeat: (repeat: boolean) => void;
  setShuffle: (shuffle: boolean) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setLoadingTrack: (loading: boolean) => void;
  setError: (err: Error | string | null) => void;
  
  // Actions
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  
  // Optional track navigation
  nextTrack?: () => void;
  previousTrack?: () => void;
}

// Define AudioPlayerState interface for MusicControls.tsx
export interface AudioPlayerState {
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  repeat: boolean;
  shuffle: boolean;
  currentTime: number;
  duration: number;
}

// Progress bar props
export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  formatTime: (seconds: number) => string;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  value?: number;
  max?: number;
  showLabel?: boolean;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  progress?: number;
  onSeek?: (percentage: number) => void;
  showTimestamps?: boolean;
}

// Track info props
export interface TrackInfoProps {
  currentTrack: any;
  loadingTrack?: boolean;
  audioError?: Error | null;
  track?: any;
  className?: string;
  compact?: boolean;
  title?: string;
  artist?: string;
  coverUrl?: string;
  showCover?: boolean;
  showControls?: boolean;
}

// Volume control props
export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (values: number[]) => void;
  className?: string;
  onChange?: (volume: number) => void;
  showLabel?: boolean;
}

export interface EmotionToMusicMap {
  [key: string]: string;
}
