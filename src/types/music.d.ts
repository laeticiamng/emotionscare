
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  duration?: number;
  track_url: string;
  cover_url?: string;
  mood?: string;
  genre?: string;
  tempo?: number;
  intensity?: number;
  created_at?: string;
  emotion_target?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  cover_url?: string;
  tracks: MusicTrack[];
  emotion_target?: string;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
}

export interface MusicContextType {
  playlists: MusicPlaylist[];
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  queue: MusicTrack[];
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  seekTo: (time: number) => void;
  openDrawer: (playlist?: MusicPlaylist) => void;
  setOpenDrawer: (open: boolean) => void;
  loadPlaylist: (playlistId: string) => Promise<void>;
  generateMusic: (params: any) => Promise<void>;
  isGenerating: boolean;
}

export interface MusicDrawerProps {
  children?: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  currentTrack?: MusicTrack | null;
  playlist?: MusicPlaylist | null;
}

export interface Track {
  id: string;
  name: string;
  artist: string;
  src: string;
}

export interface ProgressBarProps {
  value?: number;
  max?: number;
  currentTime?: number;
  duration?: number;
  onSeek?: (value: number) => void;
  className?: string;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
}

export interface TrackInfoProps {
  track: MusicTrack;
}

export interface VolumeControlProps {
  volume?: number;
  onChange?: (value: number) => void;
  onVolumeChange?: (value: number) => void;
  className?: string;
  showLabel?: boolean;
  isMuted?: boolean;
  onMuteToggle?: () => void;
}

export interface MusicLibraryProps {
  playlists?: MusicPlaylist[];
  onSelectTrack?: (track: MusicTrack) => void;
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
}
