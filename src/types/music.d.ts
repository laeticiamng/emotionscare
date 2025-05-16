
export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  duration?: number;
  preference?: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  coverUrl?: string;
  cover?: string;
  cover_url?: string;
  url?: string;
  audioUrl?: string;
  track_url?: string;
  category?: string;
}

export interface MusicPlaylist {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  category?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
}

export interface MusicDrawerProps {
  children?: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  open?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  currentTrack?: MusicTrack | null;
  playlist?: MusicPlaylist | null;
}

export interface ProgressBarProps {
  value?: number;
  max?: number;
  currentTime?: number;
  duration?: number;
  onSeek?: (value: number) => void;
  className?: string;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
  progress?: number;
  onChange?: (value: number) => void;
}

export interface VolumeControlProps {
  volume?: number;
  onChange?: (value: number) => void;
  onVolumeChange?: (value: number) => void;
  className?: string;
  showLabel?: boolean;
  isMuted?: boolean;
  onMuteToggle?: () => void;
}

export interface MusicLibraryProps {
  playlists?: MusicPlaylist[];
  onSelectTrack?: (track: MusicTrack) => void;
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
}
