
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  duration: number;
  url?: string;
  audioUrl?: string;
  coverUrl?: string;
  cover_url?: string;
  cover?: string;
  track_url?: string;
  emotionalTone?: string;
  mood?: string;
  tags?: string[];
  isFavorited?: boolean;
  playCount?: number;
  energy?: number;
  bpm?: number;
  genre?: string;
}

export interface MusicPlaylist {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  cover_url?: string;
  category?: string;
  mood?: string;
  isPublic?: boolean;
  createdBy?: string;
  createdAt?: string;
}

export interface MusicContextType {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  playlists: MusicPlaylist[];
  currentPlaylist: MusicPlaylist | null;
  togglePlay: () => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  isMuted: boolean;
  duration: number;
  currentTime: number;
  seekTo: (time: number) => void;
  queue: MusicTrack[];
  addToQueue: (track: MusicTrack) => void;
  clearQueue: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  isShuffled: boolean;
  isRepeating: boolean;
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  setEmotion: (emotion: string) => void;
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null>;
  currentEmotion?: string | null;
}

export interface MusicDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isOpen?: boolean;
  onClose?: () => void;
  playlist?: MusicPlaylist | null;
  currentTrack?: MusicTrack | null;
  children?: React.ReactNode;
  side?: 'left' | 'right';
}

export interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
  onToggleFavorite?: (trackId: string) => void;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek?: (position: number) => void;
  className?: string;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
}

export interface VolumeControlProps {
  volume: number;
  onChange?: (volume: number) => void;
  isMuted?: boolean;
  onMuteToggle?: () => void;
  className?: string;
  showLabel?: boolean;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}
