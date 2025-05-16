
import { ReactNode } from 'react';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url?: string;
  audioUrl?: string;
  thumbnailUrl?: string;
  coverUrl?: string;
  cover?: string;
  cover_url?: string; // Alias pour compatibilité
  isPlaying?: boolean;
  isFavorite?: boolean;
  mood?: string;
  tempo?: number;
  intensity?: number;
  energy?: number;
  tags?: string[];
  category?: string;
  albumId?: string;
  album?: string;
  dateAdded?: Date | string;
  playCount?: number;
  track_url?: string; // Alias pour compatibilité
  emotionalTone?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string; // Alias pour compatibilité
  description?: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  trackCount?: number;
  totalDuration?: number;
  createdBy?: string;
  createdAt?: Date | string;
  isFeatured?: boolean;
  isPublic?: boolean;
  mood?: string;
  tags?: string[];
}

export interface MusicPlayerState {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  repeat: 'off' | 'all' | 'one';
  shuffle: boolean;
}

export interface MusicPlayerControls {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  playTrack: (trackId: string) => void;
  setPlaylist: (playlist: MusicPlaylist) => void;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  repeat: 'off' | 'all' | 'one';
  shuffle: boolean;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  playTrack: (track: MusicTrack) => void;
  setPlaylist: (playlist: MusicPlaylist) => void;
  loadPlaylistForEmotion: (emotion: string, intensity?: number) => Promise<void>;
}

export interface MusicPlayerProps {
  onTrackChange?: (track: MusicTrack | null) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  initialTrack?: MusicTrack;
  initialPlaylist?: MusicPlaylist;
  autoplay?: boolean;
  showControls?: boolean;
  className?: string;
}

export interface MusicControlsProps {
  size?: 'sm' | 'md' | 'lg';
  vertical?: boolean;
  showVolume?: boolean;
  className?: string;
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onTogglePlay?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  volume?: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onVolumeChange?: (volume: number) => void;
  track?: MusicTrack;
}

export interface MusicProgressProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
  progress?: number;
  max?: number;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
}

export interface MusicVolumeProps {
  volume: number;
  muted: boolean;
  onChange: (volume: number) => void;
  onMuteToggle: () => void;
  className?: string;
}

export interface VolumeControlProps {
  volume: number;
  muted: boolean;
  onChange: (volume: number) => void;
  onMuteToggle: () => void;
  className?: string;
  onVolumeChange?: (volume: number) => void;
  isMuted?: boolean;
  showLabel?: boolean;
}

export interface MusicTrackInfoProps {
  track: MusicTrack | null;
  className?: string;
}

export interface TrackInfoProps {
  track: MusicTrack | null;
  className?: string;
}

export interface MusicLibraryProps {
  playlists: MusicPlaylist[];
  onSelectPlaylist: (playlist: MusicPlaylist) => void;
  onSelectTrack?: (track: MusicTrack) => void;
  onTrackSelect?: (track: MusicTrack) => void;
  currentTrack?: MusicTrack;
  isPlaying?: boolean;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  tracks?: MusicTrack[];
}

export interface MusicDrawerProps {
  isOpen?: boolean;
  open?: boolean; // Alias
  onOpenChange?: (isOpen: boolean) => void;
  onClose?: () => void; // Alias
  side?: "left" | "right" | "top" | "bottom";
  playlist?: MusicPlaylist | null;
  currentTrack?: MusicTrack | null;
  children?: ReactNode;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  duration?: number;
}
