
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
}

export interface MusicPlaylist {
  id: string;
  title: string;
  description?: string;
  cover_url?: string;
  coverUrl?: string;
  tracks: MusicTrack[];
}

export interface MusicProgressBarProps {
  progress: number;
  max?: number;
  currentTime: number;
  duration: number;
  onSeek: (value: number) => void;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
  className?: string;
}

export interface VolumeControlProps {
  volume: number;
  onChange: (value: number) => void;
  isMuted: boolean;
  onMuteToggle: () => void;
  className?: string;
  showLabel?: boolean;
}

export interface MusicDrawerProps {
  children?: ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  currentTrack?: MusicTrack | null;
  playlist?: MusicPlaylist | null;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity: number;
}

export interface MusicContextType {
  // Playback control
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  
  // Backward compatibility
  play: (track: MusicTrack) => void;
  pause: () => void;
  resumeTrack: () => void;
  
  // Drawer control
  setOpenDrawer: (open: boolean) => void;
  openDrawer: boolean;
  
  // Track & playlist state
  tracks: MusicTrack[];
  currentTrack: MusicTrack | null;
  playlists: MusicPlaylist[];
  loadPlaylistById: (id: string) => void;
  currentPlaylist: MusicPlaylist | null;
  
  // Emotion-based recommendation
  currentEmotion: string;
  setEmotion: (emotion: string) => void;
  
  // Volume & mute control
  isMuted: boolean;
  toggleMute: () => void;
  adjustVolume: (value: number) => void;
  volume: number;
  setVolume: (value: number) => void;
  
  // System state
  isInitialized: boolean;
  initializeMusicSystem: () => void;
  error?: string | null;
  isPlaying?: boolean;
  loadPlaylistForEmotion: (params: EmotionMusicParams) => Promise<MusicPlaylist | null>;
  
  // Metadata
  currentTrackDuration?: number;
  currentTime?: number;
  loading?: boolean;
  
  // Music generation
  generateMusic?: (params: any) => Promise<any>;
  isGenerating?: boolean;
}
