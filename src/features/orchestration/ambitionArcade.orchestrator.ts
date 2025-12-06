import type { AmbitionOrchestrationAction, AmbitionOrchestratorInput, TextProgressKey } from './types';

const MICRO_LEVERS = ['1 geste simple', '2 minutes de marche', 'respirer 1 minute'] as const;

const resolveProgressLabel = (gasLevel: number | undefined): TextProgressKey => {
  if (typeof gasLevel !== 'number') {
    return 'sur la bonne voie';
  }

  if (gasLevel <= 1) {
    return 'doucement';
  }

  if (gasLevel >= 3) {
    return 'presque là';
  }

  return 'sur la bonne voie';
};

export function ambitionArcadeOrchestrator({ gasLevel }: AmbitionOrchestratorInput): AmbitionOrchestrationAction[] {
  const label = resolveProgressLabel(gasLevel);

  return [
    { action: 'set_progress_text', key: label },
    { action: 'inject_micro_levers', items: [...MICRO_LEVERS] },
  ];
}
