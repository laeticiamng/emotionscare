import { ReactNode } from 'react';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl?: string;
  url?: string; // Adding url property
  duration: number;
  coverUrl?: string;
  cover_url?: string;
  cover?: string;
  genre?: string;
  bpm?: number;
  emotion?: string;
  energyLevel?: number;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string; // Adding title property for compatibility
  description?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  category?: string;
  emotion?: string;
  trackCount?: number;
  duration?: number;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  playlist: MusicPlaylist | null;
  play: (track?: MusicTrack, playlist?: MusicPlaylist) => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  togglePlayback: () => void;
}

export interface MusicDrawerProps {
  children?: ReactNode;
  isOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  currentTrack: MusicTrack | null;
  playlist?: MusicPlaylist;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl?: string;
  duration: number;
}

export interface ProgressBarProps {
  progress?: number;
  value?: number; // Added for compatibility
  max?: number; // Added for compatibility
  onSeek?: (value: number) => void;
  className?: string;
  showLabel?: boolean; // Added for compatibility
  variant?: string; // Added for compatibility
  currentTime?: number; // Added for compatibility
  duration?: number; // Added for compatibility
  formatTime?: (seconds: number) => string; // Added for compatibility
  handleProgressClick?: (e: any) => void; // Added for compatibility
  showTimestamps?: boolean; // Added for compatibility
}

export interface TrackInfoProps {
  track: MusicTrack;
  isActive?: boolean;
  onClick?: () => void;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange?: (volume: number) => void;
  className?: string;
}

export interface EmotionMusicParams {
  emotion?: string;
  intensity?: number;
  style?: string;
}

export interface MusicLibraryProps {
  playlists: MusicPlaylist[];
  onSelectTrack: (track: MusicTrack) => void;
  onSelectPlaylist: (playlist: MusicPlaylist) => void;
}
