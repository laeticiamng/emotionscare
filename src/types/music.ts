
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  cover?: string;
  coverUrl?: string;
  cover_url?: string;
  url: string;
  source?: string;
  file?: string;
  audioUrl?: string;
  audio_url?: string;
  lyrics?: string;
  mood?: string;
  tempo?: number;
  genre?: string;
  emotion?: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  cover?: string;
  url: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description?: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  emotion?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  duration: number;
  currentTime: number;
  playlist: MusicTrack[];
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
  playlist?: MusicPlaylist;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  formatTime?: (time: number) => string;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  showTimestamps?: boolean;
  className?: string;
}

export interface TrackInfoProps {
  track?: MusicTrack | null;
  title?: string;
  artist?: string;
  coverUrl?: string;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: MusicTrack | null;
  loadingTrack?: boolean;
  audioError?: boolean;
  className?: string;
}

export interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
  onVolumeChange?: (volume: number) => void;
  showLabel?: boolean;
  className?: string;
}
