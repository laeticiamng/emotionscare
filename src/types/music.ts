
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  audioUrl?: string;
  duration: number;
  coverUrl: string;
  coverImage?: string;
  cover_url?: string;
  track_url?: string;
  cover?: string;
  emotionalTone?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  tracks: MusicTrack[];
  coverUrl: string;
  cover_url?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  currentPlaylist?: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration?: number;
  muted?: boolean;
  error?: Error | null;
  isInitialized?: boolean;
  currentEmotion?: string;
  loadTrack: (track: MusicTrack) => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  prevTrack?: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  setProgress?: (progress: number) => void;
  adjustVolume: (increment: boolean) => void;
  seekTo: (time: number) => void;
  togglePlay: () => void;
  togglePlayback?: () => void;
  toggleMute?: () => void;
  setPlaylist: (playlist: MusicPlaylist) => void;
  loadPlaylistForEmotion: (emotion: string | EmotionMusicParams) => Promise<MusicPlaylist | null>;
  setEmotion: (emotion: string) => void;
  openDrawer?: boolean;
  setOpenDrawer?: (open: boolean) => void;
  initializeMusicSystem?: () => void;
  isMuted?: boolean;
}

export interface MusicDrawerProps {
  open?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  playlist?: MusicPlaylist | null;
  currentTrack?: MusicTrack | null;
  children?: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
}

export interface MusicControlsProps {
  track?: MusicTrack | null;
  isPlaying?: boolean;
  togglePlay?: () => void;
  nextTrack?: () => void;
  prevTrack?: () => void;
  volume?: number;
  setVolume?: (volume: number) => void;
  progress?: number;
  duration?: number;
  onSeek?: (position: number) => void;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onTogglePlay?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onVolumeChange?: (volume: number) => void;
  currentTrack?: MusicTrack | null;
  currentTime?: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

export interface Track {
  id: string;
  title: string;
  artist?: string;
  url: string;
  audioUrl?: string;
  coverUrl?: string;
  cover?: string;
  duration?: number;
  emotion?: string;
  intensity?: number;
  category?: string;
}

export interface ProgressBarProps {
  progress: number;
  total: number;
  currentTime?: number;
  duration?: number;
  onSeek: (value: number) => void;
  max?: number;
  className?: string;
  formatTime?: (time: number) => string;
  showTimestamps?: boolean;
}

export interface TrackInfoProps {
  title: string;
  artist: string;
  coverUrl: string;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
  onChange?: (value: number) => void;
  isMuted?: boolean;
  onMuteToggle?: () => void;
  className?: string;
  showLabel?: boolean;
}

export interface MusicLibraryProps {
  onTrackSelect: (track: Track) => void;
  playlists?: MusicPlaylist[];
  onSelectTrack?: (track: MusicTrack) => void;
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}
