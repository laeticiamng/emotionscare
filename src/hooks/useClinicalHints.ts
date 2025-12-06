// @ts-nocheck
import { useCallback, useEffect, useState } from 'react';

import {
  clinicalOrchestration,
  type ClinicalSignal,
  type ModuleContext,
} from '@/services/clinicalOrchestration';

const extractActions = (signals: ClinicalSignal[]): string[] => {
  const deduped = new Set<string>();

  signals.forEach((signal) => {
    const metadata = signal.metadata ?? {};
    const rawHints = (metadata.hints ?? metadata.actions) as unknown;

    if (Array.isArray(rawHints)) {
      rawHints.forEach((entry) => {
        if (!entry) return;
        if (typeof entry === 'string') {
          deduped.add(entry);
          return;
        }
        if (typeof entry === 'object' && 'action' in entry && typeof (entry as { action?: unknown }).action === 'string') {
          deduped.add((entry as { action: string }).action);
        }
      });
    }
  });

  return Array.from(deduped);
};

export interface UseClinicalHintsResult {
  hints: string[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useClinicalHints = (moduleContext: ModuleContext): UseClinicalHintsResult => {
  const [hints, setHints] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const signals = await clinicalOrchestration.getActiveSignals(moduleContext);
      setHints(extractActions(signals));
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      setHints([]);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [moduleContext]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { hints, isLoading, error, refresh };
};

export default useClinicalHints;

