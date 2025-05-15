
// Types liés à la musique
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
  coverUrl?: string;
  cover_url?: string; // Added for backward compatibility
  audioUrl?: string;
  audio_url?: string; // Added for backward compatibility
  emotion?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  emotion?: string;
  tracks: MusicTrack[];
  title?: string;
  description?: string;
  coverUrl?: string; // Add the missing property
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface TrackInfoProps {
  track?: MusicTrack;
  currentTrack?: MusicTrack;
  title?: string;
  artist?: string;
  coverUrl?: string;
  showCover?: boolean;
  showControls?: boolean;
  loadingTrack?: boolean;
  audioError?: Error | null;
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
  onVolumeChange: (volume: number) => void;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlayback: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  loadPlaylistForEmotion?: (emotion: string) => Promise<MusicPlaylist | null>;
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
  isOpen?: boolean; // Added for backward compatibility
  onOpenChange?: (open: boolean) => void; // Added for backward compatibility
  playlist?: MusicPlaylist;
  currentTrack?: MusicTrack;
}
