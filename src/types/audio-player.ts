
import { MusicTrack } from './music';

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek?: (value: number) => void;
  showTimestamps?: boolean;
  formatTime?: (seconds: number) => string;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  repeat: boolean;
  shuffle: boolean;
  currentTime: number;
  duration: number;
}

// Updated TrackInfoProps
export interface TrackInfoProps {
  title: string;
  artist: string;
  coverUrl?: string;
  className?: string;
  track?: MusicTrack;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: MusicTrack;
  loadingTrack?: boolean;
  audioError?: Error | null;
}

// Updated VolumeControlProps
export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
  muted?: boolean;
  onMuteToggle?: () => void;
  className?: string;
  showLabel?: boolean;
}

// Types for the audio player state
export interface UseAudioPlayerStateReturn {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  repeat: boolean;
  shuffle: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  loadingTrack: boolean;
  error: Error | null;
  
  // State setters
  setCurrentTrack: (track: MusicTrack | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
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

// Types for the audio player main hook
export interface UseAudioPlayerReturn {
  // State
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
  
  // Track operations
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  
  // Player controls
  seekTo: (seconds: number) => void;
  setVolume: (volume: number) => void;
  setCurrentTrack: (track: MusicTrack | null) => void;
  formatTime: (seconds: number) => string;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleVolumeChange: (values: number[]) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
}

// Types for music controls hook
export interface UseMusicControlsReturn {
  isPlaying: boolean;
  volume: number;
  setVolume: (volume: number) => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: (currentTrack: MusicTrack | null, currentPlaylist: MusicTrack[] | null) => void;
  previousTrack: (currentTrack: MusicTrack | null, currentPlaylist: MusicTrack[] | null) => void;
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

export interface EmotionToMusicMap {
  [key: string]: string;
}
