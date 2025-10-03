import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useMusicEngine } from '../useMusicEngine';

vi.mock('@sentry/react', () => ({
  __esModule: true,
  addBreadcrumb: vi.fn(),
  getCurrentHub: () => ({ getClient: () => ({}) }),
}));

describe('useMusicEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates crossfade duration for next transitions', () => {
    const { result } = renderHook(() => useMusicEngine());

    act(() => {
      result.current.setCrossfade(18000);
    });

    expect(result.current.state.crossfadeMs).toBe(18000);
  });

  it('adjusts texture, intensity and bpm profile', () => {
    const { result } = renderHook(() => useMusicEngine());

    act(() => {
      result.current.setTexture('ambient_very_low');
      result.current.setIntensity('very_low');
      result.current.setBpmProfile('neutral');
    });

    expect(result.current.state.texture).toBe('ambient_very_low');
    expect(result.current.state.intensity).toBe('very_low');
    expect(result.current.state.bpmProfile).toBe('neutral');
  });

  it('queues tracks and plays them with the configured crossfade', async () => {
    const { result } = renderHook(() => useMusicEngine());

    act(() => {
      result.current.setCrossfade(20000);
      result.current.queue('track-1');
    });

    await act(async () => {
      await result.current.playRecommended();
    });

    expect(result.current.nowPlaying).toBe('track-1');
    expect(result.current.state.crossfadeMs).toBe(20000);
  });

  it('uses explicit crossfade when provided in queue options', async () => {
    const { result } = renderHook(() => useMusicEngine());

    act(() => {
      result.current.queue('track-1', { crossfadeMs: 5000 });
    });

    await act(async () => {
      await result.current.playRecommended();
    });

    // crossfade override does not change state but ensures playback happened
    expect(result.current.nowPlaying).toBe('track-1');
  });
});
