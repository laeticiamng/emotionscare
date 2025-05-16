
import { ReactNode } from 'react';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  url: string;
  coverUrl?: string;
  cover?: string; // alias for coverUrl
  coverImage?: string; // alias for coverUrl
  cover_url?: string; // alias for coverUrl
  audioUrl?: string; // alias for url
  track_url?: string; // alias for url
  category?: string;
  tags?: string[];
  mood?: string;
  emotion?: string;
  isFavorite?: boolean;
  playCount?: number;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  name?: string;
  description?: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  emotion?: string;
}

export type MusicMood = 'calm' | 'happy' | 'sad' | 'energetic' | 'focused';

export interface ProgressBarProps {
  position: number;
  max: number;
  onChange: (value: number) => void;
  onSeek?: (time: number) => void;
  currentTime?: number;
  duration?: number;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
  className?: string;
}

export interface VolumeControlProps {
  volume: number;
  onChange?: (volume: number) => void;
  onVolumeChange: (volume: number) => void;
  isMuted?: boolean;
  muted?: boolean;
  onMuteToggle?: () => void;
  className?: string;
  showLabel?: boolean;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (position: number) => void;
  volume?: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onVolumeChange?: (volume: number) => void;
  track?: MusicTrack | null;
  showVolume?: boolean;
  size?: 'sm' | 'md' | 'lg';
  vertical?: boolean;
  className?: string;
}

export interface MusicLibraryProps {
  onSelectTrack?: (track: MusicTrack) => void;
  currentTrack?: MusicTrack | null;
  isPlaying?: boolean;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  tracks?: MusicTrack[];
  onTrackSelect?: (track: MusicTrack) => void;
  playlists?: MusicPlaylist[];
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
}

export interface MusicDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isOpen?: boolean;
  onClose?: () => void;
  playlist?: MusicPlaylist | MusicTrack[];
  currentTrack?: MusicTrack | null;
  children?: React.ReactNode;
  side?: 'left' | 'right';
}

export interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
  showCover?: boolean;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  duration?: number;
  tempo?: number;
  mode?: 'major' | 'minor';
}
