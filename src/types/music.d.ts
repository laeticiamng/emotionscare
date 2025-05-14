
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  audioUrl: string;
  audio_url?: string; // Added for backward compatibility
  coverUrl: string;
  cover?: string; // Added for backward compatibility
  cover_url?: string; // Added for backward compatibility
  emotion?: string;
}

export interface Track extends MusicTrack {
  // Additional properties if needed
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title: string; 
  description?: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  category?: string;
  emotion?: string; 
}

export interface MusicContextType {
  // Player state
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  volume: number;
  progress: number;
  duration: number;
  
  // Playback controls
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  togglePlay: () => void;
  adjustVolume: (change: number) => void;
  
  // Playlist management
  playlists: MusicPlaylist[];
  currentPlaylist: MusicPlaylist | null;
  loadPlaylistById: (id: string) => Promise<MusicPlaylist | null>;
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null>;
  
  // UI state
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  
  // Utility
  formatTime: (seconds: number) => string;
  
  // System state
  isInitialized: boolean;
  initializeMusicSystem: () => Promise<void>;
  error: string | null;
  
  // Additional properties
  isShuffled: boolean;
  isRepeating: boolean;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  currentEmotion: string | null;
  isMuted: boolean;
  toggleMute: () => void;
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
  playlist?: MusicPlaylist;
  currentTrack?: MusicTrack;
}

export interface ProgressBarProps {
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
  formatTime?: (time: number) => string;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  showTimestamps?: boolean;
  className?: string;
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
  onChange: (volume: number) => void;
  onVolumeChange?: (volume: number) => void;
  showLabel?: boolean;
  className?: string;
}

export interface TrackListProps {
  tracks: MusicTrack[];
  onTrackSelect: (track: MusicTrack) => void;
  onPlayPause?: (track: MusicTrack) => void;
  currentTrack?: MusicTrack | null;
  isPlaying?: boolean;
  compact?: boolean;
  showEmotionTag?: boolean;
  onPlay?: (track: MusicTrack) => void;
}
