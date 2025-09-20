import { test, expect } from '@playwright/test';

const loadScoringModule = async () => {
  return await import('../../src/lib/assess/scoring');
};

test.describe('Assess submit qualitative feedback', () => {
  test('STAI-6 elevated answers yield calming summary text', async () => {
    const { computeLevel, scoreToJson } = await loadScoringModule();
    const answers = { '1': 1, '2': 4, '3': 4, '4': 1, '5': 4, '6': 4 };

    const level = computeLevel('STAI6', answers);
    const payload = scoreToJson('STAI6', level);

    expect(level).toBeGreaterThanOrEqual(3);
    expect(payload.summary).toBe('besoin d’apaisement');
    expect(payload.summary).not.toMatch(/\d/);
  });

  test('SUDS calm answer keeps summary free of numbers', async () => {
    const { computeLevel, scoreToJson } = await loadScoringModule();
    const answers = { '1': 1 };

    const level = computeLevel('SUDS', answers);
    const payload = scoreToJson('SUDS', level);

    expect(level).toBe(0);
    expect(payload.summary).toBe('grande tranquillité');
    expect(payload.summary).not.toMatch(/\d/);
  });
});
