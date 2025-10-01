// @ts-nocheck
import { useEffect, useMemo, useState } from 'react';

import { MOOD_UPDATED, type MoodEventDetail } from './mood-bus';

export interface MicroGesture {
  id: 'long_exhale' | 'drop_shoulders' | 'soft_movement' | 'gratitude_prompt';
  label: string;
}

export interface DomPalette {
  hue: number;
  saturation: number;
  lightness: number;
}

const prefersMotion = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export function paletteFor(quadrant: MoodEventDetail['quadrant']): DomPalette {
  switch (quadrant) {
    case 'HVAL_HAROUS':
      return { hue: 35, saturation: 60, lightness: 55 };
    case 'HVAL_LAROUS':
      return { hue: 45, saturation: 35, lightness: 62 };
    case 'LVAL_HAROUS':
      return { hue: 210, saturation: 55, lightness: 48 };
    case 'LVAL_LAROUS':
    default:
      return { hue: 220, saturation: 30, lightness: 58 };
  }
}

export function gesturesFor(detail: MoodEventDetail): MicroGesture[] {
  switch (detail.quadrant) {
    case 'LVAL_HAROUS':
      return [
        { id: 'long_exhale', label: 'expiration longue' },
        { id: 'drop_shoulders', label: 'épaules qui se relâchent' },
      ];
    case 'LVAL_LAROUS':
      return [{ id: 'soft_movement', label: 'petite marche intérieure' }];
    case 'HVAL_HAROUS':
      return [{ id: 'soft_movement', label: 'canaliser l’énergie doucement' }];
    case 'HVAL_LAROUS':
    default:
      return [{ id: 'gratitude_prompt', label: 'pensée chaleureuse' }];
  }
}

export function useSamOrchestration() {
  const [detail, setDetail] = useState<MoodEventDetail | null>(null);
  const [gestures, setGestures] = useState<MicroGesture[]>([]);
  const [palette, setPalette] = useState<DomPalette | null>(null);
  const [motionEnabled, setMotionEnabled] = useState(() => prefersMotion());

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setMotionEnabled(!media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    const root = document.documentElement;
    root.style.setProperty('--mood-transition', motionEnabled ? '220ms ease-out' : '0ms');
  }, [motionEnabled]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    const applyPalette = (next: DomPalette) => {
      root.style.setProperty('--mood-h', String(next.hue));
      root.style.setProperty('--mood-s', `${next.saturation}%`);
      root.style.setProperty('--mood-l', `${next.lightness}%`);
    };

    const handler = (event: Event) => {
      const custom = event as CustomEvent<MoodEventDetail>;
      if (!custom.detail) {
        return;
      }
      const nextPalette = paletteFor(custom.detail.quadrant);
      applyPalette(nextPalette);
      setPalette(nextPalette);
      setDetail(custom.detail);
      setGestures(gesturesFor(custom.detail));
    };

    window.addEventListener(MOOD_UPDATED, handler);
    return () => {
      window.removeEventListener(MOOD_UPDATED, handler);
    };
  }, []);

  return useMemo(
    () => ({
      detail,
      gestures,
      palette,
    }),
    [detail, gestures, palette],
  );
}
