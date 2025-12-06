// @ts-nocheck
export type JournalAction =
  | { action: 'pin_themes'; keys: string[] }
  | { action: 'show_banner'; key: 'calm_suggest' }
  | { action: 'preset_composer'; text: string }
  | { action: 'suggest_next'; key: 'nyvee' | 'breath_sleep' | 'flash_glow' | 'none' };

export interface JournalSignals {
  paLevel?: 0 | 1 | 2 | 3 | 4;
  naLevel?: 0 | 1 | 2 | 3 | 4;
  topHelpfulThemes: string[];
}

const clampThemes = (themes: string[]): string[] => {
  const deduped = Array.from(new Set(themes.filter(Boolean)));
  return deduped.slice(0, 3);
};

const POSITIVE_PRESET = 'Un petit moment positif récent ?';
const SOOTHING_PRESET = 'Un souffle lent, puis note ce qui pèse, en douceur.';

export function computeJournalActions({
  paLevel = 2,
  naLevel = 2,
  topHelpfulThemes,
}: JournalSignals): JournalAction[] {
  const actions: JournalAction[] = [];

  const sanitizedThemes = clampThemes(topHelpfulThemes ?? []);

  if (paLevel >= 3 && sanitizedThemes.length) {
    actions.push({ action: 'pin_themes', keys: sanitizedThemes });
    actions.push({ action: 'preset_composer', text: POSITIVE_PRESET });
  }

  if (naLevel >= 3) {
    if (!actions.some((item) => item.action === 'show_banner')) {
      actions.push({ action: 'show_banner', key: 'calm_suggest' });
    }
    actions.push({ action: 'preset_composer', text: SOOTHING_PRESET });
    actions.push({ action: 'suggest_next', key: 'breath_sleep' });
    return actions;
  }

  actions.push({ action: 'suggest_next', key: 'none' });

  if (paLevel >= 3 && !actions.some((item) => item.action === 'preset_composer')) {
    actions.push({ action: 'preset_composer', text: POSITIVE_PRESET });
  }

  if (paLevel < 3 && sanitizedThemes.length) {
    actions.push({ action: 'pin_themes', keys: sanitizedThemes });
  }

  return actions;
}

