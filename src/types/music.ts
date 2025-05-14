
import type { MusicTrack, MusicPlaylist } from '@/types/types';

export type { MusicTrack, MusicPlaylist };

export interface MusicContextType {
  // Playback control
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;

  // Drawer control
  setOpenDrawer: (open: boolean) => void;

  // Track & playlist state
  tracks: MusicTrack[];
  currentTrack: MusicTrack | null;
  playlists: MusicPlaylist[];
  loadPlaylistById: (id: string) => void;

  // Emotion-based recommendation
  currentEmotion: string;
  setEmotion: (emotion: string) => void;

  // Volume & mute control
  isMuted: boolean;
  toggleMute: () => void;
  adjustVolume: (value: number) => void;

  // System state
  isInitialized: boolean;
  initializeMusicSystem: () => void;
  error?: string | null;
  
  // For backward compatibility
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null>;
  isPlaying: boolean;
  volume: number;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  openDrawer: boolean;
  currentPlaylist: MusicPlaylist | null;
  resumeTrack: () => void;
  progress: number;
  duration: number;
  seekTo: (time: number) => void;
  formatTime: (seconds: number) => string;
  isShuffled: boolean;
  isRepeating: boolean;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

export interface TrackListProps {
  tracks: MusicTrack[];
  onTrackSelect: (track: MusicTrack) => void;
  onPlayPause?: (track: MusicTrack) => void;
  currentTrack?: MusicTrack | null;
  isPlaying?: boolean;
  compact?: boolean;
  showEmotionTag?: boolean;
  onPlay?: (track: MusicTrack) => void;
}

export interface MusicDrawerProps {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  playlist?: MusicPlaylist;
  currentTrack?: MusicTrack;
}

export interface TrackInfoProps {
  track?: MusicTrack;
  className?: string;
  compact?: boolean;
  title?: string;
  artist?: string;
  coverUrl?: string;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: MusicTrack;
  loadingTrack?: boolean;
  audioError?: Error | null;
}

export interface VolumeControlProps {
  volume: number;
  onChange: (value: number) => void;
  onVolumeChange?: (value: number) => void;
  showLabel?: boolean;
  className?: string;
}

export interface ProgressBarProps {
  value: number;
  max: number;
  onChange?: (value: number) => void;
  formatTime?: (seconds: number) => string;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  className?: string;
  showTimestamps?: boolean;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  progress?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
}
