
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  cover?: string;
  cover_url?: string;
  audioUrl: string;
  audio_url?: string;
  duration: number;
  mood?: string;
  emotion?: string;
  tags?: string[];
  isPlaying?: boolean;
  isFavorite?: boolean;
}

export interface Track extends MusicTrack {
  // Additional properties specific to Track if needed
}

export interface MusicPlaylist {
  id: string;
  title: string;
  description?: string;
  coverUrl: string;
  tracks: MusicTrack[];
  emotion?: string;
  category?: string;
  createdBy?: string;
  createdAt?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
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
  seekTo: (time: number) => void;
  addToPlaylist: (track: MusicTrack, playlistId: string) => void;
  removeFromPlaylist: (trackId: string, playlistId: string) => void;
  createPlaylist: (playlist: Omit<MusicPlaylist, 'id'>) => void;
  setPlaylist: (playlist: MusicPlaylist) => void;
  toggleFavorite: (trackId: string) => void;
  loading: boolean;
  error: string | null;
}

export interface MusicDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  playlist?: MusicPlaylist;
  currentTrack?: MusicTrack;
  onTrackSelect?: (track: MusicTrack) => void;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  minimal?: boolean;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  formatTime: (time: number) => string;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  showTimestamps?: boolean;
  className?: string;
}

export interface TrackInfoProps {
  title: string;
  artist: string;
  coverUrl?: string;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: MusicTrack | null;
  loadingTrack?: boolean;
  audioError?: string | null;
  className?: string;
}

export interface VolumeControlProps {
  volume: number;
  onChange: (value: number) => void;
  showLabel?: boolean;
  className?: string;
}
