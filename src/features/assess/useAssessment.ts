import { useCallback, useMemo, useState } from 'react';
import * as Sentry from '@sentry/react';

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
};

export function useAssessment(instrument: string): UseAssessmentResult {
  const [state, setState] = useState<AssessmentState>(initialState);

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

        Sentry.addBreadcrumb({
          category: 'assess',
          level: 'info',
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

        Sentry.addBreadcrumb({
          category: 'assess',
          level: 'info',
          message: 'assessment:submit',
          data: { instrument, stage },
        });

        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          summary: response.summary,
          error: null,
        }));

        return { stage, submittedAt, summary: response.summary };
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

  const value = useMemo<UseAssessmentResult>(() => ({ instrument, state, start, submit, reset }), [instrument, state, start, submit, reset]);

  return value;
}
