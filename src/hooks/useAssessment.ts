import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { supabase } from '@/integrations/supabase/client';
import { invokeSupabaseEdge } from '@/lib/network/supabaseEdge';
import { useToast } from '@/hooks/use-toast';
import { useFlags } from '@/core/flags';
import { useClinicalConsent } from '@/hooks/useClinicalConsent';
import {
  clinicalScoringService,
  type AssessmentComputation,
  type InstrumentCatalog,
  type InstrumentCode as ClinicalInstrumentCode,
  type LocaleCode as ClinicalLocaleCode,
} from '@/services/clinicalScoringService';

export const instrumentCodes = [
  'WHO5',
  'STAI6',
  'PANAS',
  'PSS10',
  'WEMWBS',
  'SWEMWBS',
  'CBI',
  'UWES',
  'SAM',
  'SUDS',
  'SSQ',
  'UCLA3',
  'MSPSS',
  'AAQ2',
  'POMS',
  'POMS_TENSION',
  'ISI',
  'GAS',
  'GRITS',
  'BRS',
  'CVSQ',
] as const;

export type InstrumentCode = (typeof instrumentCodes)[number];
export type LocaleCode = ClinicalLocaleCode;

const instrumentRuntimeMap: Partial<Record<InstrumentCode, ClinicalInstrumentCode>> = {
  POMS_TENSION: 'POMS',
};

const instrumentFlagAliases: Partial<Record<InstrumentCode, string[]>> = {
  POMS: ['FF_ASSESS_POMS', 'FF_ASSESS_POMS_TENSION'],
  POMS_TENSION: ['FF_ASSESS_POMS_TENSION', 'FF_ASSESS_POMS'],
};

const resolveFlagKeys = (inst: InstrumentCode): string[] => instrumentFlagAliases[inst] ?? [`FF_ASSESS_${inst}`];

const startItemSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  type: z.enum(['scale', 'choice', 'slider']),
  options: z.array(z.string()).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
});

const startResponseSchema = z.object({
  instrument: z.string(),
  locale: z.enum(['fr', 'en', 'es', 'de', 'it']).default('fr'),
  name: z.string(),
  version: z.string(),
  expiry_minutes: z.number().int().nonnegative(),
  items: z.array(startItemSchema).min(1),
});

const normalizeSummary = (summary?: string | null): string => {
  if (!summary) return '';
  return summary
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
};

const inferSubscaleLevelFromSummary = (
  summary: string,
  subscale: 'tension' | 'fatigue' | 'vigor',
): number | undefined => {
  const text = normalizeSummary(summary);
  if (!text) return undefined;

  if (subscale === 'tension') {
    if (text.includes('surcharge')) return 4;
    if (text.includes('tension marquee') || text.includes('tension presente')) return 3;
    if (text.includes('humeur a surveiller')) return 2;
    if (text.includes('nuances calmes') || text.includes('calme') || text.includes('detente')) return 1;
    if (text.includes('horizon lumineux')) return 0;
  }

  if (subscale === 'fatigue') {
    if (text.includes('fatigue forte') || text.includes('besoin de repos urgent')) return 4;
    if (text.includes('fatigue presente') || text.includes('repos fragile')) return 3;
    if (text.includes('stabilite') || text.includes('a surveiller')) return 2;
    if (text.includes('energie douce') || text.includes('ressource')) return 1;
  }

  if (subscale === 'vigor') {
    if (text.includes('elan faible') || text.includes('energie basse')) return 1;
    if (text.includes('bonne forme') || text.includes('elan') || text.includes('energie')) return 3;
    if (text.includes('radiant horizon') || text.includes('horizon lumineux')) return 4;
  }

  return undefined;
};

export type AnswerValue = string | number | boolean;

export type AssessmentPhase = 'pre' | 'post';

interface AssessmentState {
  instrument: InstrumentCode;
  locale: LocaleCode;
  catalog?: InstrumentCatalog;
  lastComputation?: AssessmentComputation;
  currentInstrument: InstrumentCode | null;
  isActive: boolean;
  isStarting: boolean;
  isSubmitting: boolean;
  hasConsent: boolean;
  consentDecision: 'granted' | 'declined' | null;
  isConsentLoading: boolean;
  isFlagEnabled: boolean;
  isDNTEnabled: boolean;
  canDisplay: boolean;
  lastCompletedAt?: string;
  error?: string | null;
}

interface AssessmentCallbacks {
  onLowWellbeing?: () => void;
  onOptimalState?: () => void;
  onHighActivation?: () => void;
}

export interface UseAssessmentResult {
  instrument: InstrumentCode;
  state: AssessmentState;
  isEligible: boolean;
  isDue: (phase: AssessmentPhase, options?: { module?: string }) => boolean;
  start: (locale?: LocaleCode) => Promise<InstrumentCatalog | undefined>;
  triggerAssessment: (instrumentOverride?: InstrumentCode, callbacks?: AssessmentCallbacks) => Promise<boolean>;
  submit: (
    answers: Record<string, AnswerValue>,
    options?: { timestamp?: string; phase?: AssessmentPhase },
  ) => Promise<boolean>;
  submitResponse: (
    answers: Record<string, AnswerValue>,
    options?: { timestamp?: string; phase?: AssessmentPhase },
  ) => Promise<boolean>;
  grantConsent: () => Promise<void>;
  declineConsent: () => Promise<void>;
  reset: () => void;
  lastSubscaleLevel: (subscale: 'tension' | 'fatigue' | 'vigor') => number | undefined;
  lastLevel: number | null;
  lastSummary: string | null;
}

const HISTORY_QUERY_KEY = (instrument: InstrumentCode) => ['assessment-history', instrument] as const;

const resolveSessionToken = async (): Promise<string> => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw new Error(error.message ?? 'session_unavailable');
  }
  const token = data.session?.access_token;
  if (!token) {
    throw new Error('auth_required');
  }
  return token;
};

const sanitizeAnswers = (answers: Record<string, AnswerValue>) => {
  const entries = Object.entries(answers).filter(([, value]) => value !== null && value !== undefined);
  return entries.reduce<Record<string, AnswerValue>>((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});
};

const PRE_CHECK_COOLDOWN_MS = 4 * 60 * 60 * 1000;
const POST_CHECK_WINDOW_MS = 2 * 60 * 60 * 1000;

const toastLabels = {
  mustConsent: {
    title: 'Choix requis',
    description: 'Vous pouvez accepter ou refuser librement cette mini-évaluation.',
  },
  unavailable: {
    title: 'Évaluation indisponible',
    description: 'Impossible de préparer le questionnaire pour le moment. Réessayez plus tard.',
  },
  submitError: {
    title: 'Envoi interrompu',
    description: 'Les réponses n’ont pas pu être enregistrées. Vérifiez votre connexion et réessayez.',
  },
  answersRequired: {
    title: 'Réponses nécessaires',
    description: 'Merci de partager un ressenti pour chaque question avant de valider.',
  },
} as const;

export const useAssessment = (instrument: InstrumentCode): UseAssessmentResult => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { flags } = useFlags();
  const runtimeInstrument = instrumentRuntimeMap[instrument] ?? (instrument as ClinicalInstrumentCode);
  const consent = useClinicalConsent(runtimeInstrument as ClinicalInstrumentCode);
  const callbacksRef = useRef<AssessmentCallbacks | null>(null);
  const initialFlagKeys = resolveFlagKeys(instrument);

  const [state, setState] = useState<AssessmentState>(() => ({
    instrument,
    locale: 'fr',
    catalog: undefined,
    lastComputation: undefined,
    currentInstrument: null,
    isActive: false,
    isStarting: false,
    isSubmitting: false,
    hasConsent: consent.hasConsented,
    consentDecision: consent.decision,
    isConsentLoading: consent.loading,
    isFlagEnabled: initialFlagKeys.some((key) => Boolean(flags[key])),
    isDNTEnabled: consent.isDNTEnabled,
    canDisplay:
      initialFlagKeys.some((key) => Boolean(flags[key])) && !consent.isDNTEnabled && consent.decision !== 'declined',
    error: null,
  }));
  const [phaseCompletion, setPhaseCompletion] = useState<{ pre: string | null; post: string | null }>({
    pre: null,
    post: null,
  });
  const [lastSummary, setLastSummary] = useState<string | null>(null);
  const [lastLevel, setLastLevel] = useState<number | null>(null);

  useEffect(() => {
    const keys = resolveFlagKeys(instrument);
    const isFlagEnabled = keys.some((key) => Boolean(flags[key]));
    const canDisplay = isFlagEnabled && !consent.isDNTEnabled && consent.decision !== 'declined';

    setState((prev) => ({
      ...prev,
      isFlagEnabled,
      hasConsent: consent.hasConsented,
      consentDecision: consent.decision,
      isConsentLoading: consent.loading,
      isDNTEnabled: consent.isDNTEnabled,
      canDisplay,
    }));
  }, [flags, instrument, consent.hasConsented, consent.decision, consent.loading, consent.isDNTEnabled]);

  useEffect(() => {
    const computation = state.lastComputation;
    if (computation) {
      setLastSummary(computation.summary);
      setLastLevel(computation.level);
    }
  }, [state.lastComputation]);

  const start = useCallback<UseAssessmentResult['start']>(
    async (locale) => {
      const targetLocale = locale ?? state.locale;
      const shouldDisplay = state.canDisplay || consent.decision === null;

      if (!shouldDisplay) {
        toast({
          title: toastLabels.mustConsent.title,
          description: toastLabels.mustConsent.description,
        });
        return undefined;
      }

      setState((prev) => ({ ...prev, isStarting: true, error: null }));

      try {
        const accessToken = await resolveSessionToken();
        const response = await invokeSupabaseEdge<{ instrument: InstrumentCode; locale: LocaleCode }, unknown>(
          'assess-start',
          {
            payload: { instrument: runtimeInstrument as InstrumentCode, locale: targetLocale },
            accessToken,
          },
        );

        const parsed = startResponseSchema.safeParse(response);
        if (!parsed.success) {
          throw new Error('invalid_catalog_payload');
        }

        const payload = parsed.data;
        const catalog: InstrumentCatalog = {
          code: runtimeInstrument,
          locale: payload.locale,
          name: payload.name,
          version: payload.version,
          expiryMinutes: payload.expiry_minutes,
          items: payload.items.map((item) => ({ ...item })),
        };

        setState((prev) => ({
          ...prev,
          catalog,
          locale: catalog.locale,
          isActive: true,
          currentInstrument: instrument,
          isStarting: false,
          error: null,
        }));

        return catalog;
      } catch (error) {
        console.error('[useAssessment] unable to start', error);
        toast({
          title: toastLabels.unavailable.title,
          description: toastLabels.unavailable.description,
        });
        setState((prev) => ({ ...prev, isStarting: false, error: 'start_failed' }));
        return undefined;
      }
    },
    [consent.decision, state.canDisplay, state.locale, instrument, runtimeInstrument, toast],
  );

  const triggerAssessment = useCallback<UseAssessmentResult['triggerAssessment']>(
    async (instrumentOverride, callbacks) => {
      const targetInstrument = instrumentOverride ?? instrument;
      callbacksRef.current = callbacks ?? null;

      const catalog = state.catalog ?? (await start(state.locale));
      if (!catalog) {
        return false;
      }

      setState((prev) => ({
        ...prev,
        isActive: true,
        currentInstrument: targetInstrument,
      }));

      return true;
    },
    [instrument, start, state.catalog, state.locale],
  );

  const runCallbacks = useCallback(
    (computation: AssessmentComputation) => {
      const callbacks = callbacksRef.current;
      if (!callbacks) return;

      if (instrument === 'WHO5') {
        if (computation.level <= 1) {
          callbacks.onLowWellbeing?.();
        }
        if (computation.level >= 3) {
          callbacks.onOptimalState?.();
        }
      }

      if ((instrument === 'STAI6' || instrument === 'PSS10' || instrument === 'SUDS') && computation.level >= 3) {
        callbacks.onHighActivation?.();
      }
    },
    [instrument],
  );

  const submit = useCallback<UseAssessmentResult['submit']>(
    async (rawAnswers, options) => {
      try {
        const sanitized = sanitizeAnswers(rawAnswers);
        if (!Object.keys(sanitized).length) {
          toast({
            title: toastLabels.answersRequired.title,
            description: toastLabels.answersRequired.description,
          });
          return false;
        }

        setState((prev) => ({ ...prev, isSubmitting: true, error: null }));

        const result = await clinicalScoringService.submitResponse(
          runtimeInstrument,
          sanitized,
          {
            locale: state.locale,
            timestamp: options?.timestamp ?? new Date().toISOString(),
          },
        );

        if (!result.success || !result.computation) {
          throw new Error('submit_failed');
        }

        const phase = options?.phase;
        runCallbacks(result.computation);
        queryClient.invalidateQueries({ queryKey: HISTORY_QUERY_KEY(instrument) }).catch(() => undefined);

        if (phase) {
          const generatedAt = result.computation.generatedAt;
          setPhaseCompletion((prev) => ({
            pre: phase === 'pre' ? generatedAt : prev.pre,
            post: phase === 'pre' ? null : phase === 'post' ? generatedAt : prev.post,
          }));
        }

        setLastSummary(result.computation.summary);
        setLastLevel(result.computation.level);

        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          isActive: false,
          lastComputation: result.computation,
          lastCompletedAt: result.computation.generatedAt,
        }));

        return true;
      } catch (error) {
        console.error('[useAssessment] submit error', error);
        toast({
          title: toastLabels.submitError.title,
          description: toastLabels.submitError.description,
        });
        setState((prev) => ({ ...prev, isSubmitting: false, error: 'submit_failed' }));
        return false;
      }
    },
    [instrument, queryClient, runCallbacks, runtimeInstrument, state.locale, toast],
  );

  const grantConsent = useCallback(async () => {
    await consent.grantConsent();
    setState((prev) => ({ ...prev, hasConsent: true, consentDecision: 'granted' }));
  }, [consent]);

  const declineConsent = useCallback(async () => {
    await consent.declineConsent();
    setState((prev) => ({ ...prev, hasConsent: false, consentDecision: 'declined', isActive: false }));
  }, [consent]);

  const reset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isActive: false,
      currentInstrument: null,
      error: null,
    }));
    setPhaseCompletion({ pre: null, post: null });
    callbacksRef.current = null;
  }, []);

  const lastSubscaleLevel = useCallback(
    (subscale: 'tension' | 'fatigue' | 'vigor') => {
      const summary = state.lastComputation?.summary;
      if (summary) {
        const inferred = inferSubscaleLevelFromSummary(summary, subscale);
        if (typeof inferred === 'number') {
          return inferred;
        }
      }
      return state.lastComputation?.level ?? undefined;
    },
    [state.lastComputation],
  );

  const isDue = useCallback<UseAssessmentResult['isDue']>(
    (phase) => {
      if (!state.canDisplay || !state.isFlagEnabled || !state.hasConsent) {
        return false;
      }

      if (phase === 'pre') {
        if (!phaseCompletion.pre) {
          return true;
        }
        const last = new Date(phaseCompletion.pre).getTime();
        if (Number.isNaN(last)) {
          return true;
        }
        return Date.now() - last > PRE_CHECK_COOLDOWN_MS;
      }

      if (!phaseCompletion.pre) {
        const lastCompletedAt = state.lastCompletedAt;
        if (!lastCompletedAt) {
          return true;
        }

        const last = new Date(lastCompletedAt).getTime();
        if (Number.isNaN(last)) {
          return true;
        }

        return Date.now() - last >= 30 * 60 * 1000;
      }

      const preTime = new Date(phaseCompletion.pre).getTime();
      if (Number.isNaN(preTime)) {
        return false;
      }

      if (phaseCompletion.post) {
        return false;
      }

      return Date.now() - preTime < POST_CHECK_WINDOW_MS;
    },
    [
      phaseCompletion.post,
      phaseCompletion.pre,
      state.canDisplay,
      state.hasConsent,
      state.isFlagEnabled,
      state.lastCompletedAt,
    ],
  );

  return useMemo<UseAssessmentResult>(
    () => ({
      instrument,
      state,
      isEligible: state.canDisplay,
      isDue,
      start,
      triggerAssessment,
      submit,
      submitResponse: submit,
      grantConsent,
      declineConsent,
      reset,
      lastSubscaleLevel,
      lastLevel,
      lastSummary,
    }),
    [
      declineConsent,
      grantConsent,
      instrument,
      isDue,
      lastLevel,
      lastSubscaleLevel,
      lastSummary,
      start,
      state,
      submit,
      triggerAssessment,
      reset,
    ],
  );
};
