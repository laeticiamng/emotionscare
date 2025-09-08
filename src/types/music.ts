
/**
 * @deprecated Ce fichier est remplacé par src/types/index.ts
 * Utilisez les types unifiés depuis src/types/index.ts
 */

// Réexportation pour compatibilité ascendante
export * from './index';

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: MusicTrack[];
  emotion: string;
  mood?: string;
}

// Alias pour compatibilité
export type MusicPlaylist = Playlist;

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

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  preferences?: {
    genre?: string[];
    tempo?: 'slow' | 'medium' | 'fast';
    instrumental?: boolean;
    language?: string;
  };
}
