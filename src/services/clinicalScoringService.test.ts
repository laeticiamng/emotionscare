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

  it('interprets elevated PSS-10 answers and surfaces load management hints', () => {
    const computation = clinicalScoringService.calculate(
      'PSS10',
      {
        '1': 4,
        '2': 0,
        '3': 0,
        '4': 4,
        '5': 0,
        '6': 4,
        '7': 0,
        '8': 0,
        '9': 4,
        '10': 4,
      },
      'fr',
    );

    expect(computation.level).toBe(4);
    expect(computation.summary).toBe('besoin de relâche');
    expect(computation.hints).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ action: 'limit_notifications' }),
        expect.objectContaining({ action: 'prioritize_rest' }),
      ]),
    );
  });

  it('flags low WEMWBS totals and invites supportive actions', () => {
    const answers = Object.fromEntries(
      Array.from({ length: 14 }, (_, index) => [String(index + 1), 1]),
    );

    const computation = clinicalScoringService.calculate('WEMWBS', answers, 'fr');

    expect(computation.level).toBe(0);
    expect(computation.summary).toBe('élan à raviver');
    expect(computation.hints).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ action: 'offer_support_circle' }),
      ]),
    );
  });

  it('handles CBI reversed items and escalates when exhaustion peaks', () => {
    const computation = clinicalScoringService.calculate(
      'CBI',
      {
        '1': 5,
        '2': 5,
        '3': 5,
        '4': 5,
        '5': 5,
        '6': 0,
      },
      'fr',
    );

    expect(computation.level).toBe(4);
    expect(computation.summary).toBe('besoin de recharge');
    expect(computation.hints).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ action: 'notify_coach' }),
        expect.objectContaining({ action: 'protect_calendar' }),
      ]),
    );
  });
});

