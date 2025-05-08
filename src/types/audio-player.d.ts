
/**
 * Type definitions for the audio player functionality
 */

import { MusicTrack } from './music';

/**
 * Interface representing the state of the audio player
 */
export interface AudioPlayerState {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  repeat: boolean;
  shuffle: boolean;
  loadingTrack: boolean;
  error: Error | null;
}

/**
 * Return type for the useAudioPlayerState hook
 */
export interface UseAudioPlayerStateReturn extends AudioPlayerState {
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

/**
 * Return type for the useAudioPlayer hook
 */
export interface UseAudioPlayerReturn {
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  setVolume: (volume: number) => void;
  seekTo: (seconds: number) => void;
  formatTime: (time: number) => string;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleVolumeChange: (values: number[]) => void;
  nextTrack: () => void;
  previousTrack: () => void;
}

/**
 * Props for useAudioEvents hook
 */
export interface UseAudioEventsProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  onEnded: () => void;
  onError: (error: Error) => void;
  onPlay: () => void;
  onPause: () => void;
  onWaiting: () => void;
  onCanPlay: () => void;
  volume: number;
  repeat: boolean;
}

/**
 * Return type for the useMusicControls hook
 */
export interface UseMusicControlsReturn {
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: (currentTrack: MusicTrack | null, currentPlaylist: MusicTrack[] | null) => void;
  previousTrack: (currentTrack: MusicTrack | null, currentPlaylist: MusicTrack[] | null) => void;
  formatTime: (time: number) => string;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleVolumeChange: (values: number[]) => void;
  repeat: boolean;
  toggleRepeat: () => void;
  shuffle: boolean;
  toggleShuffle: () => void;
  loadingTrack: boolean;
  setVolume: (volume: number) => void;
}

/**
 * Props for VolumeControl component
 */
export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (values: number[]) => void;
}

/**
 * Props for ProgressBar component
 */
export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  formatTime: (time: number) => string;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Props for PlayerControls component
 */
export interface PlayerControlsProps {
  isPlaying: boolean;
  loadingTrack: boolean;
  onPlay: () => void;
  onPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

/**
 * Props for TrackInfo component
 */
export interface TrackInfoProps {
  currentTrack: MusicTrack;
  loadingTrack: boolean;
  audioError: boolean;
}

/**
 * Map of emotions to music types
 */
export interface EmotionToMusicMap {
  [key: string]: string;
}

