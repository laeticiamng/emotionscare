
export interface AudioPlayerState {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  muted: boolean;
}

export interface AudioPlayerControls {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

// Corrected UseAudioPlayerStateReturn interface
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
  error: Error | null;
  setCurrentTrack: (track: any) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setRepeat: (repeat: boolean) => void;
  setShuffle: (shuffle: boolean) => void;
  setProgress: (progress: number) => void;
  setCurrentTime: (currentTime: number) => void;
  setDuration: (duration: number) => void;
  setLoadingTrack: (loadingTrack: boolean) => void;
  setError: (error: Error | null) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
}

// Add UseAudioPlayerReturn interface
export interface UseAudioPlayerReturn {
  currentTrack: any;
  isPlaying: boolean;
  volume: number;
  repeat: boolean;
  shuffle: boolean;
  progress: number;
  duration: number;
  loading: boolean;
  error: Error | null;
  currentTime: number;
  loadingTrack: boolean;
  
  playTrack: (track: any) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  
  seekTo: (seconds: number) => void;
  setVolume: (volume: number) => void;
  setCurrentTrack: (track: any) => void;
  formatTime: (seconds: number) => string;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleVolumeChange: (values: number[]) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
}

// Add types for the music controls hook
export interface UseMusicControlsReturn {
  isPlaying: boolean;
  volume: number;
  setVolume: (volume: number) => void;
  playTrack: (track: any) => void;
  pauseTrack: () => void;
  nextTrack: (currentTrack: any | null, currentPlaylist: any[] | null) => void;
  previousTrack: (currentTrack: any | null, currentPlaylist: any[] | null) => void;
  currentTime: number;
  duration: number;
  formatTime: (seconds: number) => string;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleVolumeChange: (values: number[]) => void;
  repeat: boolean;
  toggleRepeat: () => void;
  shuffle: boolean;
  toggleShuffle: () => void;
  loadingTrack: boolean;
}
