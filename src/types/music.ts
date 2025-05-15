
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  coverUrl?: string;
  url?: string;
  genre?: string;
  album?: string;
  audioUrl?: string;
  cover?: string; // Added for backward compatibility
  cover_url?: string; // Added for backward compatibility
  emotion?: string; // Added for compatibility with emotion-based tracks
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description?: string;
  tracks: MusicTrack[];
  category?: string;
  coverUrl?: string;
  emotion?: string; // Added for emotion-based playlists
}

export interface TrackInfoProps {
  track: MusicTrack | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface ProgressBarProps {
  progress?: number;
  value?: number; // Added for compatibility
  max?: number; // Added for compatibility
  onSeek?: (value: number) => void;
  className?: string;
  currentTime?: number; // Added for compatibility
  duration?: number; // Added for compatibility
  formatTime?: (seconds: number) => string; // Added for compatibility
  showTimestamps?: boolean;
  variant?: 'default' | 'thin' | 'thick';
  handleProgressClick?: (e: any) => void; // Added for compatibility
  showLabel?: boolean; // Added for compatibility
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  className?: string;
  onChange?: (volume: number) => void;
  showLabel?: boolean;
}

export interface MusicLibraryProps {
  playlists: MusicPlaylist[];
  onSelectTrack: (track: MusicTrack) => void;
  onSelectPlaylist: (playlist: MusicPlaylist) => void;
}

export interface PlayerTabProps {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url?: string;
  coverUrl?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
}

export interface MusicDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  playlist?: MusicPlaylist;
  initialTrack?: MusicTrack;
  children?: React.ReactNode; // Added for compatibility
  isOpen?: boolean; // Added for compatibility
  onClose?: () => void; // Added for compatibility
  currentTrack?: MusicTrack; // Added for compatibility
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  duration?: number;
  tempo?: 'slow' | 'medium' | 'fast';
}
