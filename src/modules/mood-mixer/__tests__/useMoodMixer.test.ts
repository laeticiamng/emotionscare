import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { getDefaultSliders, useMoodMixer } from '../useMoodMixer';

describe('useMoodMixer', () => {
  it('initialises with default sliders merged with overrides', () => {
    const { result } = renderHook(() => useMoodMixer({ energy: 10 }));
    expect(result.current.sliders.energy).toBe(10);
    expect(result.current.sliders.calm).toBe(getDefaultSliders().calm);
  });

  it('clamps values between 0 and 100 when setting', () => {
    const { result } = renderHook(() => useMoodMixer());

    act(() => result.current.set('energy', 180));
    expect(result.current.sliders.energy).toBe(100);

    act(() => result.current.set('calm', -20));
    expect(result.current.sliders.calm).toBe(0);
  });

  it('merges partial updates safely', () => {
    const { result } = renderHook(() => useMoodMixer());

    act(() => result.current.merge({ focus: 72, light: 33 }));
    expect(result.current.sliders.focus).toBe(72);
    expect(result.current.sliders.light).toBe(33);
  });

  it('resets to defaults and hydrates from preset', () => {
    const { result } = renderHook(() => useMoodMixer());

    act(() => result.current.set('energy', 95));
    act(() => result.current.reset());
    expect(result.current.sliders.energy).toBe(getDefaultSliders().energy);

    act(() => result.current.fromPreset({ energy: 12, calm: 88, focus: 45, light: 76 }));
    expect(result.current.sliders).toEqual({ energy: 12, calm: 88, focus: 45, light: 76 });
  });
});
