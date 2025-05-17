
export interface AudioTrack {
  id: string;
  title: string;
  description?: string;
  artist?: string;
  album?: string;
  duration: number;
  url: string;
  coverImage?: string;
  category?: string;
  mood?: string | string[];
  bpm?: number;
  tags?: string[];
  year?: number;
  isDefaultTrack?: boolean;
  isFavorite?: boolean;
  source?: 'library' | 'spotify' | 'apple_music' | 'generated' | string;
  lastPlayed?: string;
  playCount?: number;
  trackAnalysis?: {
    emotion?: string;
    energy?: number;
    danceability?: number;
    acousticness?: number;
  };
}

export interface AudioPlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  progress: number;
  duration: number;
  playlist: AudioTrack[]; // Ajouté pour corriger les erreurs
  repeatMode: 'off' | 'one' | 'all'; // Ajouté pour corriger les erreurs
  shuffleMode: boolean; // Ajouté pour corriger les erreurs
}

export interface AudioContextValue {
  audioState: AudioPlayerState;
  play: () => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (position: number) => void;
  playTrack: (track: AudioTrack) => void;
  toggleShuffle: () => void;
  changeRepeatMode: () => void;
}
