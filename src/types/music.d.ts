
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
  // Additional properties for compatibility
  cover?: string;
  coverImage?: string;
  url?: string;
  src?: string;
  track_url?: string;
  name?: string;
  album?: string;
  isLiked?: boolean;
  genre?: string;
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
  // Additional properties for compatibility
  name?: string;
  cover?: string;
  isPublic?: boolean;
  userId?: string;
  author?: string;
  tags?: string[] | string;
}

export type MusicCategory = 'relax' | 'focus' | 'energy' | 'sleep' | 'meditation' | 'mood' | 'custom';

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  duration?: number;
  tempo?: number;
}

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
  loadPlaylistForEmotion?: (params: string | EmotionMusicParams) => Promise<MusicPlaylist | null>;
  getRecommendationByEmotion?: (emotion: string) => Promise<MusicPlaylist | null>;
  setEmotion?: (emotion: string) => void;
  generateMusic?: (params: any) => Promise<MusicPlaylist | null>;
  setPlaylist?: (playlist: MusicPlaylist) => void;
  setCurrentTrack?: (track: MusicTrack) => void;
  playPlaylist?: (playlist: MusicPlaylist) => void;
  toggleRepeat?: () => void;
  toggleShuffle?: () => void;
  isInitialized?: boolean;

  // Additional required methods
  addToPlaylist: (trackId: string, playlistId: string) => void;
  removeFromPlaylist: (trackId: string, playlistId: string) => void;
  createPlaylist: (name: string, tracks?: MusicTrack[]) => void;
  playEmotion: (emotion: string) => void;
}
