/**
 * Music Context Types - State management uniquement
 * MusicTrack/MusicPlaylist importés depuis @/types/music.ts
 */

import type { MusicTrack, MusicPlaylist } from '@/types/music';

export type { MusicTrack, MusicPlaylist };

export type MusicOrchestrationPresetId = 'ambient_soft' | 'focus' | 'bright';

export interface MusicOrchestrationPreset {
  id: MusicOrchestrationPresetId;
  label: string;
  description: string;
  texture: 'soft' | 'focused' | 'radiant';
  intensity: 'low' | 'medium' | 'high';
  volume: number;
  playbackRate: number;
  crossfadeMs: number;
  source: 'resume' | 'clinical' | 'mood';
  hints: string[];
  reason: string;
}

export interface MusicState {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  isPaused: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  activePreset: MusicOrchestrationPreset;
  lastPresetChange: string | null;
  playlist: MusicTrack[];
  currentPlaylistIndex: number;
  shuffleMode: boolean;
  repeatMode: 'none' | 'one' | 'all';
  isGenerating: boolean;
  generationProgress: number;
  generationError: string | null;
  playHistory: MusicTrack[];
  favorites: string[];
  therapeuticMode: boolean;
  emotionTarget: string | null;
  adaptiveVolume: boolean;
}

export type MusicAction =
  | { type: 'SET_CURRENT_TRACK'; payload: MusicTrack }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_PAUSED'; payload: boolean }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_ACTIVE_PRESET'; payload: { preset: MusicOrchestrationPreset; timestamp: string } }
  | { type: 'SET_PLAYLIST'; payload: MusicTrack[] }
  | { type: 'SET_PLAYLIST_INDEX'; payload: number }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'SET_REPEAT_MODE'; payload: 'none' | 'one' | 'all' }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_GENERATION_PROGRESS'; payload: number }
  | { type: 'SET_GENERATION_ERROR'; payload: string | null }
  | { type: 'ADD_TO_HISTORY'; payload: MusicTrack }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'SET_THERAPEUTIC_MODE'; payload: boolean }
  | { type: 'SET_EMOTION_TARGET'; payload: string | null }
  | { type: 'SET_ADAPTIVE_VOLUME'; payload: boolean };

export interface MusicContextType {
  state: MusicState;
  play: (track?: MusicTrack) => Promise<void>;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaylist: (tracks: MusicTrack[]) => void;
  addToPlaylist: (track: MusicTrack) => void;
  removeFromPlaylist: (trackId: string) => void;
  shufflePlaylist: () => void;
  generateMusicForEmotion: (emotion: string, prompt?: string) => Promise<MusicTrack | null>;
  checkGenerationStatus: (taskId: string) => Promise<MusicTrack | null>;
  getEmotionMusicDescription: (emotion: string) => string;
  enableTherapeuticMode: (emotion: string) => void;
  disableTherapeuticMode: () => void;
  adaptVolumeToEmotion: (emotion: string, intensity: number) => void;
  toggleFavorite: (trackId: string) => void;
  getRecommendationsForEmotion: (emotion: string) => Promise<MusicTrack[]>;
}
