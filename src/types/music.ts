
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  genre?: string;
  cover?: string;
  coverUrl?: string;
  url: string;
  audioUrl?: string;
  duration: number;
  emotion?: string;
  isLiked?: boolean;
  name?: string;
  mood?: string;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  name?: string;
  description?: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  emotion?: string;
  isPublic?: boolean;
  userId?: string;
  category?: string;
  author?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  currentTime: number;
  duration: number;
  progress?: number;
  currentPlaylist: MusicPlaylist | null;
  playlists: MusicPlaylist[];
  // Player control methods
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  toggleMute: () => void;
  // Playlist management
  addToPlaylist: (trackId: string, playlistId: string) => void;
  removeFromPlaylist: (trackId: string, playlistId: string) => void;
  createPlaylist: (name: string, tracks?: MusicTrack[]) => void;
  // Emotion-based playback
  playEmotion: (emotion: string) => void;
  
  // Additional properties used throughout the application
  // UI state
  error?: string | null;
  isInitialized?: boolean;
  openDrawer?: boolean;
  setOpenDrawer?: (isOpen: boolean) => void;
  toggleDrawer?: () => void;
  
  // Alternative method names (for backwards compatibility)
  play?: (track: MusicTrack, playlist?: MusicPlaylist) => void;
  pause?: () => void;
  resume?: () => void;
  next?: () => void;
  previous?: () => void;
  prevTrack?: () => void;
  
  // Playlist handling
  playlist?: MusicPlaylist | null;
  setPlaylist?: (playlist: MusicPlaylist) => void;
  setCurrentTrack?: (track: MusicTrack) => void;
  playPlaylist?: (playlist: MusicPlaylist) => void;
  
  // Emotion/Mood related
  setEmotion?: (emotion: string) => void;
  loadPlaylistForEmotion?: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
  getRecommendationByEmotion?: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
  generateMusic?: (params: any) => Promise<MusicPlaylist | null>;
}

export interface MusicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ProgressBarProps {
  value: number;
  max: number;
  onChange?: (value: number) => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  formatTime?: (seconds: number) => string;
}

export interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
  muted?: boolean;
  onToggleMute?: () => void;
  isMuted?: boolean;
  onVolumeChange?: (value: number) => void;
  onMuteToggle?: () => void;
  className?: string;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onPrevious?: () => void;
  onVolumeChange?: (volume: number) => void;
  volume?: number;
  muted?: boolean;
  onToggleMute?: () => void;
  isRepeating?: boolean;
  isShuffling?: boolean;
  onRepeat?: () => void;
  onShuffle?: () => void;
}

export interface MusicLibraryProps {
  onTrackSelect: (track: MusicTrack) => void;
  tracks?: MusicTrack[];
  onSelect?: (track: MusicTrack) => void;
  currentTrackId?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  tempo?: number;
  intensity?: number;
}

export interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
}

// Additional music-related types
export interface MusicCategory {
  id: string;
  name: string;
  description?: string;
}
