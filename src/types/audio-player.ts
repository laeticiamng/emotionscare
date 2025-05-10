
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
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setRepeat: (repeat: boolean) => void;
  setShuffle: (shuffle: boolean) => void;
  setProgress: (progress: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setLoadingTrack: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
}

export interface UseMusicControlsReturn {
  isPlaying: boolean;
  volume: number;
  setVolume: (volume: number) => void;
  playTrack: (track: any) => void;
  pauseTrack: () => void;
  nextTrack: (currentTrack: any, playlist: any[] | null) => void;
  previousTrack: (currentTrack: any, playlist: any[] | null) => void;
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
