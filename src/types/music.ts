
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  duration: number; // en secondes
  url: string;
  coverUrl?: string;
  emotion: string; // calm, happy, energetic, sad, etc.
  genre?: string;
  bpm?: number;
  energy?: number; // 0-1
  valence?: number; // 0-1 (negative to positive)
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: MusicTrack[];
  emotion: string;
  mood?: string;
}

export interface MusicPlayerState {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  playlist: MusicTrack[];
  currentIndex: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
}

export interface AdaptiveMusicConfig {
  enabled: boolean;
  emotionSensitivity: number; // 0-1
  autoTransition: boolean;
  fadeInDuration: number; // en ms
  fadeOutDuration: number; // en ms
  volumeAdjustment: boolean;
}
