
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  coverUrl?: string;
  url?: string;
  genre?: string;
  album?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description?: string;
  tracks: MusicTrack[];
  category?: string;
  coverUrl?: string;
}

export interface TrackInfoProps {
  track: MusicTrack | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface ProgressBarProps {
  progress?: number;
  value?: number;
  max?: number;
  onSeek?: (value: number) => void;
  className?: string;
  currentTime?: number;
  duration?: number;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
  variant?: 'default' | 'thin' | 'thick';
  handleProgressClick?: (e: any) => void;
  showLabel?: boolean;
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
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  duration?: number;
  tempo?: 'slow' | 'medium' | 'fast';
}
