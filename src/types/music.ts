
// Types liés à la musique et lecteurs audio
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url?: string;
  coverUrl?: string;
  cover_url?: string;
  cover?: string;
  emotion?: string;
  audioUrl?: string;
  audio_url?: string;
}

export interface MusicPlaylist {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  emotion?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  cover_url?: string;
  category?: string;
}

export interface MusicContextType {
  tracks: MusicTrack[];
  playlists: MusicPlaylist[];
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  repeat: 'off' | 'all' | 'one';
  shuffle: boolean;
  loadTrack: (track: MusicTrack) => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  loadPlaylist: (playlist: MusicPlaylist, autoplay?: boolean) => void;
  loadPlaylistForEmotion?: (emotion: string) => Promise<MusicPlaylist | null>;
}

export interface MusicDrawerProps {
  open?: boolean;
  onClose?: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  playlist?: MusicPlaylist;
  currentTrack?: MusicTrack;
}

export interface TrackInfoProps {
  track?: MusicTrack;
  className?: string;
  compact?: boolean;
}

export interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  progress?: number;
  onSeek?: (percentage: number) => void;
  currentTime?: number;
  duration?: number;
  formatTime?: (seconds: number) => string;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  showTimestamps?: boolean;
  onChange?: (value: number) => void;
}

export interface VolumeControlProps {
  volume: number;
  onChange: (value: number) => void;
  className?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
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
