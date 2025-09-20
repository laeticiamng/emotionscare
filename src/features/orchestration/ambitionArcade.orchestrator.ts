import type { AmbitionOrchestrationAction, AmbitionOrchestratorInput, TextProgressKey } from './types';

const MICRO_LEVERS = ['1 geste simple', '2 minutes de marche', 'respirer 1 minute'] as const;

export function ambitionOrchestrator({ gasLevel }: AmbitionOrchestratorInput): AmbitionOrchestrationAction[] {
  const label: TextProgressKey = gasLevel <= 1 ? 'doucement' : gasLevel >= 3 ? 'presque là' : 'sur la bonne voie';

  return [
    { action: 'set_text_progress', key: label },
    { action: 'inject_micro_levers', items: [...MICRO_LEVERS] },
  ];
}
