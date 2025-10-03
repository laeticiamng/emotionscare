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

  it('maps PSS-10 stress into high load with soothing summary', () => {
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
  });

  it('flags elevated experiential avoidance on AAQ-II', () => {
    const answers = Object.fromEntries(Array.from({ length: 7 }, (_, index) => [String(index + 1), 7]));

    const computation = clinicalScoringService.calculate('AAQ2', answers, 'fr');

    expect(computation.level).toBe(4);
    expect(computation.summary).toBe('besoin de relâcher la prise');
  });

  it('captures POMS total mood disturbance signal', () => {
    const answers: Record<string, number> = {};
    for (let i = 1; i <= 20; i += 1) {
      answers[String(i)] = 4;
    }
    for (let i = 21; i <= 24; i += 1) {
      answers[String(i)] = 0;
    }

    const computation = clinicalScoringService.calculate('POMS', answers, 'fr');

    expect(computation.level).toBe(4);
    expect(computation.summary).toBe('humeur en surcharge');
  });

  it('returns flourishing message on WEMWBS high scores', () => {
    const answers = Object.fromEntries(Array.from({ length: 14 }, (_, index) => [String(index + 1), 5]));

    const computation = clinicalScoringService.calculate('WEMWBS', answers, 'fr');

    expect(computation.level).toBe(4);
    expect(computation.summary).toBe('vitalité rayonnante');
  });

  it('handles CBI reversal and detects fatigue saturation', () => {
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

