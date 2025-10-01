// @ts-nocheck
import type { AuraKey, AurasLevels, AurasOrchestrationAction } from './types';

const resolveAuraKey = (level: number | undefined): AuraKey => {
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

export function aurasOrchestrator({ who5Level }: AurasLevels): AurasOrchestrationAction[] {
  const key = resolveAuraKey(who5Level);
  return [{ action: 'set_aura', key }];
}

export const computeAurasUIHints = (levels: AurasLevels) => aurasOrchestrator(levels);
