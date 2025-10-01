// @ts-nocheck
import { describe, expect, it } from 'vitest';

import type { MoodEventDetail } from '../mood-bus';
import { quadrant, summary, toLevel } from '../useMoodPublisher';
import { gesturesFor, paletteFor } from '../useSamOrchestration';

describe('useMoodPublisher helpers', () => {
  it('maps raw values to levels', () => {
    expect(toLevel(0)).toBe(0);
    expect(toLevel(20)).toBe(0);
    expect(toLevel(21)).toBe(1);
    expect(toLevel(40)).toBe(1);
    expect(toLevel(41)).toBe(2);
    expect(toLevel(60)).toBe(2);
    expect(toLevel(61)).toBe(3);
    expect(toLevel(80)).toBe(3);
    expect(toLevel(99)).toBe(4);
  });

  it('resolves quadrants from valence and arousal', () => {
    expect(quadrant(60, 60)).toBe('HVAL_HAROUS');
    expect(quadrant(70, 20)).toBe('HVAL_LAROUS');
    expect(quadrant(30, 70)).toBe('LVAL_HAROUS');
    expect(quadrant(10, 30)).toBe('LVAL_LAROUS');
  });

  it('produces short summaries without digits', () => {
    const cases: Array<[number, number]> = [
      [0, 4],
      [0, 0],
      [4, 4],
      [4, 0],
      [2, 2],
    ];
    cases.forEach(([v, a]) => {
      const text = summary(v, a);
      expect(text).toMatch(/[a-zéèêàûïç ]+/i);
      expect(text).not.toMatch(/\d/);
    });
  });
});

describe('useSamOrchestration helpers', () => {
  const baseDetail: MoodEventDetail = {
    source: 'scan_sliders',
    valence: 50,
    arousal: 50,
    valenceLevel: 2,
    arousalLevel: 2,
    quadrant: 'HVAL_LAROUS',
    summary: 'état mixte',
    ts: '2024-01-01T00:00:00.000Z',
  };

  it('returns palette hues for each quadrant', () => {
    expect(paletteFor('HVAL_HAROUS')).toEqual({ hue: 35, saturation: 60, lightness: 55 });
    expect(paletteFor('HVAL_LAROUS')).toEqual({ hue: 45, saturation: 35, lightness: 62 });
    expect(paletteFor('LVAL_HAROUS')).toEqual({ hue: 210, saturation: 55, lightness: 48 });
    expect(paletteFor('LVAL_LAROUS')).toEqual({ hue: 220, saturation: 30, lightness: 58 });
  });

  it('suggests micro-gestures adapted to each quadrant', () => {
    const gentle = gesturesFor({ ...baseDetail, quadrant: 'LVAL_LAROUS' });
    const tension = gesturesFor({ ...baseDetail, quadrant: 'LVAL_HAROUS' });
    const energy = gesturesFor({ ...baseDetail, quadrant: 'HVAL_HAROUS' });
    const gratitude = gesturesFor({ ...baseDetail, quadrant: 'HVAL_LAROUS' });

    expect(tension.map(gesture => gesture.id)).toEqual(['long_exhale', 'drop_shoulders']);
    expect(gentle.map(gesture => gesture.id)).toEqual(['soft_movement']);
    expect(energy.map(gesture => gesture.id)).toEqual(['soft_movement']);
    expect(gratitude.map(gesture => gesture.id)).toEqual(['gratitude_prompt']);

    [tension, gentle, energy, gratitude].flat().forEach(gesture => {
      expect(gesture.label).not.toMatch(/\d/);
    });
  });
});
