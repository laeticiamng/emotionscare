
import { ReactNode } from 'react';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  coverUrl?: string;
  cover_url?: string;
  audioUrl: string;
  category?: string;
  isFavorited?: boolean;
  emotionalTone?: string;
  mood?: string;
  emotions?: string[];
  bpm?: number;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  cover_url?: string;
  tracks: MusicTrack[];
  category?: string;
  mood?: string;
  createdBy?: string;
  isFeatured?: boolean;
  duration?: number;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isMuted: boolean;
  repeatMode: 'none' | 'one' | 'all';
  queue: MusicTrack[];
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  toggleRepeat: () => void;
  addToQueue: (track: MusicTrack) => void;
  clearQueue: () => void;
  removeFromQueue: (trackId: string) => void;
  shuffle: () => void;
}

export interface MusicDrawerProps {
  children?: ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  currentTrack?: MusicTrack | null;
  playlist?: MusicPlaylist | null;
}

// Aliases for older/existing components
export type Track = MusicTrack;

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (position: number) => void;
  className?: string;
}

export type MusicProgressBarProps = ProgressBarProps;

export interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  onChange?: (volume: number) => void;
  isMuted?: boolean;
  onMuteToggle?: () => void;
  className?: string;
  showLabel?: boolean;
}

export interface MusicLibraryProps {
  onSelectTrack: (track: MusicTrack) => void;
  onSelectPlaylist: (playlist: MusicPlaylist) => void;
  playlists?: MusicPlaylist[];
}
