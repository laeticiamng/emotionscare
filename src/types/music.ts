
// Types liés à la musique et au player audio
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverUrl?: string;
  cover?: string;  // Pour compatibilité
  cover_url?: string;  // Pour compatibilité
  audioUrl?: string;
  audio_url?: string;  // Pour compatibilité
  emotion?: string;  // Ajouté pour compatibilité avec mockMusic
}

export interface MusicPlaylist {
  id: string;
  title: string;
  name?: string;  // Pour compatibilité
  tracks: MusicTrack[];
  description?: string;
  emotion?: string;
  coverUrl?: string;
  cover?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  loadPlaylistForEmotion?: (emotion: string) => Promise<MusicPlaylist | null>;
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
  isOpen?: boolean;  // Pour compatibilité
  onOpenChange?: (open: boolean) => void;  // Pour compatibilité
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
  audioError?: Error | null;
  className?: string;
  compact?: boolean;
}

export interface ProgressBarProps {
  value: number;
  max?: number;
  currentTime?: number;
  duration?: number;
  formatTime?: (seconds: number) => string;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onChange: (value: number[]) => void;
  onToggleMute: () => void;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

// Ajout pour compatibilité avec d'autres parties du code
export type Track = MusicTrack;
