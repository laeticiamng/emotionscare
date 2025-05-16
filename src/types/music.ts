
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverUrl?: string;
  cover?: string;
  coverImage?: string;
  cover_url?: string;
  emotion?: string;
  audioUrl?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  emotion?: string;
  tracks: MusicTrack[];
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  currentPlaylist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  currentTime: number;
  duration: number;
  isInitialized: boolean;
  openDrawer: boolean;
  emotion: string | null;
  togglePlay: () => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  setOpenDrawer: (isOpen: boolean) => void;
  setEmotion: (emotion: string) => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams) => Promise<MusicPlaylist | null>;
}

export interface MusicDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface ProgressBarProps {
  position: number;
  max: number;
  onChange: (position: number) => void;
  currentTime?: number;
  duration?: number;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
  className?: string;
  onSeek?: (position: number) => void;
}

export interface VolumeControlProps {
  volume: number;
  muted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  className?: string;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  className?: string;
}

export interface MusicLibraryProps {
  tracks?: MusicTrack[];
  onTrackSelect?: (track: MusicTrack) => void;
  className?: string;
}

export interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
  showCover?: boolean;
}
