
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url?: string;
  audioUrl: string;
  track_url?: string;
  coverUrl?: string;
  coverImage?: string;
  cover?: string;
  src?: string;
  emotion?: string;
  intensity?: number;
  category?: string;
  album?: string;
  year?: number;
  genre?: string;
  name?: string;
  tags?: string[];
  mood?: string; // Pour la compatibilité avec certains composants
}

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  description?: string;
  coverImage?: string;
  createdBy?: string;
  createdAt?: string;
  isPublic?: boolean;
  tags?: string[];
  title?: string;
  emotion?: string;
  mood?: string;
  coverUrl?: string;
  cover?: string;
}

export interface MusicContextType {
  // États
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  playlists?: MusicPlaylist[];
  isPlaying: boolean;
  volume: number;
  isInitialized: boolean;
  muted: boolean;
  currentTime: number;
  duration: number;
  emotion: string | null;
  openDrawer: boolean;
  isRepeating?: boolean;
  isShuffled?: boolean;
  queue?: MusicTrack[];
  error?: Error | null;

  // Actions de base
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  setMute: (muted: boolean) => void;
  toggleMute?: () => void;
  
  // Gestion de playlist
  setPlaylist: (playlist: MusicPlaylist | MusicTrack[]) => void;
  setCurrentTrack: (track: MusicTrack) => void;
  loadPlaylistForEmotion: (emotion: string | EmotionMusicParams) => Promise<MusicPlaylist | null>;
  getRecommendationByEmotion: (emotion: string | EmotionMusicParams) => Promise<MusicPlaylist | MusicTrack[]>;
  
  // UI
  setOpenDrawer: (open: boolean) => void;
  toggleDrawer?: () => void;
  closeDrawer?: () => void;
  
  // Features avancées
  generateMusic?: (prompt: string) => Promise<MusicTrack | null>;
  toggleRepeat?: () => void;
  toggleShuffle?: () => void;
  addToQueue?: (track: MusicTrack) => void;
  clearQueue?: () => void;
  findTracksByMood?: (mood: string) => MusicTrack[];
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  filters?: {
    tempo?: 'slow' | 'medium' | 'fast';
    genre?: string;
    instrumental?: boolean;
  };
}

// Types additionnels pour les composants
export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  progress?: number;
}

export interface VolumeControlProps {
  volume: number;
  muted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
}
