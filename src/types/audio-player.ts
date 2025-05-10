
export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  repeat: boolean;
  shuffle: boolean;
  error: Error | null;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url: string;
  coverImage?: string;
  emotion?: string;
  tags?: string[];
  cover?: string;
  coverUrl?: string;
  audioUrl?: string;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
  showLabel?: boolean;
  className?: string;
}

export interface TrackInfoProps {
  track?: MusicTrack | null;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: MusicTrack | null;
  loadingTrack?: boolean;
  audioError?: Error | null;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek?: (time: number) => void;
  showTimestamps?: boolean;
  className?: string;
}

export interface UseMusicControlsReturn {
  isPlaying: boolean;
  volume: number;
  setVolume: (value: number) => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: (currentTrack: MusicTrack | null, currentPlaylist: MusicTrack[] | null) => void;
  previousTrack: (currentTrack: MusicTrack | null, currentPlaylist: MusicTrack[] | null) => void;
  currentTime: number;
  duration: number;
  formatTime: (time: number) => string;
  handleProgressClick: (value: number) => void;
  handleVolumeChange: (value: number[]) => void;
  repeat: boolean;
  toggleRepeat: () => void;
  shuffle: boolean;
  toggleShuffle: () => void;
  loadingTrack: boolean;
}

export interface UseAudioPlayerReturn {
  currentTrack: MusicTrack | null;
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
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seekTo: (time: number) => void;
  setVolume: (value: number) => void;
  setCurrentTrack: (track: MusicTrack | null) => void;
  formatTime: (time: number) => string;
  handleProgressClick: (value: number) => void;
  handleVolumeChange: (values: number[]) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
}
