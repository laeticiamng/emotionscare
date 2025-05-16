
// Music types
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  audioUrl?: string;
  coverUrl: string;
  cover_url?: string;
  album?: string;
  track_url?: string;
  mood?: string;
  genre?: string;
  emotionalTone?: string;
  coverImage?: string;
  category?: string;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  name?: string;
  coverUrl?: string;
  cover_url?: string;
  description?: string;
  tracks: MusicTrack[];
  mood?: string;
  emotion?: string;
  category?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  duration?: number;
}

export interface MusicContextType {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  playlists: MusicPlaylist[];
  currentPlaylist: MusicPlaylist | null;
  playlist?: MusicPlaylist | null;
  togglePlay?: () => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  isMuted: boolean;
  duration: number;
  currentTime: number;
  seekTo: (time: number) => void;
  queue?: MusicTrack[];
  addToQueue?: (track: MusicTrack) => void;
  clearQueue?: () => void;
  toggleShuffle?: () => void;
  toggleRepeat?: () => void;
  isShuffled?: boolean;
  isRepeating?: boolean;
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  setEmotion: (emotion: string) => void;
  loadPlaylistForEmotion: (emotion: string | EmotionMusicParams) => Promise<MusicPlaylist | null>;
  currentEmotion: string | null;
  progress?: number;
  error?: Error | null;
  muted?: boolean;
  resumeTrack?: () => void;
  loadTrack?: (track: MusicTrack) => void;
  adjustVolume?: (increment: boolean) => void;
  setPlaylist?: (playlist: MusicPlaylist) => void;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  formatTime: (seconds: number) => string;
  onSeek: (value: number) => void;
  max?: number;
}
