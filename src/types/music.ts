
// Types for music functionality
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl?: string;
  audioUrl: string;
  duration?: number;
  category?: string;  // Add this property
  mood?: string;      // Add this property
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  emotion?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  recommendations: MusicTrack[];
  isLoading: boolean;
  error: Error | null;
  initializeMusicSystem: () => Promise<void>;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekToPosition: (position: number) => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams) => Promise<MusicPlaylist | null>;
  setOpenDrawer?: (open: boolean) => void;
}

export interface MusicLibraryProps {
  tracks: MusicTrack[];
  playlists: MusicPlaylist[];
  onTrackSelect: (track: MusicTrack) => void;
  onSelectPlaylist: (playlist: MusicPlaylist) => void;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  currentTime: number;
  duration: number;
  onSeek: (value: number) => void;
  volume: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onVolumeChange: (value: number) => void;
  track: MusicTrack | null;
  showVolume?: boolean;
  size?: 'sm' | 'md' | 'lg';
  vertical?: boolean;
}

export interface MusicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  playlist: MusicPlaylist | null;
  currentTrack: MusicTrack | null;
  children?: React.ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMuted?: boolean;
  onMuteToggle?: () => void;
  showLabel?: boolean;
  onChange?: (volume: number) => void;
  className?: string;
}
