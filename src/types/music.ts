
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url: string;
  coverImage?: string;
  emotion?: string;
  tags?: string[];
  cover?: string;
  coverUrl?: string;
  audioUrl?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  coverImage?: string;
  emotion?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface MusicContextType {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  playlist: MusicTrack[];
  progress: number;
  duration: number;
  volume: number;
  isOpen: boolean;
  openDrawer?: boolean;
  error?: string | null;
  currentEmotion?: string;
  playlists?: MusicPlaylist[];
  currentPlaylist?: MusicPlaylist;
  setOpenDrawer: (open: boolean) => void;
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null>;
  loadPlaylistById?: (id: string) => Promise<void>;
  play: (track?: MusicTrack) => void;
  playTrack: (track: MusicTrack) => void;
  pause: () => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  previousTrack: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  setVolume: (value: number) => void;
  seek: (time: number) => void;
  initializeMusicSystem?: () => Promise<void>;
}

export interface MusicRecommendationCardProps {
  emotion?: string;
  intensity?: number;
  standalone?: boolean;
}
