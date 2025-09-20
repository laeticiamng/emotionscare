import type { UIHint } from './types';

interface WeeklyBarsInput {
  who5Level?: number;
}

const DEFAULT_ITEMS = ['posé', 'doux'];
const HIGH_ITEMS = ['clair', 'actif'];

export function weeklyBarsOrchestrator({ who5Level }: WeeklyBarsInput): UIHint[] {
  const items =
    who5Level == null
      ? DEFAULT_ITEMS
      : who5Level <= 1
      ? DEFAULT_ITEMS
      : who5Level >= 3
      ? HIGH_ITEMS
      : DEFAULT_ITEMS;

  return [
    { action: 'show_bars_text', items },
    { action: 'post_cta', key: 'flash_glow' },
  ];
}
