import { useCallback, useMemo, useRef, useState } from 'react';

export type FlashPhase = 'warmup' | 'glow' | 'settle';

export interface FlashPhaseDefinition {
  key: FlashPhase;
  ms: number;
  label: string;
  description: string;
  intensity: 'soft' | 'bright' | 'calm';
}

export interface FlashPhaseSnapshot {
  phase: FlashPhaseDefinition;
  index: number;
  nextPhase: FlashPhaseDefinition | null;
  startedMs: number;
  endsMs: number;
  elapsedInPhase: number;
  remainingInPhase: number;
  progress: number;
}

export interface UseFlashPhasesOptions {
  onPhaseChange?: (phase: FlashPhase) => void;
}

const DEFAULT_PHASES: FlashPhaseDefinition[] = [
  {
    key: 'warmup',
    ms: 30_000,
    label: 'Préparation douce',
    description: 'Installez-vous, relâchez les épaules et laissez la lumière s’allumer en douceur.',
    intensity: 'soft',
  },
  {
    key: 'glow',
    ms: 60_000,
    label: 'Plein éclat',
    description: 'Respiration ample, regard détendu : la lumière pulse pour soutenir votre énergie.',
    intensity: 'bright',
  },
  {
    key: 'settle',
    ms: 30_000,
    label: 'Atterrissage',
    description: 'La luminosité s’adoucit. Revenez tranquillement à votre rythme naturel.',
    intensity: 'calm',
  },
];

const sanitizeTotal = (value: number): number => {
  if (!Number.isFinite(value) || value <= 0) {
    return DEFAULT_PHASES.reduce((total, phase) => total + phase.ms, 0);
  }

  return Math.round(value);
};

export function useFlashPhases(totalMs = 120_000, options: UseFlashPhasesOptions = {}) {
  const totalDuration = sanitizeTotal(totalMs);
  const [snapshot, setSnapshot] = useState<FlashPhaseSnapshot>(() => ({
    phase: DEFAULT_PHASES[0],
    index: 0,
    nextPhase: DEFAULT_PHASES[1] ?? null,
    startedMs: 0,
    endsMs: DEFAULT_PHASES[0].ms,
    elapsedInPhase: 0,
    remainingInPhase: DEFAULT_PHASES[0].ms,
    progress: 0,
  }));

  const previousPhaseRef = useRef<FlashPhase>(DEFAULT_PHASES[0].key);

  const phases = useMemo(() => {
    const definitions = [...DEFAULT_PHASES];
    const sum = definitions.reduce((total, phase) => total + phase.ms, 0);

    if (sum === totalDuration) {
      return definitions;
    }

    // Ajuster proportionnellement pour coller à la durée demandée.
    const ratio = totalDuration / sum;
    return definitions.map((phase) => ({
      ...phase,
      ms: Math.max(1, Math.round(phase.ms * ratio)),
    }));
  }, [totalDuration]);

  const getSnapshot = useCallback((elapsedMs: number): FlashPhaseSnapshot => {
    const clampedElapsed = Math.max(0, Math.min(elapsedMs, totalDuration));

    let accumulated = 0;

    for (let index = 0; index < phases.length; index += 1) {
      const definition = phases[index];
      const start = accumulated;
      const end = accumulated + definition.ms;
      accumulated = end;

      const inPhase = index === phases.length - 1 || clampedElapsed < end;
      if (!inPhase) {
        continue;
      }

      const elapsedInPhase = Math.max(0, clampedElapsed - start);
      const remainingInPhase = Math.max(0, end - clampedElapsed);
      const progress = definition.ms === 0 ? 1 : Math.max(0, Math.min(1, elapsedInPhase / definition.ms));

      return {
        phase: definition,
        index,
        nextPhase: phases[index + 1] ?? null,
        startedMs: start,
        endsMs: end,
        elapsedInPhase,
        remainingInPhase,
        progress,
      };
    }

    const last = phases[phases.length - 1];
    const totalBeforeLast = phases.slice(0, -1).reduce((total, phase) => total + phase.ms, 0);

    return {
      phase: last,
      index: phases.length - 1,
      nextPhase: null,
      startedMs: totalBeforeLast,
      endsMs: totalDuration,
      elapsedInPhase: Math.max(0, clampedElapsed - totalBeforeLast),
      remainingInPhase: Math.max(0, totalDuration - clampedElapsed),
      progress: last.ms === 0 ? 1 : Math.max(0, Math.min(1, (clampedElapsed - totalBeforeLast) / last.ms)),
    };
  }, [phases, totalDuration]);

  const update = useCallback((elapsedMs: number) => {
    const next = getSnapshot(elapsedMs);
    setSnapshot(next);

    if (next.phase.key !== previousPhaseRef.current) {
      previousPhaseRef.current = next.phase.key;
      options.onPhaseChange?.(next.phase.key);
    }

    return next;
  }, [getSnapshot, options.onPhaseChange]);

  return {
    phases,
    snapshot,
    currentPhase: snapshot.phase,
    current: getSnapshot,
    update,
    totalDuration,
  };
}

