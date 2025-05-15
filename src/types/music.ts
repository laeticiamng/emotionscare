
// Types liés à la musique
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url?: string;
  audioUrl?: string;
  audio_url?: string; // Pour compatibilité
  coverUrl?: string;
  cover_url?: string; // Pour compatibilité
  cover?: string; // Pour compatibilité
  genre?: string;
  mood?: string;
  isPlaying?: boolean;
  category?: string;
}

// Alias pour compatibilité
export type Track = MusicTrack;

export interface MusicPlaylist {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  cover_url?: string; // Pour compatibilité
  tracks: MusicTrack[];
  emotion?: string;
  category?: string; // Ajouté car utilisé dans certains composants
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
  toggleMute: () => void;
  isMuted: boolean;
  queue: MusicTrack[];
  addToQueue: (track: MusicTrack) => void;
  clearQueue: () => void;
  loadPlaylistForEmotion?: (emotion: string) => Promise<MusicPlaylist | null>;
  currentTime?: number;
  duration?: number;
  seek?: (time: number) => void;
}

export interface MusicDrawerProps {
  open?: boolean;
  onClose?: () => void;
  trackToPlay?: MusicTrack;
  initialPlaylist?: MusicPlaylist;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  formatTime: (seconds: number) => string;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  value: number; // Ajout de la propriété manquante
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

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}
