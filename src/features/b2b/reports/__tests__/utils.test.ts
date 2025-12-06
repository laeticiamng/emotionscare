import { describe, expect, it } from 'vitest';
import {
  deriveActionSuggestion,
  deriveHeatmapInsight,
  groupCellsByInstrument,
  mapSummariesToCells,
  type HeatmapCellInput,
} from '../utils';

describe('mapSummariesToCells', () => {
  it('filters out entries below confidentiality threshold', () => {
    const input: HeatmapCellInput[] = [
      { instrument: 'WEMWBS', period: '2024-W10', text: 'Tonalité positive', n: 7 },
      { instrument: 'CBI', period: '2024-W10', text: 'Tension à surveiller', n: 4 },
    ];

    const cells = mapSummariesToCells(input);
    expect(cells).toHaveLength(1);
    expect(cells[0]).toMatchObject({ instrument: 'WEMWBS', text: 'Tonalité positive' });
  });

  it('removes empty summaries and trims whitespace', () => {
    const input: HeatmapCellInput[] = [
      { instrument: 'UWES', period: '2024-W11', text: '  Engagement en progression  ', n: 8 },
      { instrument: 'UWES', period: '2024-W11', text: '   ' },
    ];

    const cells = mapSummariesToCells(input);
    expect(cells).toHaveLength(1);
    expect(cells[0].text).toBe('Engagement en progression');
  });
});

describe('deriveActionSuggestion', () => {
  it('returns backend suggestion when provided', () => {
    expect(deriveActionSuggestion('texte', 'action dédiée')).toBe('action dédiée');
  });

  it('maps fatigue keyword to cocon pause recommendation', () => {
    expect(deriveActionSuggestion('Sentiment de fatigue partagé par l’équipe')).toBe('protéger un créneau de récupération');
  });

  it('falls back to neutral check-in suggestion', () => {
    expect(deriveActionSuggestion('Ambiance à clarifier')).toBe('planifier un check-in ouvert');
  });
});

describe('deriveHeatmapInsight', () => {
  it('returns matching tone and label for tense summaries', () => {
    const insight = deriveHeatmapInsight('Une tension ressentie dans le collectif');
    expect(insight.tone).toBe('tense');
    expect(insight.label).toBe('tension sensible');
    expect(insight.action).toBe('resserrer la charge de réunions');
    expect(insight.tooltip).toBe('Tension ressentie');
  });

  it('prefers backend suggestion when provided', () => {
    const insight = deriveHeatmapInsight('Énergie forte', 'animer un café énergie');
    expect(insight.action).toBe('animer un café énergie');
    expect(insight.label).toBe('élan engagé');
  });
});

describe('groupCellsByInstrument', () => {
  it('groups cells by instrument key', () => {
    const cells = mapSummariesToCells([
      { instrument: 'CBI', period: '2024-W10', text: 'Fatigue latente', n: 7 },
      { instrument: 'CBI', period: '2024-W10', text: 'Stress canalisé', n: 5 },
      { instrument: 'UWES', period: '2024-W10', text: 'Engagement solidaire', n: 6 },
    ]);

    const groups = groupCellsByInstrument(cells);
    expect(Object.keys(groups)).toEqual(['CBI', 'UWES']);
    expect(groups.CBI).toHaveLength(2);
    expect(groups.UWES[0].text).toBe('Engagement solidaire');
  });
});
