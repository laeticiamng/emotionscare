
// Basic audio types that will be extended by music types
export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  duration: number;
  url?: string;
  audioUrl?: string;
  coverUrl?: string;
  album?: string;
  year?: number;
  genre?: string;
  emotion?: string;
}

export interface AudioPlaylist {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  tracks: AudioTrack[];
  emotion?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

// Ajout des types manquants pour résoudre les erreurs
export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  currentTrack: AudioTrack | null;
}

export interface AudioContextValue {
  audioRef: React.RefObject<HTMLAudioElement>;
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  currentTime: number;
  duration: number;
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
}

export type { AudioTrack, AudioPlaylist, EmotionMusicParams };
