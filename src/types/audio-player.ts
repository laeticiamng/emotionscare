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
  currentTrack: any | null;
  isPlaying: boolean;
  volume: number;
  repeat: boolean;
  shuffle: boolean;
  duration: number;
  currentTime: number;
  loading: boolean;
  loadingTrack: boolean;
  
  // Add missing properties
  progress: number;
  error: string | null;
  setError: (error: string | null) => void;
  setLoadingTrack: (loading: boolean) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentTrack: (track: any) => void;
}

// Add UseAudioPlayerReturn interface
export interface UseAudioPlayerReturn {
  // State
  currentTrack: any | null;
  isPlaying: boolean;
  volume: number;
  repeat: boolean;
  shuffle: boolean;
  progress: number;
  duration: number;
  loading: boolean;
  error: string | null;
  currentTime: number;
  loadingTrack: boolean;
  
  // Track operations
  playTrack: (track: any) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  
  // Player controls
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  setCurrentTrack: (track: any) => void;
  formatTime: (time: number) => string;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
