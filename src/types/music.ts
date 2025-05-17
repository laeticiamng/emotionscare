
import { AudioTrack, AudioPlaylist, EmotionMusicParams } from './audio';

// Re-export these types for backward compatibility
export type MusicTrack = AudioTrack;
export type MusicPlaylist = AudioPlaylist;
export type { EmotionMusicParams };

export interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
}

export interface VolumeControlProps {
  volume: number;
  muted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  className?: string;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  className?: string;
  disabled?: boolean;
}

export interface MusicDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface MusicLibraryProps {
  onTrackSelect: (track: MusicTrack) => void;
}

// Music context type
export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  currentTime: number;
  duration: number;
  playlist: MusicPlaylist | null;
  emotion: string | null;
  openDrawer: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  previousTrack: () => void; // Alias for prevTrack
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  setEmotion: (emotion: string) => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams) => Promise<MusicPlaylist | null>;
  setOpenDrawer: (open: boolean) => void;
  toggleMute: () => void;
}
