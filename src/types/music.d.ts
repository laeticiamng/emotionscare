
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  albumTitle?: string;
  coverUrl?: string;
  audioUrl: string;
  duration: number;
  emotion?: string;
  mood?: string;
  intensity?: number;
  year?: number | string;
  tags?: string[] | string;
  category?: string | string[];
}

export interface MusicPlaylist {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  coverImage?: string;
  tracks: MusicTrack[];
  mood?: string;
  emotion?: string;
  category?: string | string[];
  creator?: string;
  src?: string;
}

export type MusicCategory = 'relax' | 'focus' | 'energy' | 'sleep' | 'meditation' | 'mood' | 'custom';

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  currentPlaylist: MusicPlaylist | null;
  playlists: MusicPlaylist[];
  isPlaying: boolean;
  volume: number;
  duration: number;
  muted: boolean;
  currentTime: number;
  isLoading?: boolean;
  error?: string;
  openDrawer?: boolean;
  playlist?: MusicPlaylist | null;
  
  // Playback controls
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  playTrack: (track: MusicTrack) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  previousTrack?: () => void;
  pauseTrack?: () => void;
  resumeTrack?: () => void;
  play?: () => void;
  pause?: () => void;
  resume?: () => void;
  next?: () => void;
  previous?: () => void;
  seekTo?: (time: number) => void;
  toggleDrawer?: () => void;
  setOpenDrawer?: (isOpen: boolean) => void;
  
  // Music management
  loadPlaylistForEmotion?: (emotion: string) => Promise<MusicPlaylist | null>;
  getRecommendationByEmotion?: (emotion: string) => Promise<MusicTrack | null>;
  setEmotion?: (emotion: string) => void;
  generateMusic?: (params: any) => Promise<MusicTrack | null>;
  setPlaylist?: (playlist: MusicPlaylist) => void;
  setCurrentTrack?: (track: MusicTrack) => void;
  playPlaylist?: (playlist: MusicPlaylist) => void;
  toggleRepeat?: () => void;
  toggleShuffle?: () => void;
  isInitialized?: boolean;
}
