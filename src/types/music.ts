
export interface MusicTrack {
  id: string;
  name?: string;
  title?: string;
  artist?: string;
  duration?: number;
  cover?: string;
  audioUrl?: string; 
  src?: string; // For compatibility with existing code
  url?: string; // For compatibility with existing code
  genre?: string;
  mood?: string;
  bpm?: number;
  tags?: string[];
  created_at?: string;
  user_id?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description?: string;
  cover?: string;
  tracks: MusicTrack[];
  mood?: string;
  tags?: string[];
  created_at?: string;
  user_id?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity: number;
}

export interface MusicContextType {
  isInitialized: boolean;
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  volume: number;
  duration: number;
  playlist: MusicPlaylist | null;
  currentTime: number;
  muted: boolean;
  emotion: string | null;
  openDrawer: boolean;
  setVolume: (volume: number) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  prevTrack: () => void;
  seekTo: (time: number) => void;
  toggleMute: () => void;
  setCurrentTrack: (track: MusicTrack) => void;
  setPlaylist: (playlist: MusicPlaylist) => void;
  getRecommendationByEmotion: (params: EmotionMusicParams | string) => Promise<MusicPlaylist>;
  setOpenDrawer: (open: boolean) => void;
  generateMusic: (prompt: string) => Promise<MusicTrack | null>;
}

export interface MusicDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  playlist?: MusicPlaylist | null;
  currentTrack?: MusicTrack | null;
  side?: "left" | "right" | "top" | "bottom";
  children?: React.ReactNode;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export interface VolumeControlProps {
  volume: number;
  muted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export interface MusicLibraryProps {
  playlists: MusicPlaylist[];
  onSelectPlaylist: (playlist: MusicPlaylist) => void;
}

export interface TrackInfoProps {
  track: MusicTrack;
}
