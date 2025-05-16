
import { ReactNode } from 'react';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration?: number;
  audioUrl?: string;
  coverUrl?: string;
  url?: string;
  cover_url?: string; // Pour compatibilité avec ancien code
  mood?: string;
  category?: string;
  intensity?: number;
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
  error?: string | null;
}

export interface MusicDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (position: number) => void;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMuted?: boolean;
  onMuteToggle?: () => void;
  showLabel?: boolean;
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
}
