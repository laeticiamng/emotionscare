
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
}
