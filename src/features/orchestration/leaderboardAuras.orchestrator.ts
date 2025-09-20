import type { AurasLevels, Orchestrator, UIHint } from './types';

const isLevelDefined = (value: number | undefined): value is number => typeof value === 'number';

const resolveAuraKey = (level: number): UIHint['key'] => {
  if (level <= 1) {
    return 'cool_gentle';
  }
  if (level >= 3) {
    return 'warm_soft';
  }
  return 'neutral';
};

export const aurasOrchestrator: Orchestrator<AurasLevels> = ({ who5Level }) => {
  if (!isLevelDefined(who5Level)) {
    return [{ action: 'set_aura', key: 'neutral' }];
  }

  const aura = resolveAuraKey(who5Level);
  return [{ action: 'set_aura', key: aura }];
};

export const computeAurasUIHints = (levels: AurasLevels) => aurasOrchestrator(levels);
