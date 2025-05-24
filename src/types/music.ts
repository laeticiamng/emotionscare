
// Types unifiés pour l'audio et la musique
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  year?: number;
  duration: number;
  url: string;
  audioUrl?: string;
  coverUrl?: string;
  artworkUrl?: string;
  cover?: string;
  description?: string;
  summary?: string;
  category?: string;
  mood?: string;
  emotion?: string;
  tags?: string[];
  source?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  tracks: MusicTrack[];
  description?: string;
  thumbnailUrl?: string;
  coverUrl?: string;
  category?: string;
  emotion?: string;
  mood?: string;
}

// Types pour les paramètres émotionnels
export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  genre?: string;
  tempo?: string;
  duration?: number;
}

export interface MusicGenerationResult {
  id: string;
  url: string | null;
  prompt: string;
  style: string;
  duration: number;
  status: 'generated' | 'processing' | 'error';
}

// Interface principale du contexte musical
export interface MusicContextType {
  currentTrack?: MusicTrack | null;
  isPlaying?: boolean;
  playlist?: MusicPlaylist | null;
  tracks?: MusicTrack[];
  playTrack?: (track: MusicTrack) => void;
  pauseTrack?: () => void;
  resumeTrack?: () => void;
  nextTrack?: () => void;
  prevTrack?: () => void;
  stopTrack?: () => void;
  seekTo?: (time: number) => void;
  setVolume?: (volume: number) => void;
  volume?: number;
  duration?: number;
  currentTime?: number;
  progress?: number;
  playlists?: MusicPlaylist[];
  loadPlaylist?: (id: string) => void | Promise<MusicPlaylist | null>;
  loadPlaylistForEmotion?: (params: EmotionMusicParams) => Promise<MusicPlaylist | null>;
  setOpenDrawer?: (open: boolean) => void;
  isOpenDrawer?: boolean;
  play?: (track?: MusicTrack) => void;
  pause?: () => void;
  resume?: () => void;
  togglePlay?: () => void;
  next?: () => void;
  previous?: () => void;
}

// Réexporter pour compatibilité descendante
export type AudioTrack = MusicTrack;
export type AudioPlaylist = MusicPlaylist;
