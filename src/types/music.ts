
import { ReactNode } from 'react';
import { User } from './user';
import { Emotion } from './emotion';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl?: string;
  url?: string;
  coverUrl?: string;
  cover?: string;
  cover_url?: string;
  duration?: number;
  emotion?: string;
  created_at?: string;
  createdAt?: string;
  description?: string;
  tags?: string[];
  user_id?: string;
  playCount?: number;
  isPlaying?: boolean;
  isFavorite?: boolean;
  album?: string;
  genre?: string;
  [key: string]: any; // For flexibility
}

export interface MusicPlaylist {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  coverUrl?: string;
  cover?: string;
  tracks: MusicTrack[];
  emotion?: string;
  created_at?: string;
  createdAt?: string;
  user_id?: string;
  tags?: string[];
  isPublic?: boolean;
  playCount?: number;
  trackCount?: number;
  duration?: number;
  category?: string;
}

export interface MusicContextType {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  volume: number;
  isMuted: boolean;
  playlist: MusicPlaylist | null;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaylist: (playlist: MusicPlaylist) => void;
  addToPlaylist: (track: MusicTrack, playlistId: string) => void;
  removeFromPlaylist: (trackId: string, playlistId: string) => void;
  createPlaylist: (name: string, tracks?: MusicTrack[]) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  currentTime?: number;
  duration?: number;
  loading?: boolean;
  error?: Error | null;
}

export interface MusicDrawerProps {
  isOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  playlist?: MusicPlaylist;
  currentTrack?: MusicTrack;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  minDuration?: number;
  maxDuration?: number;
}

// For compatibility with services/music/types.ts
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

export interface TrackInfoProps {
  track?: MusicTrack;
  title?: string;
  artist?: string;
  coverUrl?: string;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: MusicTrack | null;
  loadingTrack?: boolean;
  audioError?: boolean;
  className?: string;
  compact?: boolean;
}

export interface ProgressBarProps {
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
  formatTime?: (time: number) => string;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  showTimestamps?: boolean;
  className?: string;
}

export interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
  onVolumeChange?: (volume: number) => void;
  showLabel?: boolean;
  className?: string;
}
