
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
  coverUrl?: string;
  cover_url?: string;  // For compatibility
  audioUrl?: string;
  audio_url?: string;  // For compatibility
  emotion?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title: string;
  emotion?: string;
  tracks: MusicTrack[];
  category?: string;
  coverUrl?: string;
  cover_url?: string;
  cover?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  isMuted?: boolean;
  toggleMute?: () => void;
  playTrack: (track: MusicTrack, playlist?: MusicPlaylist) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack?: () => void;
  prevTrack?: () => void;
  setVolume: (volume: number) => void;
  seekTo: (progress: number) => void;
  loadPlaylistForEmotion?: (emotion: string) => Promise<MusicPlaylist | null>;
}

export interface MusicDrawerProps {
  open?: boolean;
  onClose?: () => void;
  playlist?: MusicPlaylist;
  currentTrack?: MusicTrack;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
  coverUrl?: string;
  cover_url?: string;
  audioUrl?: string;
  audio_url?: string;
  emotion?: string;
}

export interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  progress?: number;
  onSeek?: (percentage: number) => void;
  currentTime?: number;
  duration?: number;
  formatTime?: (seconds: number) => string;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  showTimestamps?: boolean;
  onChange?: (value: number) => void;
}

export interface TrackInfoProps {
  track?: MusicTrack;
  title?: string;
  artist?: string;
  coverUrl?: string;
  cover_url?: string;
  cover?: string;
  className?: string;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: MusicTrack;
  loadingTrack?: boolean;
  audioError?: Error | null;
  compact?: boolean;
}

export interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
  onVolumeChange?: (value: number) => void;
  className?: string;
  showLabel?: boolean;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  tempo?: 'slow' | 'medium' | 'fast';
}
