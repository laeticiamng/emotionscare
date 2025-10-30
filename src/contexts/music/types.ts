/**
 * Music Context Types - EmotionsCare
 * Types centralisés pour le système musical
 */

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  audioUrl: string;
  duration: number;
  emotion?: string;
  mood?: string;
  coverUrl?: string;
  tags?: string;
  isGenerated?: boolean;
  generatedAt?: string;
  sunoTaskId?: string;
  bpm?: number;
  key?: string;
  energy?: number;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  description?: string;
  tags?: string[];
  creator?: string;
  isTherapeutic?: boolean;
  targetEmotion?: string;
  duration?: number;
  coverUrl?: string;
}

export interface MusicOrchestrationPreset {
  id: string;
  name?: string;
  description?: string;
}

export interface MusicState {
  // Playback
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  isPaused: boolean;
  volume: number;
  currentTime: number;
  duration: number;

  // Orchestration preset
  activePreset: MusicOrchestrationPreset;
  lastPresetChange: string | null;
  
  // Playlist
  playlist: MusicTrack[];
  currentPlaylistIndex: number;
  shuffleMode: boolean;
  repeatMode: 'none' | 'one' | 'all';
  
  // Generation
  isGenerating: boolean;
  generationProgress: number;
  generationError: string | null;
  
  // History
  playHistory: MusicTrack[];
  favorites: string[];
  
  // Therapeutic
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
  
  // Playback controls
  play: (track?: MusicTrack) => Promise<void>;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  
  // Playlist management
  setPlaylist: (tracks: MusicTrack[]) => void;
  addToPlaylist: (track: MusicTrack) => void;
  removeFromPlaylist: (trackId: string) => void;
  shufflePlaylist: () => void;
  
  // Generation Suno
  generateMusicForEmotion: (emotion: string, prompt?: string) => Promise<MusicTrack | null>;
  checkGenerationStatus: (taskId: string) => Promise<MusicTrack | null>;
  getEmotionMusicDescription: (emotion: string) => string;
  
  // Therapeutic features
  enableTherapeuticMode: (emotion: string) => void;
  disableTherapeuticMode: () => void;
  adaptVolumeToEmotion: (emotion: string, intensity: number) => void;
  
  // Utilities
  toggleFavorite: (trackId: string) => void;
  getRecommendationsForEmotion: (emotion: string) => Promise<MusicTrack[]>;
}
