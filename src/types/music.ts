
import { ReactNode } from 'react';

// Unified music track type
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;        // Required for audio source
  coverUrl: string;   // Required for displaying album art
  audioUrl: string;   // Required for compatibility with existing code
  emotion?: string;
  audio_url?: string; // Kept for backwards compatibility
  cover_url?: string; // Kept for backwards compatibility
  cover?: string;     // Kept for backwards compatibility
  lyrics?: string;
  mood?: string;
  tempo?: number;
  genre?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string; // Required for consistency
  title?: string; // Optional for backward compatibility
  description?: string;
  coverUrl?: string;
  emotion?: string;
  tracks: MusicTrack[];
}

// Props for music components
export interface MusicContextType {
  playlists: MusicPlaylist[];
  currentPlaylist: MusicPlaylist | null;
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  progress: number;
  duration: number;
  
  loadPlaylist: (playlist: MusicPlaylist) => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seekToPosition: (position: number) => void;
  
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  loadPlaylistForEmotion: (emotion: string) => Promise<boolean>;
  
  // New properties added for compatibility
  nextTrack: () => void;
  previousTrack: () => void;
  adjustVolume: (change: number) => void;
  toggleMute: () => void;
  formatTime?: (seconds: number) => string;
  isShuffled?: boolean;
  isRepeating?: boolean;
  toggleShuffle?: () => void;
  toggleRepeat?: () => void;
  currentEmotion?: string | null;
  isInitialized?: boolean;
  error?: string | null;
  loadPlaylistById?: (id: string) => Promise<MusicPlaylist | null>;
  initializeMusicSystem?: () => Promise<void>;
  resumeTrack?: () => void;
  seekTo?: (time: number) => void;
}

export interface MusicDrawerProps {
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  playlist?: MusicPlaylist | null;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  duration: number;
}

export interface ProgressBarProps {
  progress: number;
  duration: number;
  onSeek?: (position: number) => void;
  currentTime?: number;
  formatTime?: (seconds: number) => string;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  showTimestamps?: boolean;
  className?: string;
}

export interface TrackInfoProps {
  track?: Track;
  className?: string;
  compact?: boolean;
  title?: string;
  artist?: string;
  coverUrl?: string;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: Track;
  loadingTrack?: boolean;
  audioError?: Error | null;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  className?: string;
  onChange?: (volume: number) => void;
  showLabel?: boolean;
}
