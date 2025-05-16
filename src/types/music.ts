
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  url: string;
  coverUrl?: string;
  audioUrl?: string;
  duration?: number;
  coverImage?: string;
  track_url?: string;
  emotionalTone?: string;
  cover?: string; // Added for VRMusicTrackInfo component
  category?: string;
  mood?: string;
  cover_url?: string;
  intensity?: number;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  muted: boolean; 
  progress: number;
  duration: number;
  currentPlaylist: MusicPlaylist | null;
  currentEmotion: string | null;
  playlist?: MusicPlaylist | null;
  error?: Error | null;
  openDrawer?: boolean;
  setOpenDrawer?: (open: boolean) => void;
  play: (track: MusicTrack) => void;
  playTrack: (track: MusicTrack) => void;
  pause: () => void;
  pauseTrack: () => void;
  resume: () => void;
  stop: () => void;
  next: () => void;
  nextTrack: () => void;
  previous: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  togglePlay: () => void;
  toggleMute: () => void;
  mute: () => void;
  unmute: () => void;
  seekTo: (position: number) => void;
  setPlaylist: (playlist: MusicPlaylist) => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
  setEmotion: (emotion: string | null) => void;
  loadTrack?: (track: MusicTrack) => void;
  resumeTrack?: () => void;
  adjustVolume?: (increment: boolean) => void;
  playlists?: MusicPlaylist[]; // Added to fix MusicLibrary.tsx error
  isInitialized?: boolean; // Added to fix MusicLayout.tsx error
  initializeMusicSystem?: () => void; // Added to fix MusicLayout.tsx error
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onTogglePlay: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  currentTime: number;
  duration: number;
  onSeek: (position: number) => void;
  volume: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
  track?: MusicTrack;
  showVolume?: boolean; // Added for MusicControls.tsx
  size?: 'sm' | 'md' | 'lg'; // Added for MusicControls.tsx
  vertical?: boolean; // Added for MusicControls.tsx
  className?: string; // Added for MusicControls.tsx
}

export interface MusicLibraryProps {
  onTrackSelect?: (track: MusicTrack) => void;
  onSelectTrack?: (track: MusicTrack) => void; // Added for LibraryTab.tsx
  currentTrack?: MusicTrack;
  isPlaying?: boolean;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  tracks?: MusicTrack[];
  playlists?: MusicPlaylist[];
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (value: number) => void;
  progress?: number;
  max?: number;
  className?: string;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
}

export interface VolumeControlProps {
  volume: number;
  onChange?: (value: number) => void;
  onVolumeChange?: (value: number) => void;
  isMuted?: boolean;
  onMuteToggle?: () => void;
  className?: string;
  showLabel?: boolean;
}
