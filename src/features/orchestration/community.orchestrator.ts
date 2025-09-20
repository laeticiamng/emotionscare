import type { CommunityLevels, Orchestrator, UIHint } from './types';

const isLevelDefined = (value: number | undefined): value is number => typeof value === 'number';

export const communityOrchestrator: Orchestrator<CommunityLevels> = ({ ucla3Level, mspssLevel }) => {
  const hints: UIHint[] = [];

  if (isLevelDefined(ucla3Level) && ucla3Level >= 3) {
    hints.push({ action: 'show_banner', key: 'listen_two_minutes' });
    hints.push({ action: 'pin_card', key: 'social_cocon' });
  }

  if (isLevelDefined(mspssLevel) && mspssLevel <= 1) {
    hints.push({ action: 'suggest_replies', key: 'empathic_templates' });
  }

  return hints;
};

export const computeCommunityUIHints = (levels: CommunityLevels) => communityOrchestrator(levels);
