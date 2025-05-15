
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  audioUrl?: string;
  coverUrl?: string;
  cover?: string;
  cover_url?: string;
  duration?: number;
  emotion?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  description?: string;
  emotion?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  progress: number;
  duration: number;
  seek: (time: number) => void;
  playlists: MusicPlaylist[];
  currentPlaylist: MusicPlaylist | null;
  setCurrentPlaylist: (playlist: MusicPlaylist | null) => void;
  addToQueue: (track: MusicTrack) => void;
  queue: MusicTrack[];
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  loadPlaylistForEmotion?: (emotion: string) => Promise<MusicPlaylist | null>;
  openDrawer?: boolean;
  setOpenDrawer?: (open: boolean) => void;
}

export interface MusicDrawerProps {
  isOpen?: boolean;
  open?: boolean;
  side?: 'left' | 'right' | 'top' | 'bottom';
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  playlist?: MusicPlaylist;
  currentTrack?: MusicTrack;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover?: string;
  duration?: number;
}

export interface ProgressBarProps {
  value: number;
  max: number;
  onChange?: (value: number) => void;
  className?: string;
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
  onVolumeChange: (volume: number) => void;
  className?: string;
  onChange?: (volume: number) => void;
  showLabel?: boolean;
}
