
import { MusicTrack, MusicPlaylist } from '@/types/music';

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  repeat: boolean;
  shuffle: boolean;
  currentTrack: MusicTrack | null;
  loadingTrack: boolean;
  audioError: Error | null;
}

export interface UseAudioPlayerStateReturn extends AudioPlayerState {
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  setCurrentTrack: (track: MusicTrack | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setLoadingTrack: (isLoading: boolean) => void;
  setAudioError: (error: Error | null) => void;
}

export interface UseAudioPlayerReturn {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  stop: () => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleVolumeChange: (value: number) => void;
  formatTime: (time: number) => string;
}

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
  formatTime: (time: number) => string;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleVolumeChange: (value: number) => void;
  repeat: boolean;
  toggleRepeat: () => void;
  shuffle: boolean;
  toggleShuffle: () => void;
  loadingTrack: boolean;
}
