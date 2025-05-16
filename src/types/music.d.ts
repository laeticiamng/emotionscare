
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url?: string;
  track_url?: string; // For compatibility
  audioUrl?: string; // For compatibility
  coverUrl?: string;
  cover_url?: string;
  cover?: string;
  emotion?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string; // For compatibility
  description?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  cover_url?: string;
  emotion?: string;
}

export interface MusicLibraryProps {
  playlists: MusicPlaylist[];
  onSelectTrack: (track: MusicTrack) => void;
  onSelectPlaylist: (playlist: MusicPlaylist) => void;
}

export interface MusicDrawerProps {
  open?: boolean;
  isOpen?: boolean; // For compatibility
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
  currentTrack?: MusicTrack;
  playlist?: MusicPlaylist;
  children?: React.ReactNode;
  side?: 'bottom' | 'left' | 'right' | 'top';
}

export interface MusicControlsProps {
  track: MusicTrack;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onVolumeChange: (volume: number) => void;
  onSeek: (position: number) => void;
  volume: number;
  progress: number;
  currentTime: number;
  duration: number;
}

export interface MusicProgressBarProps {
  progress: number;
  max: number;
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

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  duration?: number;
}
