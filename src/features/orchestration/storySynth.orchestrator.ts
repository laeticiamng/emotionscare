// @ts-nocheck
import type { UIHint } from './types';

export interface StorySynthOrchestratorInput {
  tensionLevel?: number;
  fatigueLevel?: number;
}

export const storySynthOrchestrator = ({
  tensionLevel,
  fatigueLevel,
}: StorySynthOrchestratorInput): UIHint[] => {
  const hints: UIHint[] = [];

  if ((tensionLevel ?? 2) >= 3) {
    hints.push({ action: 'set_story_bed', key: 'cocon' });
  }

  if ((fatigueLevel ?? 2) >= 3) {
    hints.push({ action: 'shorten_scene', ms: 60_000 });
    hints.push({ action: 'set_story_voice', key: 'slow' });
  }

  if (hints.length === 0) {
    return [{ action: 'none' }];
  }

  return hints;
};

export default storySynthOrchestrator;
