import { test, expect } from '@playwright/test';

const loadAssessModule = async () => {
  return await import('../../supabase/functions/_shared/assess.ts');
};

test.describe('Clinical adaptation signals', () => {
  test('WHO5 low total suggests gentle dashboard tone', async () => {
    const { summarizeAssessment } = await loadAssessModule();
    const answers = { '1': 1, '2': 1, '3': 2, '4': 2, '5': 1 };
    const result = summarizeAssessment('WHO5', answers);

    expect(result.level).toBe(0);
    expect(result.summary).toContain('douceur');
  });

  test('STAI-6 elevated responses map to high anxiety band', async () => {
    const { summarizeAssessment } = await loadAssessModule();
    const answers = { '1': 1, '2': 4, '3': 4, '4': 1, '5': 4, '6': 4 };
    const result = summarizeAssessment('STAI6', answers);

    expect(result.level).toBeGreaterThanOrEqual(3);
    expect(result.summary).toContain('apaisement');
  });

  test('SUDS peak distress lands in escalation window', async () => {
    const { summarizeAssessment } = await loadAssessModule();
    const answers = { '1': 10 };
    const result = summarizeAssessment('SUDS', answers);

    expect(result.level).toBe(4);
    expect(result.summary).toContain('détresse');
  });

  test('Aggregate summaries presented without numeric leakage', async () => {
    const { sanitizeAggregateText } = await loadAssessModule();
    const sanitized = sanitizeAggregateText('Score moyen 68% (niveau 3) - 12 points.');

    expect(sanitized).not.toMatch(/\d/);
    expect(sanitized).not.toMatch(/score|niveau|points?/i);
  });
});
