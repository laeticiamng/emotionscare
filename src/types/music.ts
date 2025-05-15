
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverUrl: string;
  cover?: string; // For backward compatibility
  cover_url?: string; // For backward compatibility
  audioUrl?: string; // For backward compatibility
  emotion?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string; // For backward compatibility
  emotion?: string;
  tracks: MusicTrack[];
  coverUrl?: string; // Added for components expecting this
  description?: string;
  category?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  isPlaying: boolean;
  play: (track: MusicTrack) => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  setPlaylist: (playlist: MusicPlaylist) => void;
  togglePlay: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  progress: number;
  duration: number;
  // Add additional functions used by components
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  loadPlaylistForEmotion?: (emotion: string) => Promise<MusicPlaylist | null>;
}

export interface MusicDrawerProps {
  isOpen?: boolean;
  open?: boolean; // For backward compatibility
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  playlist?: MusicPlaylist;
  currentTrack?: MusicTrack;
}

export interface TrackInfoProps {
  track?: MusicTrack;
  title?: string;
  artist?: string;
  coverUrl?: string;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: MusicTrack;
  loadingTrack?: boolean;
  audioError?: string | null;
  className?: string;
  compact?: boolean;
}

export interface ProgressBarProps {
  value: number;
  max: number;
  onChange?: (value: number) => void;
}

export interface VolumeControlProps {
  volume: number;
  onChange: (value: number) => void;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity: number;
}
