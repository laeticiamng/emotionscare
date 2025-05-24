
// Réexporter les types audio comme types musique pour compatibilité
export type {
  AudioTrack as MusicTrack,
  AudioPlaylist as MusicPlaylist
} from './audio';

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

export interface MusicContextType {
  currentTrack?: AudioTrack | null;
  isPlaying?: boolean;
  playlist?: AudioPlaylist | null;
  tracks?: AudioTrack[];
  playTrack?: (track: AudioTrack) => void;
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
  playlists?: AudioPlaylist[];
  loadPlaylist?: (id: string) => void | Promise<AudioPlaylist | null>;
  loadPlaylistForEmotion?: (params: EmotionMusicParams) => Promise<AudioPlaylist | null>;
  setOpenDrawer?: (open: boolean) => void;
  isOpenDrawer?: boolean;
  play?: (track?: AudioTrack) => void;
  pause?: () => void;
  resume?: () => void;
  togglePlay?: () => void;
  next?: () => void;
  previous?: () => void;
}
