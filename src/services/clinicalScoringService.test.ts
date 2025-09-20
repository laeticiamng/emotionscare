import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { clinicalScoringService } from './clinicalScoringService';

describe('clinicalScoringService.calculate', () => {
  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(new Date('2025-03-01T12:00:00.000Z').getTime());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('computes WHO-5 total scores and returns positive summary with hints', () => {
    const computation = clinicalScoringService.calculate(
      'WHO5',
      { '1': 5, '2': 5, '3': 5, '4': 5, '5': 5 },
      'fr',
    );

    expect(computation.level).toBe(4);
    expect(computation.summary).toBe('énergie rayonnante');
    expect(computation.hints).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ action: 'encourage_movement', context: 'activity_suggestions' }),
      ]),
    );
  });

  it('handles STAI-6 reversed items and clamps answers before scoring', () => {
    const computation = clinicalScoringService.calculate(
      'STAI6',
      { '1': -10, '2': 4, '3': 4, '4': 0, '5': 4, '6': 4 },
      'fr',
    );

    expect(computation.level).toBe(4);
    expect(computation.summary).toBe('besoin d’apaisement');
    expect(computation.hints[0]).toEqual(expect.objectContaining({ action: 'extend_grounding' }));
  });

  it('derives PANAS balance using subscales', () => {
    const answers: Record<string, number> = {};
    for (let i = 1; i <= 5; i += 1) {
      answers[String(i)] = 5;
    }
    for (let i = 6; i <= 10; i += 1) {
      answers[String(i)] = 1;
    }

    const computation = clinicalScoringService.calculate('PANAS', answers, 'fr');

    expect(computation.level).toBe(4);
    expect(computation.summary).toBe('éclat vibrant');
    expect(computation.hints).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ action: 'invite_creativity' }),
      ]),
    );
  });
});

