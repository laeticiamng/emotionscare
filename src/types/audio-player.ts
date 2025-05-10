
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

// Updated UseAudioPlayerReturn with all necessary properties
export interface UseAudioPlayerReturn {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
}

// Updated UseAudioPlayerStateReturn with all the missing properties
export interface UseAudioPlayerStateReturn {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  togglePlay?: () => void;
  setVolume: (volume: number) => void;
  seekTo?: (time: number) => void;
  currentTrack: any;
  nextTrack?: () => void;
  previousTrack?: () => void;
  setCurrentTrack: (track: any) => void;
  
  // Add missing properties referenced in errors
  repeat: boolean;
  shuffle: boolean;
  progress: number;
  loadingTrack: boolean;
  error: string | null;
  setError: (err: Error | string | null) => void;
  setLoadingTrack: (loading: boolean) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  setRepeat?: (repeat: boolean) => void;
  setShuffle?: (shuffle: boolean) => void;
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
