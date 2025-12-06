/**
 * Hook pour gérer les phases de Flash Glow
 */

import { useState, useCallback, useMemo } from 'react';

export interface FlashPhase {
  id: string;
  label: string;
  description: string;
  startMs: number;
  endMs: number;
}

export interface FlashPhaseSnapshot {
  phase: FlashPhase;
  nextPhase: FlashPhase | null;
  progressInPhase: number;
}

export interface UseFlashPhasesOptions {
  onPhaseChange?: (phase: FlashPhase) => void;
}

export interface UseFlashPhasesReturn {
  snapshot: FlashPhaseSnapshot;
  update: (elapsedMs: number) => void;
}

const createPhases = (totalDurationMs: number): FlashPhase[] => {
  const warmupEnd = Math.floor(totalDurationMs * 0.2);
  const glowEnd = Math.floor(totalDurationMs * 0.8);

  return [
    {
      id: 'warmup',
      label: 'Échauffement',
      description: 'La lumière s\'installe doucement',
      startMs: 0,
      endMs: warmupEnd,
    },
    {
      id: 'glow',
      label: 'Lueur',
      description: 'Le halo enveloppe complètement',
      startMs: warmupEnd,
      endMs: glowEnd,
    },
    {
      id: 'settle',
      label: 'Apaisement',
      description: 'Sortie en douceur',
      startMs: glowEnd,
      endMs: totalDurationMs,
    },
  ];
};

export const useFlashPhases = (
  totalDurationMs: number,
  options?: UseFlashPhasesOptions
): UseFlashPhasesReturn => {
  const phases = useMemo(() => createPhases(totalDurationMs), [totalDurationMs]);
  const [currentPhaseId, setCurrentPhaseId] = useState<string>(phases[0].id);

  const getCurrentPhase = useCallback(
    (elapsedMs: number): FlashPhase => {
      for (const phase of phases) {
        if (elapsedMs >= phase.startMs && elapsedMs < phase.endMs) {
          return phase;
        }
      }
      return phases[phases.length - 1];
    },
    [phases]
  );

  const getNextPhase = useCallback(
    (currentPhase: FlashPhase): FlashPhase | null => {
      const currentIndex = phases.findIndex((p) => p.id === currentPhase.id);
      return currentIndex < phases.length - 1 ? phases[currentIndex + 1] : null;
    },
    [phases]
  );

  const update = useCallback(
    (elapsedMs: number) => {
      const phase = getCurrentPhase(elapsedMs);
      
      if (phase.id !== currentPhaseId) {
        setCurrentPhaseId(phase.id);
        options?.onPhaseChange?.(phase);
      }
    },
    [getCurrentPhase, currentPhaseId, options]
  );

  const snapshot = useMemo((): FlashPhaseSnapshot => {
    const phase = phases.find((p) => p.id === currentPhaseId) || phases[0];
    const nextPhase = getNextPhase(phase);
    const phaseDuration = phase.endMs - phase.startMs;
    const progressInPhase = phaseDuration > 0 ? 0 : 0;

    return {
      phase,
      nextPhase,
      progressInPhase,
    };
  }, [phases, currentPhaseId, getNextPhase]);

  return {
    snapshot,
    update,
  };
};
