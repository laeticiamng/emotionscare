import { describe, expect, test } from 'vitest';

import { deriveClinicalHints } from '@/hooks/useClinicalHints';

const baseSignal = {
  id: 'signal-1',
  source_instrument: 'STAI6',
  domain: 'anxiety',
  level: 3,
  module_context: 'nyvee',
  metadata: null,
  created_at: '2025-01-01T00:00:00.000Z',
  expires_at: '2026-01-01T00:00:00.000Z',
} as const;

describe('clinical orchestration hints', () => {
  test('combines low wellbeing and elevated stress into calming hints', () => {
    const snapshot = deriveClinicalHints({
      assessments: {
        WHO5: { summary: 'besoin de réconfort', level: 1, recordedAt: '2025-01-01T00:00:00.000Z' },
        SAM: { summary: 'couleur très douce', level: 1, recordedAt: '2025-01-01T00:00:00.000Z' },
        STAI6: { summary: 'tension présente', level: 3, recordedAt: '2025-01-01T00:00:00.000Z' },
        SUDS: { summary: 'intensité marquée', level: 3, recordedAt: '2025-01-01T00:00:00.000Z' },
        POMS: { summary: 'palette à réchauffer', level: 1, recordedAt: '2025-01-01T00:00:00.000Z' },
      },
      signals: [baseSignal],
      prefersReducedMotion: false,
    });

    expect(snapshot.tone).toBe('delicate');
    expect(snapshot.nextCta).toBe('Respirer 1 min');
    expect(snapshot.fallback2D).toBe(true);
    expect(snapshot.moduleCues.nyvee?.autoGrounding).toBe(true);
    expect(snapshot.moduleCues.scan?.microGesture).toBe('long_exhale');
    expect(snapshot.moduleCues.flashGlow?.extendDuration).toBe(true);
    expect(snapshot.moduleCues.music?.texture).toBe('airy');
  });

  test('celebrates high wellbeing without triggering extensions', () => {
    const snapshot = deriveClinicalHints({
      assessments: {
        WHO5: { summary: 'énergie rayonnante', level: 4, recordedAt: '2025-01-01T00:00:00.000Z' },
        SAM: { summary: 'luminosité vive', level: 4, recordedAt: '2025-01-01T00:00:00.000Z' },
        STAI6: { summary: 'calme profond', level: 0, recordedAt: '2025-01-01T00:00:00.000Z' },
        SUDS: { summary: 'quiétude profonde', level: 0, recordedAt: '2025-01-01T00:00:00.000Z' },
        POMS: { summary: 'éclat vibrant', level: 4, recordedAt: '2025-01-01T00:00:00.000Z' },
      },
      signals: [],
      prefersReducedMotion: false,
    });

    expect(snapshot.tone).toBe('energized');
    expect(snapshot.duration).toBe('short');
    expect(snapshot.moduleCues.flashGlow?.extendDuration).toBe(false);
    expect(snapshot.moduleCues.music?.texture).toBe('bright');
    expect(snapshot.fallback2D).toBe(false);
    expect(snapshot.moduleCues.dashboard?.cta).toBeNull();
  });
});

