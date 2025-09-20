import type { BossGritOrchestrationAction, BossGritOrchestratorInput } from './types';

const SHORT_DURATION_MS = 180_000;
const STANDARD_DURATION_MS = 600_000;

export function bossGritOrchestrator({ gritLevel, brsLevel }: BossGritOrchestratorInput): BossGritOrchestrationAction[] {
  const short = gritLevel <= 1 || brsLevel <= 1;

  return [
    { action: 'set_challenge_duration', ms: short ? SHORT_DURATION_MS : STANDARD_DURATION_MS },
    { action: 'enable_compassion_streak', enabled: true },
  ];
}
