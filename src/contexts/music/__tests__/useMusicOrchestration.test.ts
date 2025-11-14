/**
 * Tests for useMusicOrchestration hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMusicOrchestration } from '../useMusicOrchestration';
import { MusicState } from '../types';
import { musicOrchestrationService } from '@/services/music/orchestration';

// Mock dependencies
vi.mock('@/services/music/orchestration');
vi.mock('@/lib/logger');

describe('useMusicOrchestration', () => {
  let audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  let state: MusicState;
  let dispatch: ReturnType<typeof vi.fn>;
  let setVolume: ReturnType<typeof vi.fn>;
  let mockAudio: Partial<HTMLAudioElement>;

  beforeEach(() => {
    mockAudio = {
      volume: 0.7,
      playbackRate: 1.0,
      play: vi.fn().mockResolvedValue(undefined),
      pause: vi.fn(),
      load: vi.fn(),
    };

    audioRef = {
      current: mockAudio as HTMLAudioElement,
    };

    state = {
      currentTrack: null,
      isPlaying: false,
      isPaused: false,
      volume: 0.7,
      currentTime: 0,
      duration: 0,
      activePreset: {
        id: 'focus',
        label: 'Focus',
        description: 'Concentration',
        texture: 'focused',
        intensity: 'medium',
        volume: 0.6,
        playbackRate: 1.0,
        crossfadeMs: 1800,
        source: 'resume',
        hints: [],
        reason: 'Default preset',
      },
      lastPresetChange: null,
      playlist: [],
      currentPlaylistIndex: 0,
      shuffleMode: false,
      repeatMode: 'none',
      isGenerating: false,
      generationProgress: 0,
      generationError: null,
      playHistory: [],
      favorites: [],
      therapeuticMode: false,
      emotionTarget: null,
      adaptiveVolume: true,
    };

    dispatch = vi.fn();
    setVolume = vi.fn();

    // Mock musicOrchestrationService
    vi.mocked(musicOrchestrationService.getActivePreset).mockReturnValue(state.activePreset);
    vi.mocked(musicOrchestrationService.refreshFromClinicalSignals).mockResolvedValue({
      preset: state.activePreset,
      changed: false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with current preset', async () => {
    const { result } = renderHook(() =>
      useMusicOrchestration(audioRef, state, dispatch, setVolume)
    );

    expect(result.current).toBeDefined();
    expect(musicOrchestrationService.getActivePreset).toHaveBeenCalled();
  });

  it('should apply preset profile immediately when requested', () => {
    const { result } = renderHook(() =>
      useMusicOrchestration(audioRef, state, dispatch, setVolume)
    );

    const newPreset = {
      ...state.activePreset,
      id: 'bright' as const,
      volume: 0.8,
      playbackRate: 1.05,
    };

    result.current.applyPresetProfile(newPreset, { immediate: true });

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_ACTIVE_PRESET',
      payload: expect.objectContaining({
        preset: newPreset,
      }),
    });

    expect(setVolume).toHaveBeenCalledWith(0.8);
  });

  it('should apply crossfade when preset changes during playback', () => {
    vi.useFakeTimers();

    const playingState = { ...state, isPlaying: true };

    const { result } = renderHook(() =>
      useMusicOrchestration(audioRef, playingState, dispatch, setVolume)
    );

    const newPreset = {
      ...state.activePreset,
      volume: 0.5,
      crossfadeMs: 1000,
    };

    result.current.applyPresetProfile(newPreset);

    // Should start crossfade animation
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'SET_ACTIVE_PRESET',
      })
    );

    vi.useRealTimers();
  });

  it('should handle mood update events', async () => {
    renderHook(() =>
      useMusicOrchestration(audioRef, state, dispatch, setVolume)
    );

    const moodEvent = new CustomEvent('mood.updated', {
      detail: {
        valence: 80,
        arousal: 60,
        timestamp: new Date().toISOString(),
      },
    });

    const updatedPreset = {
      ...state.activePreset,
      id: 'bright' as const,
    };

    vi.mocked(musicOrchestrationService.handleMoodUpdate).mockReturnValue({
      preset: updatedPreset,
      changed: true,
    });

    window.dispatchEvent(moodEvent);

    // Wait for event handling
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(musicOrchestrationService.handleMoodUpdate).toHaveBeenCalledWith({
      valence: 80,
      arousal: 60,
      timestamp: expect.any(String),
    });
  });

  it('should clamp valence and arousal values', async () => {
    renderHook(() =>
      useMusicOrchestration(audioRef, state, dispatch, setVolume)
    );

    // Test values outside range
    const moodEvent = new CustomEvent('mood.updated', {
      detail: {
        valence: 150, // > 100
        arousal: -20, // < 0
      },
    });

    window.dispatchEvent(moodEvent);

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(musicOrchestrationService.handleMoodUpdate).toHaveBeenCalledWith({
      valence: 100, // clamped to max
      arousal: 0,   // clamped to min
      timestamp: expect.any(String),
    });
  });

  it('should set playbackRate on audio element', () => {
    const { result } = renderHook(() =>
      useMusicOrchestration(audioRef, state, dispatch, setVolume)
    );

    const newPreset = {
      ...state.activePreset,
      playbackRate: 1.2,
    };

    result.current.applyPresetProfile(newPreset, { immediate: true });

    expect(mockAudio.playbackRate).toBe(1.2);
  });

  it('should handle audio ref being null', () => {
    const nullAudioRef = { current: null };

    const { result } = renderHook(() =>
      useMusicOrchestration(nullAudioRef, state, dispatch, setVolume)
    );

    const newPreset = {
      ...state.activePreset,
      volume: 0.5,
    };

    // Should not throw
    expect(() => {
      result.current.applyPresetProfile(newPreset, { immediate: true });
    }).not.toThrow();

    expect(setVolume).toHaveBeenCalledWith(0.5);
  });

  it('should cleanup on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useMusicOrchestration(audioRef, state, dispatch, setVolume)
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mood.updated',
      expect.any(Function)
    );
  });
});
