
import { ReactNode } from 'react';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration?: number;
  audioUrl?: string;
  coverUrl?: string;
  url?: string;
  cover_url?: string; 
  cover?: string;
  coverImage?: string;
  mood?: string;
  category?: string;
  intensity?: number;
  emotion?: string;
  track_url?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title: string;
  description?: string;
  tracks: MusicTrack[];
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  isMuted?: boolean;
  muted?: boolean;
  progress?: number;
  currentTime?: number;
  duration?: number;
  currentPlaylist?: MusicPlaylist | null;
  currentEmotion?: string | null;
  playlist?: MusicPlaylist | null;
  playlists?: MusicPlaylist[];
  
  // Fonctions pour contrôler la musique
  play?: (track: MusicTrack) => void;
  playTrack?: (track: MusicTrack) => void;
  pause?: () => void;
  pauseTrack?: () => void;
  resume?: () => void;
  stop?: () => void;
  next?: () => void;
  nextTrack?: () => void;
  previous?: () => void;
  previousTrack?: () => void;
  setVolume: (volume: number) => void;
  togglePlay: () => void;
  toggleMute: () => void;
  mute?: () => void;
  unmute?: () => void;
  seekTo: (position: number) => void;
  setPlaylist?: (playlist: MusicPlaylist) => void;
  loadPlaylistForEmotion?: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
  setEmotion?: (emotion: string) => void;
  setOpenDrawer?: (isOpen: boolean) => void;
  openDrawer?: boolean;
  
  // États et erreurs
  isInitialized?: boolean;
  initializeMusicSystem?: () => Promise<void>;
  error?: Error | null;
}

export interface MusicDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  onClose?: () => void;
  isOpen?: boolean;
  playlist?: MusicPlaylist;
  currentTrack?: MusicTrack | null;
  side?: "left" | "right" | "top" | "bottom";
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (position: number) => void;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
  className?: string;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMuted?: boolean;
  onMuteToggle?: () => void;
  showLabel?: boolean;
  className?: string;
  muted?: boolean;
  onChange?: (volume: number) => void;
}

export interface MusicControlsProps {
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onTogglePlay?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (position: number) => void;
  volume?: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onVolumeChange?: (volume: number) => void;
  track?: MusicTrack;
  showVolume?: boolean;
  size?: 'sm' | 'md' | 'lg';
  vertical?: boolean;
  className?: string;
}

export interface MusicLibraryProps {
  onTrackSelect?: (track: MusicTrack) => void;
  filter?: string;
  sortBy?: 'title' | 'artist' | 'duration';
  filterByMood?: string;
  currentTrack?: MusicTrack | null;
  playlists?: MusicPlaylist[];
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
  tracks?: MusicTrack[];
}
