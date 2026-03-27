// @ts-nocheck
import { useCallback, useState } from 'react';

import type { Sliders } from './types';

const DEFAULT_SLIDERS: Sliders = {
  energy: 40,
  calm: 60,
  focus: 60,
  light: 50,
};

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export function useMoodMixer(initial: Partial<Sliders> = {}) {
  const [sliders, setSliders] = useState<Sliders>({
    ...DEFAULT_SLIDERS,
    ...Object.fromEntries(
      Object.entries(initial).map(([key, value]) => [key, clamp(value as number)])
    ),
  });

  const set = useCallback((key: keyof Sliders, value: number) => {
    setSliders((current) => ({
      ...current,
      [key]: clamp(value),
    }));
  }, []);

  const merge = useCallback((next: Partial<Sliders>) => {
    setSliders((current) => ({
      ...current,
      ...Object.fromEntries(
        Object.entries(next).map(([key, value]) => [key, clamp(value as number)])
      ),
    }));
  }, []);

  const reset = useCallback(() => {
    setSliders(DEFAULT_SLIDERS);
  }, []);

  const fromPreset = useCallback((preset: Sliders) => {
    setSliders({
      energy: clamp(preset.energy),
      calm: clamp(preset.calm),
      focus: clamp(preset.focus),
      light: clamp(preset.light),
    });
  }, []);

  return { sliders, set, merge, reset, fromPreset };
}

export function getDefaultSliders(): Sliders {
  return { ...DEFAULT_SLIDERS };
}
