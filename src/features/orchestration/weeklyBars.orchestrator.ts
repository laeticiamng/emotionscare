import type { UIHint } from './types';

export interface WeeklyBarsOrchestratorInput {
  who5Level?: number;
}

export const weeklyBarsOrchestrator = ({ who5Level }: WeeklyBarsOrchestratorInput): UIHint[] => {
  const items =
    who5Level == null
      ? ['posé', 'doux']
      : who5Level <= 1
        ? ['posé', 'doux']
        : who5Level >= 3
          ? ['clair', 'actif']
          : ['posé', 'doux'];

  return [
    { action: 'show_bars_text', items },
    { action: 'post_cta', key: 'flash_glow' },
  ];
};

export default weeklyBarsOrchestrator;
