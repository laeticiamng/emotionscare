import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type { AssessmentComputation } from '@/services/clinicalScoringService';

export type Stai6Phase = 'pre' | 'post';
export type Stai6Delta = 'down' | 'flat' | 'up';

interface PhaseSnapshot {
  level: number;
  summary: string;
  generatedAt: string;
}

interface Stai6OrchestrationValue {
  snapshots: Partial<Record<Stai6Phase, PhaseSnapshot>>;
  register: (
    phase: Stai6Phase,
    computation: Pick<AssessmentComputation, 'level' | 'summary' | 'generatedAt'> | null | undefined
  ) => void;
  delta: (from: Stai6Phase, to: Stai6Phase) => Stai6Delta | null;
  reset: () => void;
}

const Stai6OrchestrationContext = createContext<Stai6OrchestrationValue | null>(null);

interface Stai6OrchestrationProviderProps {
  children: ReactNode;
}

export const Stai6OrchestrationProvider = ({ children }: Stai6OrchestrationProviderProps) => {
  const [snapshots, setSnapshots] = useState<Partial<Record<Stai6Phase, PhaseSnapshot>>>({});

  const register = useCallback<Stai6OrchestrationValue['register']>((phase, computation) => {
    if (!computation) {
      return;
    }

    setSnapshots((previous) => ({
      ...previous,
      [phase]: {
        level: computation.level,
        summary: computation.summary,
        generatedAt: computation.generatedAt,
      },
    }));
  }, []);

  const reset = useCallback(() => {
    setSnapshots({});
  }, []);

  const delta = useCallback<Stai6OrchestrationValue['delta']>(
    (from, to) => {
      const origin = snapshots[from];
      const target = snapshots[to];

      if (!origin || !target) {
        return null;
      }

      const difference = target.level - origin.level;

      if (difference < 0) {
        return 'down';
      }

      if (difference > 0) {
        return 'up';
      }

      return 'flat';
    },
    [snapshots]
  );

  const value = useMemo(
    () => ({
      snapshots,
      register,
      delta,
      reset,
    }),
    [delta, register, snapshots]
  );

  return <Stai6OrchestrationContext.Provider value={value}>{children}</Stai6OrchestrationContext.Provider>;
};

export const useStai6Orchestration = (): Stai6OrchestrationValue => {
  const context = useContext(Stai6OrchestrationContext);

  if (!context) {
    throw new Error('useStai6Orchestration must be used within a Stai6OrchestrationProvider');
  }

  return context;
};
