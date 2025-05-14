
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  url: string;
  duration: number;
  emotion?: string;
  // Backwards compatibility
  cover?: string;
  cover_url?: string;
  audio_url?: string;
}

export interface Track extends MusicTrack {
  // Add any additional Track properties
  coverUrl: string;
  // Backward compatibility
  cover_url?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
}

export interface MusicContextType {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  queue: MusicTrack[];
  volume: number;
  progress: number;
  duration: number;
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null>;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
}

export interface MusicDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  playlist?: MusicPlaylist;
}

export interface ProgressBarProps {
  currentTime?: number;
  duration?: number;
  formatTime?: (seconds: number) => string;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  showTimestamps?: boolean;
  className?: string;
}

export interface TrackInfoProps {
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
  volume?: number;
  onChange?: (value: number) => void;
  showLabel?: boolean;
  className?: string;
}

export interface TrackListProps {
  tracks: MusicTrack[];
  onTrackSelect: (track: MusicTrack) => void;
  onPlayPause?: () => void;
  currentTrack?: MusicTrack | null;
  isPlaying?: boolean;
  showEmotionTag?: boolean;
  compact?: boolean;
}
