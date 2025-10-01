// @ts-nocheck
import { describe, expect, it } from 'vitest';
import { getCycleDuration, getTotalDuration, makeProtocol } from '../protocols';

describe('makeProtocol', () => {
  it('builds a 4-7-8 protocol with exact duration', () => {
    const minutes = 3;
    const steps = makeProtocol('478', minutes);
    const total = getTotalDuration(steps);
    expect(total).toBe(minutes * 60_000);
    expect(steps[0]).toEqual({ kind: 'in', ms: 4_000 });
    expect(steps[1]).toEqual({ kind: 'hold', ms: 7_000 });
    expect(steps[2]).toEqual({ kind: 'out', ms: 8_000 });
  });

  it('trims the last step to respect the total duration', () => {
    const steps = makeProtocol('478', { minutes: 3.1 });
    const total = getTotalDuration(steps);
    expect(total).toBe(Math.round(3.1 * 60_000));
    const lastStep = steps[steps.length - 1];
    const cycleDuration = getCycleDuration('478');
    expect(lastStep.ms).toBeLessThanOrEqual(cycleDuration);
  });

  it('supports coherence overrides', () => {
    const steps = makeProtocol('coherence', { minutes: 4, inMs: 4_500, outMs: 5_500 });
    expect(steps[0].ms).toBe(4_500);
    expect(steps[1].ms).toBe(5_500);
    expect(getTotalDuration(steps)).toBe(4 * 60_000);
  });
});
