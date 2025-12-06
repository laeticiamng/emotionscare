import type { BubbleBeatOrchestrationAction, BubbleBeatOrchestratorInput } from './types';

const CALM_VARIANT_KEY = 'hr' as const;
const CALM_DURATION_MS = 120_000;

export function bubbleBeatOrchestrator({ pssLevel }: BubbleBeatOrchestratorInput): BubbleBeatOrchestrationAction[] {
  if (typeof pssLevel === 'number' && pssLevel >= 3) {
    return [
      { action: 'set_path_variant', key: CALM_VARIANT_KEY },
      { action: 'set_path_duration', ms: CALM_DURATION_MS },
      { action: 'post_cta', key: 'nyvee' },
    ];
  }

  return [{ action: 'post_cta', key: 'flash_glow' }];
}
