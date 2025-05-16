
import { ReactNode } from 'react';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number; // en secondes
  url: string;
  coverUrl?: string;
  category?: string;
  tags?: string[];
  mood?: string;
  isFavorite?: boolean;
  playCount?: number;
  audioUrl?: string; // alias de url pour compatibilité
  cover?: string; // alias de coverUrl pour compatibilité
  cover_url?: string; // alias de coverUrl pour compatibilité
  coverImage?: string; // alias de coverUrl pour compatibilité
  track_url?: string; // alias de url pour compatibilité
  emotion?: string; // Permet de lier une piste à une émotion
}

export interface MusicPlaylist {
  id: string;
  title: string;
  name?: string;
  description?: string;
  coverUrl?: string;
  tracks: MusicTrack[];
}

export type MusicMood = 'calm' | 'happy' | 'sad' | 'energetic' | 'focused';

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  duration: number;
  currentTime: number;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  muted: boolean;
  playlist: MusicTrack[];
  playlists?: MusicPlaylist[];
  setOpenDrawer: (open: boolean) => void;
  pauseTrack: () => void;
  isInitialized: boolean;
  initializeMusicSystem: () => void;
  currentEmotion?: string;
  error?: Error;
}

export interface ProgressBarProps {
  position: number;
  max: number;
  onChange: (value: number) => void;
  onSeek?: (time: number) => void;
  currentTime?: number;
  duration?: number;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  duration?: number;
  tempo?: number;
  mode?: 'major' | 'minor';
}
