import { describe, expect, it } from 'vitest';

import {
  inferBucketFromText,
  summarizeCBI,
  summarizeUWES,
  summarizeWEMWBS,
} from '@/lib/b2b/reporting';

const NO_NUMBER_REGEX = /^.*$/;

function expectNoDigits(text: string) {
  expect(text).toMatch(NO_NUMBER_REGEX);
  expect(/\d/.test(text)).toBe(false);
}

describe('summaries — textual rendering', () => {
  it('produces a soft wording for WEMWBS buckets', () => {
    expectNoDigits(summarizeWEMWBS('high'));
    expectNoDigits(summarizeWEMWBS('mid'));
    expectNoDigits(summarizeWEMWBS('low'));
    expectNoDigits(summarizeWEMWBS('unknown'));
  });

  it('produces fatigue-aware narratives for CBI', () => {
    expect(summarizeCBI('high')).toContain('Fatigue');
    expectNoDigits(summarizeCBI('mid'));
    expectNoDigits(summarizeCBI('low'));
  });

  it('keeps UWES framing motivational without scores', () => {
    const high = summarizeUWES('high');
    expect(high.toLowerCase()).toContain("envie d'avancer");
    expectNoDigits(high);
    expectNoDigits(summarizeUWES('mid'));
    expectNoDigits(summarizeUWES('unknown'));
  });

  it('infers buckets from narrative snippets', () => {
    expect(inferBucketFromText('ambiance apaisée')).toBe('high');
    expect(inferBucketFromText('quelques tensions diffuses')).toBe('low');
    expect(inferBucketFromText('situation stable sans excès')).toBe('mid');
    expect(inferBucketFromText('')).toBe('unknown');
  });
});
