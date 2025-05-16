
import { ReactNode } from 'react';

export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  url?: string;
  audioUrl?: string;
  coverUrl?: string;
  cover?: string;
  duration?: number;
  emotion?: string;
  intensity?: number;
  category?: string;
  track_url?: string;
  coverImage?: string;
  mood?: string;
}

export interface MusicPlaylist {
  id: string;
  name?: string;
  title?: string;
  emotion?: string;
  tracks: MusicTrack[];
  category?: string;
  mood?: string;
  description?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  isMuted?: boolean;
  playlist?: MusicTrack[];
  duration: number;
  currentTime: number;
  progress?: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  play?: (track: MusicTrack) => void;
  pause?: () => void;
  resume?: () => void;
  stop?: () => void;
  setVolume: (volume: number) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  prevTrack?: () => void;
  next?: () => void;
  previous?: () => void;
  seekTo: (time: number) => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
  toggleMute: () => void;
  mute?: () => void;
  unmute?: () => void;
  setEmotion: (emotion: string) => void;
  currentEmotion?: string | null;
  setOpenDrawer?: (open: boolean) => void;
  openDrawer?: boolean;
  playlists?: MusicPlaylist[];
  currentPlaylist?: MusicPlaylist | null;
  isInitialized?: boolean;
  initializeMusicSystem?: () => Promise<boolean | void>;
  error?: Error | null;
  isShuffled?: boolean;
  isRepeating?: boolean;
  setProgress?: (progress: number) => void;
  findRecommendedTracksForEmotion?: (emotion: string) => MusicTrack[];
  toggleShuffle?: () => void;
  toggleRepeat?: () => void;
  setPlaylist?: (playlist: MusicPlaylist) => void;
}

export interface MusicDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
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
  isMuted: boolean;
  onMuteToggle: () => void;
  showLabel?: boolean;
  className?: string;
}

export interface MusicControlsProps {
  isPlaying?: boolean;
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
  track?: MusicTrack;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface MusicLibraryProps {
  onSelectTrack?: (track: MusicTrack) => void;
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
  className?: string;
}
