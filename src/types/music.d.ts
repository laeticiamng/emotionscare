
import React from 'react';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  coverUrl?: string;
  category?: string;
  mood?: string;
  bpm?: number;
  isExplicit?: boolean;
  lyrics?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description?: string;
  tracks: MusicTrack[];
  category?: string;
  coverUrl?: string;
}

export interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  className?: string;
  variant?: 'default' | 'thin';
  currentTime?: number;
  duration?: number;
  formatTime?: (seconds: number) => string;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  showTimestamps?: boolean;
  onSeek?: (value: number) => void;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
  isMuted: boolean;
  onMuteToggle: () => void;
  className?: string;
  onChange?: (value: number) => void;
  showLabel?: boolean;
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export interface MusicLibraryProps {
  playlists: MusicPlaylist[];
  onSelectTrack?: (track: MusicTrack) => void;
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
}
