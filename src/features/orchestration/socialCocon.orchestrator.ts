import type { Orchestrator, SocialCoconLevels, UIHint } from './types';

const isLevelDefined = (value: number | undefined): value is number => typeof value === 'number';

export const socialCoconOrchestrator: Orchestrator<SocialCoconLevels> = ({ mspssLevel }) => {
  const hints: UIHint[] = [];

  if (isLevelDefined(mspssLevel) && mspssLevel <= 1) {
    hints.push({ action: 'prioritize_cta', key: 'plan_pause' });
    hints.push({ action: 'promote_rooms_private', enabled: true });
  }

  return hints;
};

export const computeSocialCoconUIHints = (levels: SocialCoconLevels) => socialCoconOrchestrator(levels);
