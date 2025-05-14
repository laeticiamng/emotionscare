
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  audioUrl?: string;
  coverUrl?: string;
  duration?: number;
  emotion?: string;
  cover?: string;
  cover_url?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
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
  side?: 'left' | 'right' | 'top' | 'bottom';
  onOpenChange?: (open: boolean) => void;
  playlist?: MusicPlaylist;
  currentTrack?: MusicTrack;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
  coverUrl?: string;
  audioUrl?: string;
  emotion?: string;
}

export interface ProgressBarProps {
  value: number;
  max: number;
  onSeek?: (value: number) => void;
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
  onVolumeChange: (value: number) => void;
  className?: string;
  onChange?: (volume: number) => void;
  showLabel?: boolean;
}
