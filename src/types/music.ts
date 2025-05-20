
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  genre?: string;
  cover?: string;
  coverUrl?: string;
  url: string;
  audioUrl?: string;
  duration: number;
  emotion?: string;
  isLiked?: boolean;
  name?: string;
  mood?: string;
  tags?: string[];
  intensity?: number;
  year?: number;
  category?: string[] | string;
  coverImage?: string;
  track_url?: string;
  src?: string;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  name?: string;
  description?: string;
  coverUrl?: string;
  coverImage?: string;
  tracks: MusicTrack[];
  emotion?: string;
  isPublic?: boolean;
  userId?: string;
  category?: string[] | string;
  author?: string;
  creator?: string;
  tags?: string | string[];
  mood?: string;
  cover?: string;
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
