import type { AmbitionOrchestrationAction, AmbitionOrchestratorInput, TextProgressKey } from './types';

const MICRO_LEVERS = [
  'un geste simple',
  'quelques pas de marche',
  'respirer calmement',
] as const;

export function ambitionArcadeOrchestrator({ gasLevel }: AmbitionOrchestratorInput = {}): AmbitionOrchestrationAction[] {
  const label: TextProgressKey =
    gasLevel == null ? 'sur la bonne voie' : gasLevel <= 1 ? 'doucement' : gasLevel >= 3 ? 'presque là' : 'sur la bonne voie';

  return [
    { action: 'set_progress_text', key: label },
    { action: 'inject_micro_levers', items: [...MICRO_LEVERS] },
  ];
}

export const AMBITION_MICRO_LEVERS = [...MICRO_LEVERS];
