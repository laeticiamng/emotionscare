// @ts-nocheck
import { describe, expect, it } from 'vitest';

import {
  buildMoodVerbalSeries,
  buildSessionVerbalRows,
  describeSessionRhythm,
  describeSessionType,
  describeVibeIntensity,
  getMoodToneColor,
  getVibeColor,
  summarizeMoodVerbalSeries,
} from '../verbalizers';

describe('scores verbalizers', () => {
  it('transforms mood points into verbal series', () => {
    const series = buildMoodVerbalSeries([
      { date: '2024-05-01', valence: 0.5, arousal: 0.2 },
      { date: '2024-05-02', valence: 0.1, arousal: 0.7 },
    ]);

    expect(series).toHaveLength(2);
    expect(['cotonneux', 'calme']).toContain(series[0].toneLabel);
    expect(['actif', 'éveillé']).toContain(series[1].toneLabel);
    expect(getMoodToneColor(series[0].toneId)).toMatch(/^#/);
    expect(summarizeMoodVerbalSeries(series)).toMatch(/Ambiance/);
  });

  it('verbalizes session rows with rhythm and highlights', () => {
    const rows = buildSessionVerbalRows([
      { week: '2024-W20', breath: 1, music: 2 },
      { week: '2024-W21' },
    ]);

    expect(rows[0].highlights).toContain('Musique immersive');
    expect(rows[0].rhythm).toBeTypeOf('string');
    expect(describeSessionRhythm(0)).toContain('pause');
    expect(describeSessionType('flashglow')).toBe('Flash Glow');
  });

  it('returns palette-driven colors for vibes and intensity labels', () => {
    expect(getVibeColor('calm', 'deep')).toBe('#047857');
    expect(getVibeColor(undefined as any, 'medium')).toBe('#d1d5db');
    expect(describeVibeIntensity('light')).toBe('nuance douce');
  });
});

