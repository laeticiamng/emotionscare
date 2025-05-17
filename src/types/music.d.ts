
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  url?: string;
  audioUrl?: string;
  track_url?: string;
  coverUrl?: string;
  coverImage?: string;
  cover?: string;
  duration?: number;
  emotion?: string;
  intensity?: number;
  category?: string;
}

export interface MusicPlaylist {
  id: string;
  name?: string;
  title: string; // Make this required
  description?: string;
  emotion?: string;
  tracks: MusicTrack[];
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  muted?: boolean; // Added this property
  currentTime: number;
  duration: number;
  progress?: number; // Make progress optional
  isLoading: boolean;
  error: Error | null;
  emotion: string | null;
  currentEmotion: string | null;
  openDrawer: boolean;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (position: number) => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
  setEmotion: (emotion: string) => void;
  setOpenDrawer: (open: boolean) => void;
  isShuffled?: boolean;
  isRepeating?: boolean;
  toggleShuffle?: () => void;
  toggleRepeat?: () => void;
}

export interface MusicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ProgressBarProps {
  current: number;
  total: number;
  onSeek?: (position: number) => void;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMuted: boolean;
  onMuteToggle: () => void;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showSkipButtons?: boolean;
}

export interface MusicLibraryProps {
  tracks: MusicTrack[];
  playlists: MusicPlaylist[];
  onTrackSelect?: (track: MusicTrack) => void;
  onPlaylistSelect?: (playlist: MusicPlaylist) => void;
  currentTrack: MusicTrack | null;
}

export interface TrackInfoProps {
  title: string;
  artist?: string;
  coverUrl?: string;
}
