import type { AurasLevels, UIHint } from './types';

const resolveAuraKey = (level: number | undefined): UIHint['key'] => {
  if (typeof level !== 'number') {
    return 'neutral';
  }

  if (level <= 1) {
    return 'cool_gentle';
  }

  if (level >= 3) {
    return 'warm_soft';
  }

  return 'neutral';
};

export function aurasOrchestrator({ who5Level }: AurasLevels): UIHint[] {
  const key = resolveAuraKey(who5Level);
  return [{ action: 'set_aura', key }];
}

export const computeAurasUIHints = (levels: AurasLevels) => aurasOrchestrator(levels);
