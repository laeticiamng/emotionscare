
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverUrl?: string;
  cover_url?: string;
  cover?: string;
  audioUrl?: string;
  audio_url?: string;
  emotion?: string;
  category?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  emotion?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  cover_url?: string;
  cover?: string;
  category?: string;
}

export interface MusicContextType {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  playlists: MusicPlaylist[];
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  progress: number;
  loadPlaylistForEmotion?: (emotion: string) => Promise<MusicPlaylist | null>;
  togglePlayPause: () => void;
  duration: number;
  currentTime: number;
  seek: (time: number) => void;
}

export interface MusicDrawerProps {
  isOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  playlist?: MusicPlaylist;
  currentTrack?: MusicTrack;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  genre?: string;
  tempo?: 'slow' | 'medium' | 'fast';
  duration?: number;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
  coverUrl?: string;
  cover_url?: string;
  audioUrl?: string;
  audio_url?: string;
  emotion?: string;
}
