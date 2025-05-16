
import { ReactNode } from 'react';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverUrl?: string;
  cover?: string;
  coverImage?: string;
  cover_url?: string;
  audioUrl?: string;
  track_url?: string;
  genre?: string;
  mood?: string;
  emotion?: string;
  tags?: string[];
  playCount?: number;
  isFavorite?: boolean;
  source?: 'local' | 'remote' | 'spotify' | 'youtube';
  album?: string;
  year?: number;
  intensity?: number;
  emotionalTone?: string;
  category?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description?: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
  isPublic?: boolean;
  userId?: string;
  tags?: string[];
  emotion?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  duration: number;
  currentTime: number;
  muted: boolean;
  playlist: MusicTrack[];
  playlists?: MusicPlaylist[];
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  prevTrack?: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  pauseTrack: () => void;
  playTrack: (track: MusicTrack) => void;
  play?: (track: MusicTrack) => void;
  pause?: () => void;
  resume?: () => void;
  stop?: () => void;
  next?: () => void;
  previous?: () => void;
  mute?: () => void;
  unmute?: () => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
  currentEmotion?: string;
  setEmotion?: (emotion: string) => void;
  currentPlaylist?: MusicPlaylist | null;
  setOpenDrawer: (open: boolean) => void;
  openDrawer?: boolean;
  error?: Error | null;
  isInitialized: boolean;
  initializeMusicSystem: () => void | Promise<boolean>;
  setPlaylist?: (playlist: MusicPlaylist) => void;
  progress?: number;
  isMuted?: boolean;
}

export interface MusicDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  playlist?: MusicTrack[] | MusicPlaylist;
  currentTrack?: MusicTrack | null;
  children?: ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  isOpen?: boolean;
  onClose?: () => void;
}

export interface ProgressBarProps {
  position: number;
  max?: number;
  onChange?: (value: number) => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  className?: string;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  onChange?: (volume: number) => void;
  isMuted?: boolean;
  muted?: boolean;
  onMuteToggle: () => void;
  className?: string;
  showLabel?: boolean;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onTogglePlay?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
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
  tracks?: MusicTrack[];
  selectedTrackId?: string;
  playlists?: MusicPlaylist[];
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
  onTrackSelect: (track: MusicTrack) => void;
  currentTrack?: MusicTrack | null;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  isPlaying?: boolean;
  onSelectTrack?: (track: MusicTrack) => void;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  duration?: number;
  purpose?: 'relax' | 'focus' | 'energize' | 'sleep';
}

export interface TrackInfoProps {
  track: MusicTrack;
  showCover?: boolean;
  showArtist?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

