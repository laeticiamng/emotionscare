
export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  duration: number;
  url: string;
  coverUrl?: string;
  type?: 'meditation' | 'relaxation' | 'sleep' | 'focus';
  description?: string;
}

export interface AudioPlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  loading: boolean;
  error: string | null;
}

export interface AudioPlayerContextType {
  // État du lecteur
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  progress: number;
  duration: number;
  loading: boolean;
  error: string | null;
  
  // Contrôles de lecture
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  
  // Formatage
  formatTime: (seconds: number) => string;
}
