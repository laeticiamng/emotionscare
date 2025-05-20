
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  url: string;
  coverUrl?: string;
  imageUrl?: string;
  duration?: number;
  isPlaying?: boolean;
  genre?: string;
  mood?: string;
  tags?: string[];
  bpm?: number;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description?: string;
  coverUrl?: string;
  imageUrl?: string;
  tracks: MusicTrack[];
  createdAt?: string;
  updatedAt?: string;
  isPublic?: boolean;
  userId?: string;
  author?: string;
  tags?: string[];
  category?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  duration?: number;
  filters?: {
    genre?: string[];
    tempo?: [number, number]; // min, max bpm
    energy?: number; // 0-1
    tags?: string[];
  };
}

export interface MusicContextType {
  currentTrack?: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  currentPlaylist?: MusicPlaylist | null;
  playlists?: MusicPlaylist[];
  playTrack: (track: MusicTrack) => Promise<boolean>;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => Promise<boolean>;
  previousTrack: () => Promise<boolean>;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  seekTo: (time: number) => void;
  loadPlaylist: (playlistId: string) => Promise<MusicPlaylist | null>;
  loadPlaylistForEmotion: (params: EmotionMusicParams) => Promise<MusicPlaylist | null>;
  addToQueue: (track: MusicTrack) => void;
  queue: MusicTrack[];
  clearQueue: () => void;
  shuffle: boolean;
  toggleShuffle: () => void;
  repeat: 'off' | 'one' | 'all';
  toggleRepeat: () => void;
}

export interface MusicSession {
  id: string;
  userId: string;
  playlistId?: string;
  trackIds: string[];
  createdAt: string | Date;
  updatedAt?: string | Date;
  notes?: string;
}
