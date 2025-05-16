
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  duration?: number;
  track_url: string;
  cover_url?: string;
  mood?: string;
  genre?: string;
  tempo?: number;
  intensity?: number;
  created_at?: string;
  emotion_target?: string;
  coverUrl?: string; // For compatibility
  url?: string; // For compatibility
  cover?: string; // For compatibility
  audioUrl?: string; // For compatibility
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  cover_url?: string;
  coverUrl?: string; // For compatibility
  tracks: MusicTrack[];
  emotion_target?: string;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
  category?: string;
  title?: string; // For compatibility
  emotion?: string; // For compatibility
}

export interface MusicContextType {
  playlists: MusicPlaylist[];
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  queue: MusicTrack[];
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlayPause: () => void;
  togglePlay: () => void; // For compatibility
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  seekTo: (time: number) => void;
  openDrawer: (playlist?: MusicPlaylist) => void;
  setOpenDrawer: (open: boolean) => void;
  loadPlaylist: (playlistId: string) => Promise<void>;
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null>;
  generateMusic?: (params: any) => Promise<void>;
  isGenerating?: boolean;
  getEmotionMusicParams?: (emotion: string) => any;
}

export interface MusicDrawerProps {
  open?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  currentTrack?: MusicTrack | null;
  playlist?: MusicPlaylist | null;
  children?: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

export interface Track {
  id: string;
  name: string;
  artist: string;
  src: string;
}

export interface ProgressBarProps {
  progress?: number;
  value?: number;
  max?: number;
  currentTime?: number;
  duration?: number;
  onSeek?: (value: number) => void;
  onChange?: (value: number) => void;
  className?: string;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
}

export interface TrackInfoProps {
  track: MusicTrack;
}

export interface VolumeControlProps {
  volume?: number;
  onChange?: (value: number) => void;
  onVolumeChange?: (value: number) => void;
  className?: string;
  showLabel?: boolean;
  isMuted?: boolean;
  onMuteToggle?: () => void;
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  showIcon?: boolean;
}

export interface MusicLibraryProps {
  playlists?: MusicPlaylist[];
  onSelectTrack?: (track: MusicTrack) => void;
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  tempo?: 'slow' | 'medium' | 'fast';
  instrument?: string;
  duration?: number;
}
