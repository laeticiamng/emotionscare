
import { ReactNode } from 'react';

// Types utilisés par les services de musique
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string; // Making this required in both types
  cover?: string;
  coverUrl: string; // Required
  emotion?: string;
  audioUrl: string; // Required
  audio_url?: string; // Keeping for backward compatibility
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

// Props pour les composants de musique
export interface MusicContextType {
  playlists: MusicPlaylist[];
  currentPlaylist: MusicPlaylist | null;
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
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
