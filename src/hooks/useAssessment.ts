/**
 * Clinical assessment hook - fetches instrument catalogues and submits responses
 * Uses React Query caching with expiry-based staleness and gentle UX feedback.
 */

import { useState, useCallback, useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { useCallback, useMemo, useState } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryFunctionContext,
} from '@tanstack/react-query';
import { z } from 'zod';

import { supabase } from '@/integrations/supabase/client';
import { invokeSupabaseEdge } from '@/lib/network/supabaseEdge';
import { useToast } from '@/hooks/use-toast';

const instrumentCodes = [
  'WHO5',
  'STAI6',
  'PANAS',
  'PSS10',
  'UCLA3',
  'MSPSS',
  'AAQ2',
  'POMS',
  'SSQ',
  'ISI',
  'GAS',
  'GRITS',
  'BRS',
  'WEMWBS',
  'UWES',
  'CBI',
  'CVSQ',
  'SAM',
  'SUDS',
] as const;

const instrumentSchema = z.enum(instrumentCodes);
const localeSchema = z.enum(['fr', 'en', 'es', 'de', 'it']);
const answerValueSchema = z.union([z.string(), z.number(), z.boolean()]);

const assessmentItemSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  type: z.enum(['scale', 'choice', 'slider']),
  options: z.array(z.string()).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  reversed: z.boolean().optional(),
  subscale: z.string().optional(),
});

const startResponseSchema = z
  .object({
    code: instrumentSchema.optional(),
    instrument: instrumentSchema.optional(),
    name: z.string(),
    version: z.string(),
    expiry_minutes: z.number().int().positive(),
    items: z.array(assessmentItemSchema).min(1),
  })
  .refine(data => Boolean(data.code ?? data.instrument), 'missing_instrument_code')
  .transform(data => {
    const resolved = (data.code ?? data.instrument)!;
    return {
      code: resolved,
      instrument: resolved,
      name: data.name,
      version: data.version,
      expiry_minutes: data.expiry_minutes,
      items: data.items,
    } as const;
  });

const submitRequestSchema = z.object({
  instrument: instrumentSchema,
  answers: z
    .record(answerValueSchema)
    .refine(value => Object.keys(value).length > 0, 'answers_required'),
  ts: z.string().datetime().optional(),
});

const submitResponseSchema = z.object({
  status: z.literal('ok'),
  stored: z.boolean().optional(),
});

export type InstrumentCode = (typeof instrumentCodes)[number];
export type LocaleCode = z.infer<typeof localeSchema>;
export type AssessmentItem = z.infer<typeof assessmentItemSchema>;
export type AssessmentCatalog = z.infer<typeof startResponseSchema>;
export type AnswerValue = z.infer<typeof answerValueSchema>;

interface SubmitArgs {
  answers: Record<string, AnswerValue>;
  timestamp?: string;
}

interface SubmitResult {
  status: 'ok';
  stored?: boolean;
}

type AssessmentQueryKey = ['assessment', InstrumentCode, LocaleCode];

type StartQueryContext = QueryFunctionContext<AssessmentQueryKey>;

class AssessmentAuthError extends Error {
  constructor(message = 'auth_required') {
    super(message);
    this.name = 'AssessmentAuthError';
  }
}

const minutesToMs = (minutes?: number) => {
  if (!minutes || minutes <= 0) {
    return 0;
  }
  return minutes * 60_000;
};

const staleTimeFromQuery = (query: { state: { data?: AssessmentCatalog } }) => {
  return minutesToMs(query.state.data?.expiry_minutes);
};

const gcTimeFromQuery = (query: { state: { data?: AssessmentCatalog } }) => {
  const ms = minutesToMs(query.state.data?.expiry_minutes);
  return ms > 0 ? ms : undefined;
};

const resolveSessionToken = async (): Promise<string> => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message ?? 'session_unavailable');
  }

  const token = data.session?.access_token;
  if (!token) {
    throw new AssessmentAuthError();
  }

  return token;
};

const fetchCatalog = async ({ queryKey, signal }: StartQueryContext): Promise<AssessmentCatalog> => {
  const [, instrument, locale] = queryKey;
  const accessToken = await resolveSessionToken();

  const payload = { instrument, locale } as const;
  const raw = await invokeSupabaseEdge<typeof payload, unknown>('assess-start', {
    payload,
    accessToken,
    signal,
  });

  const parsed = startResponseSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error('invalid_catalog_payload');
  }

  return parsed.data;
};

const submitAssessment = async (
  variables: SubmitArgs & { instrument: InstrumentCode },
): Promise<SubmitResult> => {
  const { instrument, answers, timestamp } = variables;
  const accessToken = await resolveSessionToken();

  const payload = {
    instrument,
    answers,
    ...(timestamp ? { ts: timestamp } : {}),
  } as const;

  const response = await invokeSupabaseEdge<typeof payload, unknown>('assess-submit', {
    payload,
    schema: submitRequestSchema,
    accessToken,
  });

  const parsed = submitResponseSchema.safeParse(response);
  if (!parsed.success) {
    throw new Error('invalid_submit_response');
  }

  return parsed.data;
};

const isUnauthorizedError = (error: unknown) => {
  if (error instanceof AssessmentAuthError) {
    return true;
  }
  if (error instanceof Error) {
    return /401/.test(error.message);
  }
  return false;
};

export interface UseAssessmentResult {
  instrument: InstrumentCode;
  locale: LocaleCode;
  catalog?: AssessmentCatalog;
  start: (locale?: LocaleCode) => Promise<AssessmentCatalog | undefined>;
  submit: (answers: Record<string, AnswerValue>) => Promise<boolean>;
  isStarting: boolean;
  isSubmitting: boolean;
  startError: Error | null;
  submitError: Error | null;
}

export const useAssessment = (instrument: InstrumentCode): UseAssessmentResult => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [currentLocale, setCurrentLocale] = useState<LocaleCode>('fr');

  const queryKey = useMemo<AssessmentQueryKey>(
    () => ['assessment', instrument, currentLocale],
    [instrument, currentLocale],
  );

  const handleStartError = useCallback(
    (error: unknown) => {
      console.error('[useAssessment] unable to start assessment', error);

      if (isUnauthorizedError(error)) {
        toast({
          title: 'Connexion requise',
          description: 'Connecte-toi pour accéder au questionnaire clinique.',
          variant: 'warning',
        });
        return;
      }

      toast({
        title: 'Évaluation indisponible',
        description: 'Nous n’avons pas pu préparer le questionnaire. Réessaie dans quelques instants.',
        variant: 'warning',
      });
    },
    [toast],
  );

  const handleSubmitError = useCallback(
    (error: unknown) => {
      console.error('[useAssessment] unable to submit responses', error);

      if (isUnauthorizedError(error)) {
        toast({
          title: 'Session expirée',
          description: 'Reconnecte-toi pour enregistrer tes réponses.',
          variant: 'warning',
        });
        return;
      }

      toast({
        title: 'Réponses non enregistrées',
        description: 'Une erreur est survenue. Vérifie ta connexion puis réessaie.',
        variant: 'warning',
      });
    },
    [toast],
  );

  const startQuery = useQuery<AssessmentCatalog, Error, AssessmentCatalog, AssessmentQueryKey>({
    queryKey,
    queryFn: fetchCatalog,
    enabled: false,
    staleTime: staleTimeFromQuery,
    gcTime: gcTimeFromQuery,
  });

  const start = useCallback<UseAssessmentResult['start']>(
    async (locale?: LocaleCode) => {
      const nextLocale = locale ?? currentLocale;
      if (nextLocale !== currentLocale) {
        setCurrentLocale(nextLocale);
      }

      try {
        const data = await queryClient.fetchQuery({
          queryKey: ['assessment', instrument, nextLocale] as AssessmentQueryKey,
          queryFn: fetchCatalog,
          staleTime: staleTimeFromQuery,
          gcTime: gcTimeFromQuery,
        });
        return data;
      } catch (error) {
        handleStartError(error);
        return undefined;
      }
    },
    [currentLocale, handleStartError, instrument, queryClient],
  );

  const submitMutation = useMutation<SubmitResult, Error, SubmitArgs>({
    mutationKey: ['assessment', instrument, 'submit'],
    mutationFn: async variables => {
      const sanitizedEntries = Object.entries(variables.answers).filter(([, value]) =>
        value !== undefined && value !== null,
      );

      if (!sanitizedEntries.length) {
        toast({
          title: 'Réponses requises',
          description: 'Merci de répondre à chaque question avant de valider.',
          variant: 'info',
        });
        throw new Error('answers_required');
      }

      const sanitizedAnswers = sanitizedEntries.reduce<Record<string, AnswerValue>>((acc, [key, value]) => {
        acc[key] = value as AnswerValue;
        return acc;
      }, {});

      return submitAssessment({
        instrument,
        answers: sanitizedAnswers,
        timestamp: new Date().toISOString(),
      });
    },
    onError: error => {
      const message = (error as Error).message;
      if (message === 'submit_in_progress' || message === 'answers_required') {
        return;
      }
      handleSubmitError(error);
    },
  });

      if (response.error) throw response.error;

      // Process orchestration based on results
      await processOrchestration(state.currentInstrument, answers);

      setState(prev => ({
        ...prev,
        isActive: false,
        lastResponse: new Date()
      }));

      return true;
    } catch (error) {
      console.error('Error submitting assessment:', error);
      return false;
    }
  };

  const processOrchestration = async (instrument: InstrumentCode, answers: Record<string, any>) => {
    const actions: OrchestrationAction[] = [];

    switch (instrument) {
      case 'WHO5':
        const who5Score = Object.values(answers).reduce((sum: number, val: any) => sum + Number(val), 0);
        if (who5Score < 13) {
          actions.push('gentle_tone', 'increase_support');
          currentCallbacks.onLowWellbeing?.();
        } else {
          actions.push('encourage_movement');
          currentCallbacks.onOptimalState?.();
        }
        break;

      try {
        const result = await submitMutation.mutateAsync({ answers });
        return result.status === 'ok';
      } catch (error) {
        const message = (error as Error).message;
        if (message === 'answers_required' || message === 'submit_in_progress') {
          return false;
        }

        return false;
        break;
    }

    Sentry.addBreadcrumb({
      category: 'orchestration',
      level: 'info',
      message: 'orchestration:actions:computed',
      data: { instrument, actions_count: actions.length },
    });

    // Store orchestration signals in database (invisible to UI)
    if (actions.length > 0) {
      Sentry.addBreadcrumb({
        category: 'orchestration',
        level: 'info',
        message: 'orchestration:signals:store',
        data: { instrument, actions },
      });

      const { error } = await supabase
        .from('clinical_signals')
        .insert({
          source_instrument: instrument,
          domain: instrument === 'WHO5' ? 'wellbeing' : instrument === 'STAI6' ? 'anxiety' : 'affect',
          level: actions.includes('increase_support') ? 1 : actions.includes('gentle_tone') ? 2 : 3,
          window_type: 'contextual',
          module_context: 'assessment_response',
          metadata: { actions },
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h
        });

      if (error) {
        console.error('Error storing orchestration signals:', error);
        Sentry.captureException(error, {
          route: 'clinical-orchestration',
          stage: 'signals_store',
        });
      } else {
        Sentry.addBreadcrumb({
          category: 'orchestration',
          level: 'info',
          message: 'orchestration:signals:stored',
          data: { instrument, actions_count: actions.length },
        });
      }
    }

    setState(prev => ({
      ...prev,
      orchestrationActions: actions
    }));

    if (actions.length > 0) {
      Sentry.addBreadcrumb({
        category: 'orchestration',
        level: 'info',
        message: 'orchestration:actions:applied',
        data: { instrument, actions },
      });
    }
  };

  const getOrchestrationActions = useCallback(() => {
    return state.orchestrationActions;
  }, [state.orchestrationActions]);

      const userId = userData?.user?.id;
      if (userId) {
        const { error } = await supabase
          .from('clinical_signals')
          .insert({
            user_id: userId,
            source_instrument: instrument,
            domain: instrument === 'WHO5' ? 'wellbeing' : instrument === 'STAI6' ? 'anxiety' : 'affect',
            level: actions.includes('increase_support') ? 1 : actions.includes('gentle_tone') ? 2 : 3,
            module_context: 'assessment_response',
            metadata: { actions },
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h
          });

        if (error) {
          console.error('Error storing orchestration signals:', error);
        }
      }
    },
    [submitMutation],
  );

  return {
    instrument,
    locale: currentLocale,
    catalog: startQuery.data,
    start,
    submit,
    isStarting: startQuery.fetchStatus === 'fetching',
    isSubmitting: submitMutation.isPending,
    startError: startQuery.error ?? null,
    submitError: (submitMutation.error as Error | null) ?? null,
  };
};

