import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { describe, expect, it } from 'vitest';

import {
  getToneFromLevel,
  getPrimaryCtaFromLevel,
  getCardOrderFromLevel,
  isWho5Due,
} from '../useWho5Orchestration';

dayjs.extend(isoWeek);

describe('WHO-5 orchestration mapping', () => {
  it('maps level to tone consistently', () => {
    expect(getToneFromLevel(0)).toBe('very_low');
    expect(getToneFromLevel(1)).toBe('low');
    expect(getToneFromLevel(2)).toBe('neutral');
    expect(getToneFromLevel(3)).toBe('high');
    expect(getToneFromLevel(4)).toBe('very_high');
    expect(getToneFromLevel(99)).toBe('very_high');
  });

  it('maps level to primary CTA', () => {
    expect(getPrimaryCtaFromLevel(0)).toBe('breath_soft');
    expect(getPrimaryCtaFromLevel(1)).toBe('nyvee_calm');
    expect(getPrimaryCtaFromLevel(2)).toBe('scan');
    expect(getPrimaryCtaFromLevel(3)).toBe('music_soft');
    expect(getPrimaryCtaFromLevel(4)).toBe('coach_micro');
  });

  it('orders cards according to tone', () => {
    expect(getCardOrderFromLevel(0)[0]).toBe('card-nyvee');
    expect(getCardOrderFromLevel(2)[0]).toBe('card-scan');
    expect(getCardOrderFromLevel(4)[0]).toBe('card-coach');
  });
});

describe('WHO-5 due computation', () => {
  const reference = dayjs('2024-05-15T10:00:00.000Z');

  const baseInput = {
    snoozedUntil: null as string | null,
    hasConsent: true,
    isFlagEnabled: true,
    canDisplay: true,
    zeroNumbersReady: true,
    now: reference,
  };

  it('does not trigger when same ISO week already recorded', () => {
    const lastCompletedAt = reference.toISOString();
    expect(
      isWho5Due({
        ...baseInput,
        lastCompletedAt,
      }),
    ).toBe(false);
  });

  it('triggers when previous week', () => {
    const lastCompletedAt = reference.subtract(1, 'week').toISOString();
    expect(
      isWho5Due({
        ...baseInput,
        lastCompletedAt,
      }),
    ).toBe(true);
  });

  it('respects snooze period', () => {
    const snoozedUntil = reference.add(2, 'hour').toISOString();
    expect(
      isWho5Due({
        ...baseInput,
        lastCompletedAt: undefined,
        snoozedUntil,
      }),
    ).toBe(false);
  });

  it('requires consent and flags', () => {
    expect(
      isWho5Due({
        ...baseInput,
        hasConsent: false,
      }),
    ).toBe(false);
    expect(
      isWho5Due({
        ...baseInput,
        isFlagEnabled: false,
      }),
    ).toBe(false);
    expect(
      isWho5Due({
        ...baseInput,
        zeroNumbersReady: false,
      }),
    ).toBe(false);
  });
});
