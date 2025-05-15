
import { ReactNode } from 'react';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration?: number;
  url: string;
  coverUrl?: string;
  cover_url?: string; // For compatibility
  emotion?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description?: string;
  tracks: MusicTrack[];
  emotion?: string;
  coverUrl?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  currentPlaylist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  position: number;
  duration: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  seekTo: (position: number) => void;
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null>;
  setOpenDrawer: (open: boolean) => void;
  openDrawer: boolean;
}

export interface MusicDrawerProps {
  children?: ReactNode;
  isOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  currentTrack?: MusicTrack | null;
  playlist?: MusicPlaylist | null;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverUrl?: string;
  duration?: number;
}

export interface ProgressBarProps {
  value?: number;
  max?: number;
  currentTime?: number;
  duration?: number;
  showLabel?: boolean;
  className?: string;
  variant?: 'default' | 'square' | 'rounded';
  formatTime?: (seconds: number) => string;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  showTimestamps?: boolean;
}

export interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
  className?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity: number;
}
