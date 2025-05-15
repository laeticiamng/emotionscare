
/**
 * Basic music track type
 */
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverUrl?: string;
  cover_url?: string;
  audioUrl?: string;
  audio_url?: string;
  emotion?: string;
  category?: string;
  bpm?: number;
  explicit?: boolean;
  year?: number;
  album?: string;
  isPlaying?: boolean;
}

/**
 * Alias for MusicTrack (for compatibility)
 */
export interface Track extends MusicTrack {}

/**
 * Music playlist type
 */
export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description?: string;
  coverUrl?: string;
  cover_url?: string;
  tracks: MusicTrack[];
  category?: string;
  emotion?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  duration?: number;
  tracksCount?: number;
}

/**
 * Parameters for emotion-based music recommendations
 */
export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  limit?: number;
  includeRelated?: boolean;
  category?: string;
}

/**
 * Context type for the music player
 */
export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicTrack[];
  isPlaying: boolean;
  volume: number;
  duration: number;
  currentTime: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  repeatMode: 'off' | 'one' | 'all';
  setRepeatMode: (mode: 'off' | 'one' | 'all') => void;
  shuffleMode: boolean;
  setShuffleMode: (mode: boolean) => void;
}

/**
 * Props for music drawer component
 */
export interface MusicDrawerProps {
  open?: boolean;
  onClose?: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Props for track info component
 */
export interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
  showArtist?: boolean;
  showCover?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Props for progress bar component
 */
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

/**
 * Props for volume control component
 */
export interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
}
