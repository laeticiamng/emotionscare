
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string; // Required
  duration: number;
  cover?: string;
  coverUrl?: string;
  cover_url?: string;
  emotion?: string;
  emotion_tag?: string;
  audio_url?: string;
  audioUrl?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description: string;
  tracks: MusicTrack[];
  coverUrl: string; // Required
  category?: string;
  emotion?: string; // Support for emotion
}

export interface MusicContextType {
  playlists: MusicPlaylist[];
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  loadPlaylist: (id: string) => Promise<MusicPlaylist | null>;
  loadPlaylistForEmotion?: (emotion: string) => Promise<MusicPlaylist | null>;
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
  playlist?: MusicPlaylist | null;
}

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success';
}

// Remove the conflicting exports
