import { describe, expect, it } from 'vitest';
import { computeMoodDelta, sanitizeMoodScore } from '../mood';

describe('mood utils', () => {
  it('sanitizes mood scores within 0-100', () => {
    expect(sanitizeMoodScore(105)).toBe(100);
    expect(sanitizeMoodScore(-5)).toBe(0);
    expect(sanitizeMoodScore(47.6)).toBe(48);
    expect(sanitizeMoodScore(null)).toBeNull();
  });

  it('computes delta only when both scores exist', () => {
    expect(computeMoodDelta(40, 60)).toBe(20);
    expect(computeMoodDelta(80, 70)).toBe(-10);
    expect(computeMoodDelta(null, 60)).toBeNull();
  });
});
