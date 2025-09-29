import type { Orchestrator, SocialCoconLevels, UIHint } from './types';

const isLevelDefined = (value: number | undefined): value is number => typeof value === 'number';

export const socialCoconOrchestrator: Orchestrator<SocialCoconLevels> = ({ mspssLevel, consented }) => {
  if (!consented) {
    return [{ action: 'none' }];
  }

  const hints: UIHint[] = [];

  if (isLevelDefined(mspssLevel) && mspssLevel <= 1) {
    hints.push({ action: 'promote_cta', key: 'schedule_break' });
    hints.push({ action: 'highlight_rooms_private' });
  }

  return hints.length ? hints : [{ action: 'none' }];
};

export const computeSocialCoconUIHints = (levels: SocialCoconLevels) => socialCoconOrchestrator(levels);
