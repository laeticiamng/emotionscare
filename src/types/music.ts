
export type MusicCategory = 'relaxation' | 'focus' | 'energy' | 'sleep' | 'happiness' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'meditation' | 'ambient' | 'nature';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  cover?: string;
  coverUrl?: string;
  coverImage?: string;
  url: string;
  audioUrl?: string;
  src?: string;
  track_url?: string;
  duration?: number;
  mood?: string | string[];
  emotion?: string;
  name?: string;
  category?: MusicCategory | MusicCategory[];
  bpm?: number;
  tags?: string[];
  isPlaying?: boolean;
  genre?: string;
  created_at?: string;
  year?: number;
  intensity?: number;
}

export interface MusicPlaylist {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  cover?: string;
  coverUrl?: string;
  coverImage?: string;
  tracks: MusicTrack[];
  mood?: string | string[];
  emotion?: string;
  category?: MusicCategory | MusicCategory[];
  created_at?: string;
  author?: string;
  source?: string;
  tags?: string[];
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  source?: string;
  genre?: string;
  tempo?: number;
}

export interface MusicContextType {
  // State
  currentTrack: MusicTrack | null;
  currentPlaylist: MusicPlaylist | null;
  playlist: MusicPlaylist | null;
  playlists?: MusicPlaylist[];
  queue: MusicTrack[];
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  currentTime: number;
  duration: number;
  repeat: 'off' | 'track' | 'playlist';
  shuffle: boolean;
  isShuffled?: boolean;
  isRepeating?: boolean;
  openDrawer: boolean;
  isInitialized: boolean;
  error: Error | null;
  
  // Actions
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  previousTrack: () => void;
  nextTrack: () => void;
  setTrack?: (track: MusicTrack) => void;
  setPlaylist?: (playlist: MusicPlaylist) => void;
  setVolume?: (volume: number) => void;
  setMuted?: (muted: boolean) => void;
  seekTo?: (time: number) => void;
  setRepeat?: (mode: 'off' | 'track' | 'playlist') => void;
  toggleShuffle?: () => void;
  toggleRepeat?: () => void;
  togglePlay?: () => void;
  toggleMute?: () => void;
  toggleDrawer?: () => void;
  setOpenDrawer?: (open: boolean) => void;
  loadPlaylistForEmotion?: (emotion: string | EmotionMusicParams) => Promise<MusicPlaylist | null>;
  getRecommendationByEmotion?: (params: string | EmotionMusicParams) => Promise<MusicPlaylist | null>;
  getPlaylistById?: (id: string) => MusicPlaylist | null;
  loadPlaylist?: (playlist: MusicPlaylist) => void;
  clearQueue?: () => void;
  addToQueue?: (track: MusicTrack) => void;
  removeFromQueue?: (trackId: string) => void;
  setCurrentTime?: (time: number) => void;
  setDuration?: (duration: number) => void;
  setIsPlaying?: (isPlaying: boolean) => void;
  setIsInitialized?: (isInitialized: boolean) => void;
  setCurrentTrack?: (track: MusicTrack | null) => void;
  shufflePlaylist?: () => void;
  generateMusic?: (prompt: string) => Promise<MusicTrack>;
  findTracksByMood?: (mood: string) => MusicTrack[];
  setEmotion?: (emotion: string) => void;
}

export interface Track extends MusicTrack {}

export interface MusicProviderProps {
  children: React.ReactNode;
}

// Props types for player components
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
