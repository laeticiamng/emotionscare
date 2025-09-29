import { describe, expect, it } from 'vitest';

import { computeLevel, scoreToJson, summarize } from '../../src/lib/assess/scoring';

const toAnswers = (values: number[]): Record<string, number> =>
  values.reduce<Record<string, number>>((acc, value, index) => {
    acc[String(index + 1)] = value;
    return acc;
  }, {});

describe('computeLevel', () => {
  it('maps WHO5 totals to expected bands', () => {
    expect(computeLevel('WHO5', toAnswers([0, 0, 1, 1, 2]))).toBe(0);
    expect(computeLevel('WHO5', toAnswers([3, 3, 3, 3, 3]))).toBe(1);
    expect(computeLevel('WHO5', toAnswers([4, 4, 4, 3, 3]))).toBe(2);
    expect(computeLevel('WHO5', toAnswers([5, 5, 5, 4, 4]))).toBe(3);
    expect(computeLevel('WHO5', toAnswers([5, 5, 5, 5, 5]))).toBe(4);
  });

  it('handles STAI6 reversed items correctly', () => {
    const calmAnswers = toAnswers([4, 1, 1, 4, 1, 1]);
    const tenseAnswers = toAnswers([1, 4, 4, 1, 4, 4]);

    expect(computeLevel('STAI6', calmAnswers)).toBe(0);
    expect(computeLevel('STAI6', tenseAnswers)).toBe(4);
  });

  it('maps SAM valence banding', () => {
    expect(computeLevel('SAM', { '1': 2 })).toBe(0);
    expect(computeLevel('SAM', { '1': 3 })).toBe(1);
    expect(computeLevel('SAM', { '1': 5 })).toBe(2);
    expect(computeLevel('SAM', { '1': 7 })).toBe(3);
    expect(computeLevel('SAM', { '1': 9 })).toBe(4);
  });

  it('translates SUDS score to level buckets', () => {
    expect(computeLevel('SUDS', { '1': 0 })).toBe(0);
    expect(computeLevel('SUDS', { '1': 3 })).toBe(1);
    expect(computeLevel('SUDS', { '1': 5 })).toBe(2);
    expect(computeLevel('SUDS', { '1': 7 })).toBe(3);
    expect(computeLevel('SUDS', { '1': 10 })).toBe(4);
  });
});

describe('scoreToJson', () => {
  it('returns text-only summary with metadata', () => {
    const result = scoreToJson('WHO5', 3);
    expect(result).toMatchObject({
      level: 3,
      summary: summarize('WHO5', 3),
      instrument_version: '1.0',
    });
    expect(typeof result.generated_at).toBe('string');
    expect(() => Date.parse(result.generated_at)).not.toThrow();
    expect(result.summary).not.toMatch(/\d/);
  });

  it('provides optional focus hint when available', () => {
    const withFocus = scoreToJson('SUDS', 4);
    expect(withFocus.focus).toBe('distress_support');

    const withoutFocus = scoreToJson('WHO5', 2);
    expect(withoutFocus.focus).toBeUndefined();
  });
});
