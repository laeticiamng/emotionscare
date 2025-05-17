
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  coverUrl?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description?: string;
  tracks: MusicTrack[];
}

export interface MusicContextType {
  isInitialized: boolean;
  isPlaying: boolean;
  volume: number;
  setVolume: (volume: number) => void;
  playlists: MusicPlaylist[];
  setPlaylists: React.Dispatch<React.SetStateAction<MusicPlaylist[]>>;
  currentPlaylist: MusicPlaylist | null;
  setCurrentPlaylist: React.Dispatch<React.SetStateAction<MusicPlaylist | null>>;
  
  // Propriétés manquantes qui causent des erreurs
  currentTrack: MusicTrack | null;
  currentTime: number;
  duration: number;
  muted: boolean;
  isLoading: boolean;
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  
  // Méthodes manquantes
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  togglePlay: () => void;
  seekTo: (time: number) => void;
  loadPlaylistForEmotion: (emotion: string) => void;
  toggleMute: () => void;
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  muted: boolean;
  onToggleMute: () => void;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  muted: boolean;
  onToggleMute: () => void;
}

export interface MusicLibraryProps {
  playlists: MusicPlaylist[];
  onSelectPlaylist: (playlist: MusicPlaylist) => void;
  currentPlaylist: MusicPlaylist | null;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface TrackInfoProps {
  track: MusicTrack;
}
