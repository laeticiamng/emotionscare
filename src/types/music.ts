
import { ReactNode } from 'react';

export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  duration: number;
  url?: string;
  audioUrl?: string;
  cover_url?: string;
  coverUrl?: string;
  track_url?: string;
  cover?: string;
  emotionalTone?: string;
  mood?: string;
  emotions?: string[];
  bpm?: number;
  category?: string;
  isFavorited?: boolean;
}

export interface MusicPlaylist {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  cover_url?: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  category?: string;
  mood?: string;
  createdBy?: string;
  isFeatured?: boolean;
  duration?: number;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (position: number) => void;
  className?: string;
  progress?: number;
  max?: number;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
  value?: number;
  onChange?: (value: number) => void;
  showLabel?: boolean;
  variant?: string;
  handleProgressClick?: (e: any) => void;
}

export interface MusicProgressBarProps extends ProgressBarProps {}

export interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange?: (volume: number) => void;
  onChange?: (volume: number) => void;
  isMuted?: boolean;
  onMuteToggle?: () => void;
  className?: string;
  showLabel?: boolean;
}

export interface MusicLibraryProps {
  onSelectTrack?: (track: MusicTrack) => void;
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
  playlists?: MusicPlaylist[];
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onVolumeChange?: (volume: number) => void;
  volume?: number;
  progress?: number;
  duration?: number;
  onProgressChange?: (value: number) => void;
  currentTrack?: MusicTrack;
  track?: MusicTrack;
  currentTime?: number;
  onSeek?: (position: number) => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onTogglePlay?: () => void;
}

export interface MusicDrawerProps {
  children?: ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  currentTrack?: MusicTrack | null;
  playlist?: MusicPlaylist | null;
}

export interface MusicPlayerProps {
  tracks: MusicTrack[];
  autoPlay?: boolean;
  initialTrack?: MusicTrack;
  onTrackChange?: (track: MusicTrack) => void;
  onPlay?: () => void;
  onPause?: () => void;
}

export interface MoodBasedRecommendationsProps {
  mood: string;
  standalone?: boolean;
  intensity?: number;
}

// Aliases for older/existing components
export type Track = MusicTrack;
