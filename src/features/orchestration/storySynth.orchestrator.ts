import type { UIHint } from './types';

interface StorySynthInput {
  tensionLevel?: number;
  fatigueLevel?: number;
}

export function storySynthOrchestrator({ tensionLevel, fatigueLevel }: StorySynthInput): UIHint[] {
  const hints: UIHint[] = [];

  if ((tensionLevel ?? 2) >= 3) {
    hints.push({ action: 'set_story_bed', key: 'cocon' });
  }

  if ((fatigueLevel ?? 2) >= 3) {
    hints.push({ action: 'shorten_scene', ms: 60_000 }, { action: 'set_story_voice', key: 'slow' });
  }

  return hints.length ? hints : [{ action: 'none' }];
}
