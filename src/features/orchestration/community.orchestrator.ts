import type { CommunityLevels, Orchestrator, UIHint } from './types';

const isLevelDefined = (value: number | undefined): value is number => typeof value === 'number';

export const communityOrchestrator: Orchestrator<CommunityLevels> = ({
  uclaLevel,
  mspssLevel,
  consented,
}) => {
  if (!consented) {
    return [{ action: 'none' }];
  }

  const hints: UIHint[] = [];

  if (isLevelDefined(uclaLevel) && uclaLevel >= 3) {
    hints.push({ action: 'show_banner', key: 'listen_two_minutes' });
    hints.push({ action: 'pin_card', key: 'social_cocon' });
  }

  if (isLevelDefined(mspssLevel) && mspssLevel <= 1) {
    hints.push({ action: 'show_empathic_replies' });
  }

  return hints.length ? hints : [{ action: 'none' }];
};

export const computeCommunityUIHints = (levels: CommunityLevels) => communityOrchestrator(levels);
