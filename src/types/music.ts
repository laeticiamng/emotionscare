
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverUrl: string;
  duration?: number;
  emotion?: string | string[];
  intensity?: number;
  tempo?: number;
  year?: number;
  genre?: string;
  tags?: string[];
  isPlaying?: boolean;
  isFavorite?: boolean;
  category?: string;
  mood?: string;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  emotion?: string;
  description?: string;
  category?: string;
}

export interface MusicState {
  tracks: MusicTrack[];
  playlists: MusicPlaylist[];
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  position: number;
  duration: number;
  loading: boolean;
  error: string | null;
}

export interface MusicPlayerProps {
  track?: MusicTrack;
  playlist?: MusicPlaylist;
  autoplay?: boolean;
  controls?: boolean;
  showVisualization?: boolean;
  visualizationType?: 'bars' | 'wave' | 'circle';
  size?: 'small' | 'medium' | 'large' | 'mini';
  onTrackEnd?: () => void;
  onError?: (error: string) => void;
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
  currentTrack?: MusicTrack | null;
  playlist?: MusicPlaylist;
  children?: React.ReactNode;
}

export interface ProgressBarProps {
  value: number;
  max: number;
  currentTime?: number;
  duration?: number;
  showLabel?: boolean;
  className?: string;
  variant?: 'default' | 'slim' | 'accent';
  onChange?: (value: number) => void;
  showTimestamps?: boolean;
  onSeek?: (value: number) => void;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange?: (volume: number) => void;
  isMuted?: boolean;
  onMuteToggle?: () => void;
  size?: 'small' | 'medium' | 'large';
  onChange?: (value: number) => void;
  showLabel?: boolean;
}

export interface MusicLibraryProps {
  playlists: MusicPlaylist[];
  onSelectPlaylist: (playlist: MusicPlaylist) => void;
  onSelectTrack?: (track: MusicTrack) => void;
}

export interface MusicMixerProps {
  tracks: MusicTrack[];
  onSave?: (mix: MusicTrack) => void;
}

// For music recommendation service
export interface MusicRecommendationParams {
  emotion?: string;
  intensity?: number;
  tempo?: number;
  genre?: string[];
  limit?: number;
}
