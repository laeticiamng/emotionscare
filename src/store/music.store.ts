/**
 * MUSIC STORE - Zustand State Management
 * Remplace progressivement MusicContext (Phase 1: Store de base)
 */

import { create } from 'zustand';
import { persist } from './utils/createImmutableStore';
import { createSelectors } from './utils/createSelectors';
import { logger } from '@/lib/logger';
import type { MusicTrack } from '@/types/music';
import { musicOrchestrationService } from '@/services/music/orchestration';

// ============================================================================
// TYPES
// ============================================================================

export interface MusicOrchestrationPreset {
  id: string;
  name?: string;
  description?: string;
}

export interface MusicState {
  // Playback Core
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  isPaused: boolean;
  volume: number; // 0-1
  currentTime: number; // Secondes
  duration: number; // Secondes
  progress: number; // Pourcentage calculé

  // Preset Orchestration
  activePreset: MusicOrchestrationPreset;
  lastPresetChange: string | null;

  // Playlist Management
  playlist: MusicTrack[];
  currentPlaylistIndex: number;
  shuffleMode: boolean;
  repeatMode: 'none' | 'one' | 'all';

  // Generation (Suno AI)
  isGenerating: boolean;
  generationProgress: number;
  generationError: string | null;

  // History & Favorites
  playHistory: MusicTrack[];
  favorites: string[];

  // Therapeutic Mode
  therapeuticMode: boolean;
  emotionTarget: string | null;
  adaptiveVolume: boolean;
}

export interface MusicStore extends MusicState {
  // Playback Core Methods
  setCurrentTrack: (track: MusicTrack | null) => void;
  setPlaying: (playing: boolean) => void;
  setPaused: (paused: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  updateProgress: () => void; // Calculer progress depuis currentTime/duration

  // Preset Methods
  setActivePreset: (preset: MusicOrchestrationPreset) => void;

  // Playlist Methods
  setPlaylist: (tracks: MusicTrack[]) => void;
  addToPlaylist: (track: MusicTrack) => void;
  removeFromPlaylist: (trackId: string) => void;
  setPlaylistIndex: (index: number) => void;
  toggleShuffle: () => void;
  setRepeatMode: (mode: 'none' | 'one' | 'all') => void;

  // Generation Methods
  setGenerating: (generating: boolean) => void;
  setGenerationProgress: (progress: number) => void;
  setGenerationError: (error: string | null) => void;

  // History & Favorites
  addToHistory: (track: MusicTrack) => void;
  toggleFavorite: (trackId: string) => void;

  // Therapeutic Mode
  setTherapeuticMode: (enabled: boolean) => void;
  setEmotionTarget: (emotion: string | null) => void;
  setAdaptiveVolume: (enabled: boolean) => void;

  // Reset
  reset: () => void;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialPreset: MusicOrchestrationPreset = musicOrchestrationService.getActivePreset();

const getInitialState = (): MusicState => ({
  // Playback Core
  currentTrack: null,
  isPlaying: false,
  isPaused: false,
  volume: 0.7,
  currentTime: 0,
  duration: 0,
  progress: 0,

  // Preset
  activePreset: initialPreset,
  lastPresetChange: null,

  // Playlist
  playlist: [],
  currentPlaylistIndex: 0,
  shuffleMode: false,
  repeatMode: 'none',

  // Generation
  isGenerating: false,
  generationProgress: 0,
  generationError: null,

  // History & Favorites
  playHistory: [],
  favorites: [],

  // Therapeutic
  therapeuticMode: false,
  emotionTarget: null,
  adaptiveVolume: true,
});

// ============================================================================
// STORE CREATION
// ============================================================================

const musicStoreBase = create<MusicStore>()(
  persist(
    (set, get) => ({
      ...getInitialState(),

      // ========================================================================
      // PLAYBACK CORE METHODS
      // ========================================================================

      setCurrentTrack: (track) => {
        set({ currentTrack: track });

        // Add to history if playing a new track
        if (track) {
          get().addToHistory(track);
        }

        logger.info('Track changed', { trackId: track?.id, title: track?.title }, 'MUSIC');
      },

      setPlaying: (playing) => {
        set({ isPlaying: playing, isPaused: !playing });
        logger.info(playing ? 'Playback started' : 'Playback stopped', {}, 'MUSIC');
      },

      setPaused: (paused) => {
        set({ isPaused: paused, isPlaying: !paused });
      },

      setVolume: (volume) => {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        set({ volume: clampedVolume });
      },

      setCurrentTime: (time) => {
        set({ currentTime: time });
        get().updateProgress();
      },

      setDuration: (duration) => {
        set({ duration });
        get().updateProgress();
      },

      updateProgress: () => {
        const { currentTime, duration } = get();
        const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
        set({ progress: Math.min(100, Math.max(0, progress)) });
      },

      // ========================================================================
      // PRESET METHODS
      // ========================================================================

      setActivePreset: (preset) => {
        set({
          activePreset: preset,
          lastPresetChange: new Date().toISOString(),
        });
        logger.info('Preset changed', { presetId: preset.id }, 'MUSIC');
      },

      // ========================================================================
      // PLAYLIST METHODS
      // ========================================================================

      setPlaylist: (tracks) => {
        set({ playlist: tracks, currentPlaylistIndex: 0 });
        logger.info('Playlist updated', { trackCount: tracks.length }, 'MUSIC');
      },

      addToPlaylist: (track) => {
        set((state) => ({
          playlist: [...state.playlist, track],
        }));
      },

      removeFromPlaylist: (trackId) => {
        set((state) => ({
          playlist: state.playlist.filter((t) => t.id !== trackId),
        }));
      },

      setPlaylistIndex: (index) => {
        const { playlist } = get();
        const clampedIndex = Math.max(0, Math.min(index, playlist.length - 1));
        set({ currentPlaylistIndex: clampedIndex });
      },

      toggleShuffle: () => {
        set((state) => ({ shuffleMode: !state.shuffleMode }));
      },

      setRepeatMode: (mode) => {
        set({ repeatMode: mode });
      },

      // ========================================================================
      // GENERATION METHODS
      // ========================================================================

      setGenerating: (generating) => {
        set({ isGenerating: generating });
        if (!generating) {
          set({ generationProgress: 0 });
        }
      },

      setGenerationProgress: (progress) => {
        set({ generationProgress: Math.max(0, Math.min(100, progress)) });
      },

      setGenerationError: (error) => {
        set({ generationError: error });
        if (error) {
          logger.error('Music generation error', new Error(error), 'MUSIC');
        }
      },

      // ========================================================================
      // HISTORY & FAVORITES
      // ========================================================================

      addToHistory: (track) => {
        set((state) => ({
          playHistory: [track, ...state.playHistory.slice(0, 49)], // Keep last 50
        }));
      },

      toggleFavorite: (trackId) => {
        set((state) => ({
          favorites: state.favorites.includes(trackId)
            ? state.favorites.filter((id) => id !== trackId)
            : [...state.favorites, trackId],
        }));
      },

      // ========================================================================
      // THERAPEUTIC MODE
      // ========================================================================

      setTherapeuticMode: (enabled) => {
        set({ therapeuticMode: enabled });
        if (!enabled) {
          set({ emotionTarget: null });
        }
      },

      setEmotionTarget: (emotion) => {
        set({ emotionTarget: emotion });
        if (emotion) {
          set({ therapeuticMode: true });
        }
      },

      setAdaptiveVolume: (enabled) => {
        set({ adaptiveVolume: enabled });
      },

      // ========================================================================
      // RESET
      // ========================================================================

      reset: () => {
        set(getInitialState());
        logger.info('Music store reset', {}, 'MUSIC');
      },
    }),
    {
      name: 'emotions-care-music',
      version: 1,
      // Only persist non-transient state
      partialize: (state) => ({
        volume: state.volume,
        shuffleMode: state.shuffleMode,
        repeatMode: state.repeatMode,
        favorites: state.favorites,
        therapeuticMode: state.therapeuticMode,
        emotionTarget: state.emotionTarget,
        adaptiveVolume: state.adaptiveVolume,
        activePreset: state.activePreset,
        // Don't persist: currentTrack, playlist, playHistory, generation state
      }),
    }
  )
);

// ============================================================================
// EXPORTS
// ============================================================================

export const useMusicStore = createSelectors(musicStoreBase);

// Export base store for direct access if needed
export { musicStoreBase };
