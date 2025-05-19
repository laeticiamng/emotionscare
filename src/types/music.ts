
/**
 * Types partagés pour le module de musique
 */

// Interface de base pour une piste musicale
export interface MusicTrack {
  id: string;
  title: string;
  name?: string;
  artist?: string;
  duration?: number;
  coverUrl?: string;
  audioUrl?: string;
  url?: string;
  cover?: string;
  src?: string;
  track_url?: string;
  coverImage?: string;
  mood?: string[];
  emotion?: string;
  genre?: string;
  category?: string;
  isLiked?: boolean;
  album?: string;
  intensity?: number;
  year?: number;
  tags?: string[];
}

// Interface pour une playlist musicale
export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description?: string;
  coverUrl?: string;
  cover?: string;
  coverImage?: string;
  tracks: MusicTrack[];
  mood?: string;
  emotion?: string;
  isCustom?: boolean;
  tags?: string[];
}

// Interface pour les paramètres de music par émotion
export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  duration?: number;
  tempo?: number;
}

// Interface pour les paramètres du player musical
export interface MusicPlayerProps {
  track: MusicTrack | null;
  autoPlay?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onEnded?: () => void;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  className?: string;
}

// Interface pour la barre de progression
export interface ProgressBarProps {
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  formatTime?: (seconds: number) => string;
}

// Interface pour le contrôle du volume
export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMuted?: boolean;
  onMuteToggle?: () => void;
  className?: string;
}

// Interface pour les préférences musicales de l'utilisateur
export interface MusicPreferences {
  volume: number;
  autoplay: boolean;
  crossfade: boolean;
  equalizer: {
    bass: number;
    mid: number;
    treble: number;
  };
  favorites: string[];
}

// Interface pour une session musicale
export interface MusicSession {
  id: string;
  startTime: string;
  endTime?: string;
  tracks: string[];
  totalDuration: number;
  emotion?: string;
  feedback?: number;
}

// Interface pour les paramètres d'humeur musicale
export interface MusicMood {
  name: string;
  description: string;
  color: string;
  icon: string;
  intensity: number;
  bpm: number[];
}

// Interface pour le contexte de musique
export interface MusicContextType {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  isInitialized: boolean;
  togglePlay: () => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  playlists: MusicPlaylist[];
  currentPlaylist: MusicPlaylist | null;
  loadPlaylistForEmotion: (params: string | EmotionMusicParams) => Promise<MusicPlaylist | null>;
  queue: MusicTrack[];
  addToQueue: (track: MusicTrack) => void;
  clearQueue: () => void;
  loadPlaylist: (playlist: MusicPlaylist) => void;
  shufflePlaylist: () => void;
  setOpenDrawer: (open: boolean) => void;
  openDrawer: boolean;
  error: Error | null;
  seekTo: (time: number) => void;
  isShuffled: boolean;
  isRepeating: boolean;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  duration: number;
  currentTime: number;
  getRecommendationByEmotion: (params: string | EmotionMusicParams) => Promise<MusicPlaylist | null>;
  setPlaylist: (playlist: MusicPlaylist) => void;
  setCurrentTrack: (track: MusicTrack) => void;
  findTracksByMood: (mood: string) => MusicTrack[];
  toggleDrawer: () => void;
  toggleMute: () => void;
  muted: boolean;
  generateMusic: (params: any) => Promise<MusicTrack | MusicPlaylist | null>;
  setEmotion: (emotion: string) => void;
  playlist: MusicPlaylist | null;
}

// Interface du type Track utilisée dans les composants existants
export interface Track {
  id: string;
  title: string;
  name?: string;
  artist?: string;
  url: string;
  cover?: string;
  audioUrl?: string;
  duration?: number;
}

// Interface du type Playlist utilisée dans les composants existants
export interface Playlist {
  id: string;
  name: string;
  title?: string;
  tracks: Track[];
}
