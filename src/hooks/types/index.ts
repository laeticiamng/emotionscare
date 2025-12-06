// @ts-nocheck

// Types centralisés pour les hooks

import { AudioTrack, AudioPlaylist } from '@/types/audio';
import { EmotionResult } from '@/types/emotion';

// Types pour les hooks d'audio
export interface UseAudioProps {
  toast?: boolean;
}

// Types pour le hook d'émotion
export interface UseEmotionProps {
  userId?: string;
  initialEmotion?: string;
}

export interface UseEmotionReturn {
  currentEmotion: string | null;
  emotionHistory: EmotionResult[];
  emotionStats: Record<string, number>;
  recordEmotion: (emotion: string, intensity?: number) => void;
  isLoading: boolean;
  error: Error | null;
}

// Types pour le hook de playlist
export interface UsePlaylistManagerProps {
  initialPlaylist?: AudioPlaylist | null;
}

export interface UsePlaylistManagerReturn {
  currentPlaylist: AudioPlaylist | null;
  loadPlaylist: (playlistId: string) => Promise<AudioPlaylist | null>;
  createPlaylist: (name: string, tracks?: AudioTrack[]) => AudioPlaylist;
  addTrackToPlaylist: (track: AudioTrack) => void;
  removeTrackFromPlaylist: (trackId: string) => void;
  reorderPlaylist: (startIndex: number, endIndex: number) => void;
  isLoading: boolean;
  error: Error | null;
}
