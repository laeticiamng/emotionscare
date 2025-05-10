
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

// Add the missing UseAudioPlayerStateReturn interface
export interface UseAudioPlayerStateReturn {
  audioRef: React.RefObject<HTMLAudioElement>;
  state: AudioPlayerState;
  controls: AudioPlayerControls;
  timeFormatted: {
    currentTime: string;
    duration: string;
  };
  currentTrack?: any;
  isPlaying?: boolean;
  currentTime?: number;
  duration?: number;
  repeat?: boolean;
  shuffle?: boolean;
  loadingTrack?: boolean;
  volume?: number;
  toggleRepeat?: () => void;
  toggleShuffle?: () => void;
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
