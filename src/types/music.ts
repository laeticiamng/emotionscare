
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  audioUrl: string;
  coverUrl: string;
  emotion?: string;
  
  // For backward compatibility
  cover_url?: string;
  audio_url?: string;
}

export interface Track extends MusicTrack {
  // Additional properties if needed
  coverUrl: string;
  cover_url?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title: string; 
  description?: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  category?: string;
  emotion?: string; 
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  duration: number;
  progress: number;
  loadPlaylistForEmotion?: (emotion: string) => Promise<MusicPlaylist | null>;
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
  playlist?: MusicPlaylist;
  currentTrack?: MusicTrack;
}

export interface ProgressBarProps {
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
  formatTime?: (time: number) => string;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  showTimestamps?: boolean;
  className?: string;
}

export interface TrackInfoProps {
  title: string;
  artist: string;
  coverUrl: string;
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
  onVolumeChange: (volume: number) => void;
  showLabel?: boolean;
  className?: string;
}

export interface TrackListProps {
  tracks: MusicTrack[];
  onTrackSelect: (track: MusicTrack) => void;
  onPlayPause: (track: MusicTrack) => void;
  currentTrack?: MusicTrack | null;
  isPlaying?: boolean;
  compact?: boolean;
  onPlay?: (track: MusicTrack) => void;
}
