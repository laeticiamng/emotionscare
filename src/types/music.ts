
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  src?: string;          // URL audio pour la compatibilité
  track_url?: string;    // URL audio pour le nouveau format
  duration?: number;
  cover_url?: string;
  genre?: string;
  emotion?: string;
  tempo?: number;
  mood?: string;
  created_at?: string;
  is_premium?: boolean;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: MusicTrack[];
  coverImage?: string;   // Pour la compatibilité avec le code existant
  cover_url?: string;    // Format standardisé
  created_at?: string;
  updated_at?: string;
  emotion?: string;
  tags?: string[];       // Pour la compatibilité avec le code existant
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  repeat: boolean;
  shuffle: boolean;
  queue: MusicTrack[];
  history: MusicTrack[];
  playlists: MusicPlaylist[];
  currentPlaylist: MusicPlaylist | null;
  play: (track?: MusicTrack) => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  addToQueue: (track: MusicTrack) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  setCurrentPlaylist: (playlist: MusicPlaylist | null) => void;
  addToPlaylist: (playlistId: string, track: MusicTrack) => void;
  createPlaylist: (name: string, tracks?: MusicTrack[]) => MusicPlaylist;
  deletePlaylist: (id: string) => void;
  playPlaylist: (playlist: MusicPlaylist, shuffleOnPlay?: boolean) => void;
  setCurrentTrack: (track: MusicTrack | null) => void;
  findTrack: (id: string) => MusicTrack | undefined;
  findPlaylist: (id: string) => MusicPlaylist | undefined;
}

export interface MusicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ProgressBarProps {
  value: number;
  max: number;
  onChange?: (value: number) => void;
  className?: string;
}

export interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
  className?: string;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleRepeat?: () => void;
  onToggleShuffle?: () => void;
  repeat?: boolean;
  shuffle?: boolean;
  className?: string;
}

export interface MusicLibraryProps {
  playlists: MusicPlaylist[];
  currentPlaylist: MusicPlaylist | null;
  onSelectPlaylist: (playlist: MusicPlaylist) => void;
  onCreatePlaylist?: () => void;
  className?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  tempo?: 'slow' | 'medium' | 'fast';
  genre?: string;
}

export interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
}
