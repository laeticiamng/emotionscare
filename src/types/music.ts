
/**
 * MusicContextType
 * --------------------------------------
 * Ce type regroupe TOUTES les propriétés et méthodes exposées par le MusicContext.
 * ⚠️ Toute nouvelle fonctionnalité liée à la musique DOIT être ajoutée ici.
 * Mise à jour : 2025-05-18
 */

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url?: string;
  audioUrl: string;
  coverUrl?: string;
  cover?: string;
  emotion?: string;
  tags?: string[];
  genre?: string;
  year?: number;
  bpm?: number;
  favorited?: boolean;
  playCount?: number;
  explicit?: boolean;
  language?: string;
  mood?: string;
  intensity?: number;
  isLiveRecording?: boolean;
  isInstru?: boolean;
  name?: string; // Added for compatibility
  category?: string; // Added for filtering in MusicTabs
  src?: string; // Alternative URL field
  track_url?: string; // Legacy URL field
  coverImage?: string; // Alternative cover field
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string; // Added for compatibility
  description?: string;
  coverUrl?: string;
  cover?: string; // Added for compatibility
  coverImage?: string; // Alternative cover field
  tracks: MusicTrack[];
  emotion?: string;
  created_at?: string;
  modified_at?: string;
  creator?: string;
  isPublic?: boolean;
  tags?: string[];
  mood?: string;
  category?: string; // Added for compatibility
}

export interface MusicPreset {
  id: string;
  name: string;
  color: string;
  trackIds: string[];
}

export interface MusicPreferences {
  favoriteGenres?: string[];
  dislikedGenres?: string[];
  preferredTempo?: 'slow' | 'medium' | 'fast';
  volume?: number;
}

export interface MusicSession {
  id: string;
  playlist: MusicPlaylist;
  startedAt: string;
  endedAt?: string;
  mood?: string;
}

export interface MusicMood {
  name: string;
  description?: string;
  intensity?: number;
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

export interface MusicContextType {
  // Audio player state
  isInitialized: boolean;
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  volume: number;
  duration: number;
  currentTime: number;
  muted: boolean;
  isMuted?: boolean; // Alias for muted (for compatibility)
  playlist: MusicPlaylist | null;
  playlists?: MusicPlaylist[]; // List of available playlists
  emotion: string | null;
  openDrawer: boolean;
  error?: Error | null;
  isRepeating?: boolean;
  isShuffled?: boolean;
  queue?: MusicTrack[];
  preferences?: MusicPreferences;
  sessions?: MusicSession[];
  progress?: number;
  recommendations?: MusicTrack[]; // For recommended tracks
  isLoading?: boolean; // Loading state for async operations
  
  // Audio player methods
  initializeMusicSystem?: () => Promise<void>;
  setVolume: (volume: number) => void;
  setMute: (muted: boolean) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  togglePlay: () => void;
  togglePlayPause?: () => void; // Alias for togglePlay
  pauseTrack: () => void;
  resumeTrack: () => void;
  playTrack: (track: MusicTrack) => void;
  nextTrack: () => void;
  prevTrack?: () => void; // Alias for previousTrack
  previousTrack: () => void;
  setProgress?: (progress: number) => void;
  
  // UI control
  setOpenDrawer: (open: boolean) => void;
  toggleDrawer?: () => void;
  closeDrawer?: () => void;
  setEmotion: (emotion: string) => void;
  
  // Playlist management
  setPlaylist: (playlist: MusicPlaylist | MusicTrack[]) => void;
  setCurrentTrack: (track: MusicTrack) => void;
  loadPlaylistForEmotion: (emotion: string | EmotionMusicParams) => Promise<MusicPlaylist | null>;
  getRecommendationByEmotion?: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | MusicTrack[]>;
  
  // Advanced features
  generateMusic?: (prompt: string) => Promise<MusicTrack | null>;
  toggleRepeat?: () => void;
  toggleShuffle?: () => void;
  addToQueue?: (track: MusicTrack) => void;
  clearQueue?: () => void;
  findTracksByMood?: (mood: string) => MusicTrack[];
  updatePreferences?: (prefs: Partial<MusicPreferences>) => void;
  startSession?: (playlist: MusicPlaylist) => MusicSession;
  endSession?: (id: string) => void;
}

// UI component props types
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

export interface MusicPlayerProps {
  track?: MusicTrack | null;
  autoPlay?: boolean;
  showControls?: boolean;
  onEnded?: () => void;
  onError?: (error: Error) => void;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  progress?: number;
  minimal?: boolean;
}

export interface MusicDrawerProps {
  open: boolean;
  isOpen?: boolean;
  onClose: () => void;
  currentTrack?: MusicTrack | null;
  recommendations?: MusicTrack[];
  onOpenChange?: (open: boolean) => void;
  playlist?: MusicPlaylist | null;
  children?: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
}
