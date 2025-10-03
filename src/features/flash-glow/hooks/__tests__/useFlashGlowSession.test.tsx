import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';

import { useFlashGlowSession } from '../useFlashGlowSession';

declare global {
  // eslint-disable-next-line no-var
  var matchMedia: ((query: string) => MediaQueryList) | undefined;
}

const createMatchMedia = (matches: boolean) =>
  vi.fn().mockImplementation((query: string): MediaQueryList => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

describe('useFlashGlowSession', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMatchMedia(false),
    });
    Object.defineProperty(global.navigator, 'vibrate', {
      writable: true,
      value: vi.fn(),
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('applies runtime tweaks to visuals, breath, audio and haptics', () => {
    const { result } = renderHook(() => useFlashGlowSession());

    act(() => {
      result.current.apply([
        { type: 'set_visuals_intensity', intensity: 'lowered' },
        { type: 'set_breath_pattern', pattern: 'exhale_longer' },
        { type: 'set_audio_fade', profile: 'slow' },
        { type: 'set_haptics', mode: 'off' },
      ]);
    });

    expect(result.current.state.visuals).toBe('lowered');
    expect(result.current.state.breath).toBe('exhale_longer');
    expect(result.current.state.audioFade).toBe('slow');
    expect(result.current.state.haptics).toBe('off');
  });

  it('extends the session and resets after the provided duration', async () => {
    const { result } = renderHook(() => useFlashGlowSession());

    await act(async () => {
      await result.current.extend(1_000);
    });

    expect(result.current.state.extendedMs).toBe(1_000);

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(result.current.state.extendedMs).toBe(0);
  });

  it('performs a soft exit with slow fade and lowered visuals', async () => {
    const { result } = renderHook(() => useFlashGlowSession());

    await act(async () => {
      const pending = result.current.softExit();
      vi.advanceTimersByTime(1_200);
      await pending;
    });

    expect(result.current.state.audioFade).toBe('slow');
    expect(result.current.state.visuals).toBe('lowered');
    expect(result.current.state.haptics).toBe('off');
    expect(document.documentElement.classList.contains('flash-glow-soft-exit')).toBe(false);
  });

  it('forces reduced motion preferences on visuals and haptics', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMatchMedia(true),
    });

    const { result } = renderHook(() => useFlashGlowSession());

    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      result.current.apply([
        { type: 'set_visuals_intensity', intensity: 'medium' },
        { type: 'set_haptics', mode: 'calm' },
      ]);
    });

    expect(result.current.state.visuals).toBe('lowered');
    expect(result.current.state.haptics).toBe('off');
  });
});
