
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  audioUrl?: string;
  audio_url?: string; // Pour la compatibilité
  coverUrl?: string;
  cover?: string; // Pour la compatibilité
  cover_url?: string; // Pour la compatibilité
  emotion?: string;
  genre?: string;
  album?: string;
}

export interface Track extends MusicTrack {
  // Propriétés additionnelles si nécessaires
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description?: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  category?: string;
  emotion?: string; // Ajouté pour les playlists basées sur les émotions
}

export interface MusicContextType {
  // État du lecteur
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  volume: number;
  progress: number;
  duration: number;
  isMuted?: boolean;
  
  // Contrôles de lecture
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  togglePlay?: () => void;
  adjustVolume?: (change: number) => void;
  toggleMute?: () => void;
  
  // Gestion de playlist
  playlists?: MusicPlaylist[];
  currentPlaylist?: MusicPlaylist | null;
  loadPlaylistById?: (id: string) => Promise<MusicPlaylist | null>;
  loadPlaylistForEmotion?: (emotion: string) => Promise<MusicPlaylist | null>;
  
  // État UI
  openDrawer?: boolean;
  setOpenDrawer?: (open: boolean) => void;
  
  // Utilitaires
  formatTime?: (seconds: number) => string;
  
  // État du système
  isInitialized?: boolean;
  initializeMusicSystem?: () => Promise<void>;
  error?: string | null;
  
  // Propriétés additionnelles
  isShuffled?: boolean;
  isRepeating?: boolean;
  toggleShuffle?: () => void;
  toggleRepeat?: () => void;
  currentEmotion?: string | null;
}

export interface MusicDrawerProps {
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  playlist?: MusicPlaylist;
  initialTrack?: MusicTrack;
  children?: React.ReactNode;
  isOpen?: boolean;
  currentTrack?: MusicTrack;
}

export interface ProgressBarProps {
  duration?: number;
  currentTime?: number;
  onSeek?: (time: number) => void;
  formatTime?: (time: number) => string;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  showTimestamps?: boolean;
  className?: string;
  value?: number;
  max?: number;
  progress?: number;
  variant?: 'default' | 'thin' | 'thick' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
}

export interface TrackInfoProps {
  track?: MusicTrack;
  title?: string;
  artist?: string;
  coverUrl?: string;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: MusicTrack | null;
  loadingTrack?: boolean;
  audioError?: boolean;
  className?: string;
  compact?: boolean;
}

export interface VolumeControlProps {
  volume: number;
  onChange?: (volume: number) => void;
  onVolumeChange?: (volume: number) => void;
  showLabel?: boolean;
  className?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  duration?: number;
  tempo?: 'slow' | 'medium' | 'fast';
}
