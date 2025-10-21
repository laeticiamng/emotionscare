// @ts-nocheck
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Sentry from '@sentry/react';

import { addBreadcrumb } from '@/lib/obs/breadcrumb';
import { logger } from '@/lib/logger';

import { startAssessment, submitAssessment, type AssessmentStartResponse } from './api';

export type AssessmentStage = 'pre' | 'post';

interface AssessmentState {
  stage: AssessmentStage | null;
  isStarting: boolean;
  isSubmitting: boolean;
  prompt: string | null;
  summary: string | null;
  error: string | null;
  lastStartedAt: string | null;
  catalog?: AssessmentStartResponse;
  lastLevel: number | null;
  lastSummary: string | null;
}

interface StartResult {
  stage: AssessmentStage;
  startedAt: string;
  response: AssessmentStartResponse;
}

interface SubmitResult {
  stage: AssessmentStage;
  submittedAt: string;
  summary: string;
}

export interface UseAssessmentResult {
  instrument: string;
  state: AssessmentState;
  start: (stage: AssessmentStage) => Promise<StartResult | null>;
  submit: (stage: AssessmentStage, answers: Record<string, number>, options?: { ts?: string }) => Promise<SubmitResult | null>;
  reset: () => void;
  lastLevel: number | null;
  lastSummary: string | null;
}

const initialState: AssessmentState = {
  stage: null,
  isStarting: false,
  isSubmitting: false,
  prompt: null,
  summary: null,
  error: null,
  lastStartedAt: null,
  catalog: undefined,
  lastLevel: null,
  lastSummary: null,
};

const SUMMARY_STORAGE_KEY = (instrument: string) => `assessment:${instrument}:lastSummary:v1`;
const LEVEL_STORAGE_KEY = (instrument: string) => `assessment:${instrument}:lastLevel:v1`;

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

const LEVEL_HINTS: Array<{ level: number; tests: RegExp[] }> = [
  { level: 4, tests: [/rigidite (?:elevee|haute)/, /accroche intense/, /tres accroche/] },
  { level: 3, tests: [/rigidite (?:marquee|forte)/, /tension forte/] },
  { level: 2, tests: [/transition/, /rigidite moderee/, /souplesse fragile/] },
  { level: 1, tests: [/souplesse douce/, /flexibilite/, /elan de souplesse/] },
  { level: 0, tests: [/tres souple/, /souplesse rayonnante/, /ancrage stable/] },
];

const stripNumbers = (value: string): string => value.replace(/[0-9]+/g, '').replace(/\s{2,}/g, ' ').trim();

const inferLevelFromSummary = (summary: string | null): number | null => {
  if (!summary) {
    return null;
  }

  const digitMatch = summary.match(/\b([0-4])\b/);
  if (digitMatch) {
    const parsed = Number.parseInt(digitMatch[1], 10);
    if (parsed >= 0 && parsed <= 4) {
      return parsed;
    }
  }

  const normalized = normalize(summary);
  for (const { level, tests } of LEVEL_HINTS) {
    if (tests.some((regex) => regex.test(normalized))) {
      return level;
    }
  }

  return null;
};

export function useAssessment(instrument: string): UseAssessmentResult {
  const [state, setState] = useState<AssessmentState>(initialState);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedSummary = window.localStorage.getItem(SUMMARY_STORAGE_KEY(instrument));
    const storedLevelRaw = window.localStorage.getItem(LEVEL_STORAGE_KEY(instrument));
    const storedLevel = storedLevelRaw ? Number.parseInt(storedLevelRaw, 10) : NaN;

    setState((prev) => ({
      ...prev,
      lastSummary: storedSummary ?? null,
      lastLevel: Number.isFinite(storedLevel) ? storedLevel : prev.lastLevel,
    }));
  }, [instrument]);

  const start = useCallback<UseAssessmentResult['start']>(
    async (stage) => {
      setState((prev) => ({
        ...prev,
        stage,
        isStarting: true,
        error: null,
      }));

      try {
        const response = await startAssessment(instrument, { locale: 'fr', stage });
        const startedAt = new Date().toISOString();

        addBreadcrumb('assess', {
          message: 'assessment:start',
          data: { instrument, stage },
        });

        setState((prev) => ({
          ...prev,
          stage,
          isStarting: false,
          prompt: response.items[0]?.prompt ?? null,
          catalog: response,
          lastStartedAt: startedAt,
          error: null,
        }));

        return { stage, startedAt, response };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'assessment_start_failed';
        Sentry.captureException(error, {
          tags: { scope: 'useAssessment', instrument },
          extra: { stage },
        });
        setState((prev) => ({
          ...prev,
          isStarting: false,
          error: message,
        }));
        return null;
      }
    },
    [instrument],
  );

  const submit = useCallback<UseAssessmentResult['submit']>(
    async (stage, answers, options) => {
      setState((prev) => ({
        ...prev,
        stage,
        isSubmitting: true,
        error: null,
      }));

      try {
        const response = await submitAssessment(instrument, answers, options?.ts);
        const submittedAt = new Date().toISOString();

        addBreadcrumb('assess', {
          message: 'assessment:submit',
          data: { instrument, stage },
        });

        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          summary: stripNumbers(response.summary),
          lastSummary: stripNumbers(response.summary),
          lastLevel: inferLevelFromSummary(response.summary),
          error: null,
        }));

        if (typeof window !== 'undefined') {
          const persistedSummary = stripNumbers(response.summary);
          try {
            window.localStorage.setItem(SUMMARY_STORAGE_KEY(instrument), persistedSummary);
            const inferred = inferLevelFromSummary(response.summary);
            if (inferred != null) {
              window.localStorage.setItem(LEVEL_STORAGE_KEY(instrument), String(inferred));
            }
          } catch (storageError) {
            logger.warn('[useAssessment] unable to persist AAQ summary', storageError as Error, 'SYSTEM');
          }
        }

        return { stage, submittedAt, summary: stripNumbers(response.summary) };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'assessment_submit_failed';
        Sentry.captureException(error, {
          tags: { scope: 'useAssessment', instrument },
          extra: { stage },
        });
        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          error: message,
        }));
        return null;
      }
    },
    [instrument],
  );

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const value = useMemo<UseAssessmentResult>(
    () => ({
      instrument,
      state,
      start,
      submit,
      reset,
      lastLevel: state.lastLevel,
      lastSummary: state.lastSummary,
    }),
    [instrument, reset, start, state, submit],
  );

  return value;
}
