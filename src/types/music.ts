
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  duration?: number;
  url?: string;
  audioUrl?: string;
  coverUrl?: string;
  emotion?: string;
  intensity?: number;
  category?: string;
  source?: string;
  track_url?: string; // Legacy support
}

export interface MusicPlaylist {
  id: string;
  title?: string;
  name?: string;
  emotion?: string;
  tracks: MusicTrack[];
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  formatTime?: (seconds: number) => string;
  className?: string;
  showTimestamps?: boolean;
}

export interface VolumeControlProps {
  volume: number;
  muted?: boolean;
  isMuted?: boolean;
  onChange?: (volume: number) => void;
  onVolumeChange?: (volume: number) => void;
  onMuteToggle?: () => void;
  className?: string;
  showLabel?: boolean;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
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
  track?: MusicTrack | null;
  showVolume?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface MusicLibraryProps {
  onTrackSelect?: (track: MusicTrack) => void;
  currentTrack?: MusicTrack | null;
  isPlaying?: boolean;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  tracks?: MusicTrack[];
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  playlist: MusicTrack[];
  duration: number;
  currentTime: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  setVolume: (volume: number) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seekTo: (time: number) => void;
  toggleMute: () => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
  setEmotion: (emotion: string) => void;
  setOpenDrawer?: (open: boolean) => void;
  currentEmotion?: string;
}

export interface MusicDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isOpen?: boolean;
  onClose?: () => void;
  playlist?: MusicPlaylist | null;
  currentTrack?: MusicTrack | null;
  children?: React.ReactNode;
  side?: "left" | "right";
}
