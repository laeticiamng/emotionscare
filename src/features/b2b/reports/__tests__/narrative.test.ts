import { describe, expect, it } from 'vitest';
import { generateMonthlyNarrative } from '../narrative';
import type { AggregateSummary } from '@/services/b2b/reportsApi';

const baseSummary = (text: string, overrides: Partial<AggregateSummary> = {}): AggregateSummary => ({
  instrument: 'WEMWBS',
  period: '2024-03',
  text,
  team: undefined,
  action: undefined,
  ...overrides,
});

describe('generateMonthlyNarrative', () => {
  it('derives a posed tone with positive helpers', () => {
    const narrative = generateMonthlyNarrative([
      baseSummary('• Coopération apaisée • Soutien spontané entre équipes'),
      baseSummary('• Enthousiasme partagé autour des rituels'),
    ]);

    expect(narrative.tone).toBe('posee');
    expect(narrative.helpers.length).toBeGreaterThan(0);
    expect(narrative.helpers[0]).not.toMatch(/\d/);
    expect(narrative.actions.length).toBeGreaterThan(0);
  });

  it('highlights cautions and actions for tense periods', () => {
    const narrative = generateMonthlyNarrative([
      baseSummary('• Fatigue diffuse • Stress discret sur la charge'),
      baseSummary('• Quelques tensions partagées malgré l’écoute'),
    ]);

    expect(narrative.tone).toBe('tendue');
    expect(narrative.signals.length).toBeGreaterThan(0);
    expect(narrative.actions.length).toBeLessThanOrEqual(2);
    narrative.actions.forEach(action => {
      expect(action).not.toMatch(/\d/);
    });
  });

  it('falls back to default content when summaries are empty', () => {
    const narrative = generateMonthlyNarrative([baseSummary('')]);

    expect(narrative.helpers.length).toBeGreaterThan(0);
    expect(narrative.actions.length).toBeGreaterThan(0);
    expect(narrative.signals.length).toBeGreaterThan(0);
  });
});
