// @ts-nocheck
import { describe, expect, it } from 'vitest';

import { computeJournalActions } from '../journal.orchestrator';

describe('computeJournalActions', () => {
  it('pins helpful themes and presets positive composer when PA is high', () => {
    const actions = computeJournalActions({ paLevel: 4, naLevel: 1, topHelpfulThemes: ['gratitude', 'nature', 'proches'] });

    expect(actions).toContainEqual({ action: 'pin_themes', keys: ['gratitude', 'nature', 'proches'] });
    expect(actions).toContainEqual({ action: 'preset_composer', text: 'Un petit moment positif récent ?' });
    expect(actions).toContainEqual({ action: 'suggest_next', key: 'none' });
  });

  it('prioritises calming banner and breath suggestion when NA is high', () => {
    const actions = computeJournalActions({ paLevel: 2, naLevel: 4, topHelpfulThemes: ['gratitude'] });

    expect(actions).toContainEqual({ action: 'show_banner', key: 'calm_suggest' });
    expect(actions).toContainEqual({ action: 'preset_composer', text: 'Un souffle lent, puis note ce qui pèse, en douceur.' });
    expect(actions).toContainEqual({ action: 'suggest_next', key: 'breath_sleep' });
    expect(actions.find((action) => action.action === 'pin_themes')).toBeUndefined();
  });

  it('deduplicates and clamps themes before pinning', () => {
    const actions = computeJournalActions({
      paLevel: 3,
      naLevel: 1,
      topHelpfulThemes: ['gratitude', 'gratitude', 'nature', 'respiration', 'calme'],
    });

    expect(actions).toContainEqual({ action: 'pin_themes', keys: ['gratitude', 'nature', 'respiration'] });
  });
});

