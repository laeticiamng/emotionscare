
import { ReactNode } from 'react';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  cover?: string;
  cover_url?: string;  // For backwards compatibility
  audioUrl?: string;
  url?: string;
  duration: number;
  emotion?: string;  // Adding this since it's used in MusicCreator
  [key: string]: any;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  emotion?: string;
  category?: string;
  [key: string]: any;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

export interface MusicDrawerProps {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  currentTrack?: MusicTrack | null;
  onClose?: () => void;
  children?: ReactNode;
}

export interface ProgressBarProps {
  value: number;
  max: number;
  currentTime?: number;
  duration?: number;
  showLabel?: boolean;
  className?: string;
  variant?: 'default' | 'progress' | 'music';
  formatTime?: (seconds: number) => string;
  handleProgressClick?: (e: any) => void;
  showTimestamps?: boolean;
}

export interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
  showControls?: boolean;
  showArtist?: boolean;
  compact?: boolean;
}

export interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  duration?: number;
  recommendationCount?: number;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
  coverUrl?: string;
  audioUrl?: string;
  emotion?: string;
}
