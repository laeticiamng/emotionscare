import { describe, it, expect } from 'vitest';
import { summarizeAssessment, sanitizeAggregateText } from '../functions/_shared/assess.ts';

describe('summarizeAssessment determineLevel', () => {
  it.each([
    [{ '1': 2, '2': 2, '3': 2, '4': 2, '5': 2 }, 0],
    [{ '1': 3, '2': 3, '3': 2, '4': 3, '5': 3 }, 1],
    [{ '1': 4, '2': 4, '3': 3, '4': 4, '5': 3 }, 2],
    [{ '1': 5, '2': 5, '3': 4, '4': 4, '5': 4 }, 3],
    [{ '1': 5, '2': 5, '3': 5, '4': 5, '5': 4 }, 4],
  ])('maps WHO5 responses %j to level %s', (answers, expectedLevel) => {
    const result = summarizeAssessment('WHO5', answers);
    expect(result.level).toBe(expectedLevel);
  });
});

describe('summarizeAssessment reversed items', () => {
  it('correctly inverts STAI-6 reversed items before scoring', () => {
    const answers = { '1': 4, '2': 3, '3': 3, '4': 4, '5': 2, '6': 2 };
    const result = summarizeAssessment('STAI6', answers);

    expect(result.scores.total).toBe(12);
    expect(result.level).toBe(1);
  });
});

describe('sanitizeAggregateText', () => {
  it('removes digits and scoring terminology from aggregate text', () => {
    const raw = 'Score moyen 18/25 (72%) avec niveau 3 points à surveiller.';
    const sanitized = sanitizeAggregateText(raw);

    expect(sanitized).not.toMatch(/\d/);
    expect(sanitized).not.toMatch(/score|niveau|point/i);
    expect(sanitized.startsWith('•')).toBe(true);
    expect(sanitized).toBe('• moyen •/• (•) avec • à surveiller.');
  });
});
