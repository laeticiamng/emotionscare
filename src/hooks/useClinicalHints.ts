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
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { supabase } from '@/integrations/supabase/client';
import { deriveToneFromLevel } from '@/features/dashboard/orchestration/weeklyPlanMapper';

const signalSchema = z.object({
  id: z.string(),
  source_instrument: z.string(),
  domain: z.string(),
  level: z.number().int().nonnegative(),
  module_context: z.string(),
  metadata: z.record(z.any()).nullable().optional(),
  created_at: z.string(),
  expires_at: z.string(),
});

const assessmentSchema = z.object({
  instrument: z.string(),
  score_json: z.object({
    summary: z.string(),
    level: z.number().int().min(0).max(4),
    generated_at: z.string().optional(),
  }),
  submitted_at: z.string().optional(),
  ts: z.string().optional(),
});

const TRACKED_INSTRUMENTS = ['WHO5', 'SAM', 'STAI6', 'POMS', 'POMS_TENSION', 'SUDS'] as const;

type TrackedInstrument = (typeof TRACKED_INSTRUMENTS)[number];

type ClinicalTone = 'delicate' | 'steady' | 'energized';
type DurationHint = 'short' | 'standard' | 'extended';
type IntensityHint = 'low' | 'medium' | 'high';
type MicroGestureHint = 'long_exhale' | 'shoulder_release' | 'soft_smile';

type AssessmentSnapshot = {
  summary: string;
  level: number;
  recordedAt: string;
};

type AssessmentMap = Partial<Record<TrackedInstrument, AssessmentSnapshot>>;

type ClinicalSignal = z.infer<typeof signalSchema>;

type ModuleCueMap = {
  dashboard?: {
    tone: ClinicalTone;
    cta?: { label: string; to: string } | null;
  };
  nyvee?: {
    autoGrounding: boolean;
    groundingLabel: string;
  };
  scan?: {
    shouldDispatchMood: boolean;
    tone: ClinicalTone;
    intensity: IntensityHint;
    microGesture: MicroGestureHint;
    microGestureLabel: string;
  };
  music?: {
    texture: 'airy' | 'warm' | 'bright';
    intensity: IntensityHint;
    recommendedCategory: 'doux' | 'créatif' | 'énergique' | 'guérison';
    resumeLabel: string;
  };
  flashGlow?: {
    extendDuration: boolean;
    exitMode: 'soft' | 'default';
    companionPath: string;
  };
};

export interface ClinicalHintsSnapshot {
  tone: ClinicalTone;
  duration: DurationHint;
  intensity: IntensityHint;
  nextCta: string | null;
  fallback2D: boolean;
  summaries: {
    wellbeing?: string;
    mood?: string;
    anxiety?: string;
    stress?: string;
  };
  moduleCues: ModuleCueMap;
}

interface DeriveHintsParams {
  assessments: AssessmentMap;
  signals: ClinicalSignal[];
  prefersReducedMotion: boolean;
}

const resolveSummary = (assessments: AssessmentMap, code: TrackedInstrument) =>
  assessments[code];

const isHighAnxiety = (signals: ClinicalSignal[], stai?: AssessmentSnapshot | null) => {
  if (stai) {
    const normalized = stai.summary.toLowerCase();
    if (normalized.includes('tension') || normalized.includes('apaisement')) {
      return true;
    }
  }

  return signals.some(
    signal => signal.domain === 'anxiety' && signal.level >= 3,
  );
};

const hasElevatedStress = (assessments: AssessmentMap) => {
  const suds = resolveSummary(assessments, 'SUDS');
  if (!suds) return false;
  return suds.level >= 3;
};

const resolveToneFromWho5 = (who5?: AssessmentSnapshot): ClinicalTone => {
  if (!who5) return 'steady';
  const level = Math.max(0, Math.min(4, who5.level)) as 0 | 1 | 2 | 3 | 4;
  return deriveToneFromLevel(level);
};

const resolveDuration = (
  tone: ClinicalTone,
  hasStressExtension: boolean,
  highAnxiety: boolean,
): DurationHint => {
  if (hasStressExtension || highAnxiety) {
    return 'extended';
  }
  if (tone === 'energized') {
    return 'short';
  }
  return 'standard';
};

const resolveIntensity = (
  tone: ClinicalTone,
  hasStressExtension: boolean,
  highAnxiety: boolean,
): IntensityHint => {
  if (hasStressExtension || highAnxiety) {
    return 'low';
  }
  if (tone === 'energized') {
    return 'high';
  }
  return 'medium';
};

const resolveMusicTexture = (poms?: AssessmentSnapshot) => {
  if (!poms) {
    return {
      texture: 'warm' as const,
      intensity: 'medium' as IntensityHint,
      recommendedCategory: 'créatif' as const,
    };
  }

  if (poms.level <= 1) {
    return {
      texture: 'airy' as const,
      intensity: 'low' as IntensityHint,
      recommendedCategory: 'doux' as const,
    };
  }

  if (poms.level >= 3) {
    return {
      texture: 'bright' as const,
      intensity: 'high' as IntensityHint,
      recommendedCategory: 'énergique' as const,
    };
  }

  return {
    texture: 'warm' as const,
    intensity: 'medium' as IntensityHint,
    recommendedCategory: 'créatif' as const,
  };
};

const resolveScanGesture = (sam?: AssessmentSnapshot, highAnxiety?: boolean): MicroGestureHint => {
  if (highAnxiety || !sam) {
    return 'long_exhale';
  }

  if (sam.level >= 3) {
    return 'soft_smile';
  }

  return 'shoulder_release';
};

export const deriveClinicalHints = ({
  assessments,
  signals,
  prefersReducedMotion,
}: DeriveHintsParams): ClinicalHintsSnapshot => {
  const who5 = resolveSummary(assessments, 'WHO5');
  const sam = resolveSummary(assessments, 'SAM');
  const stai = resolveSummary(assessments, 'STAI6');
  const suds = resolveSummary(assessments, 'SUDS');
  const poms = resolveSummary(assessments, 'POMS_TENSION') ?? resolveSummary(assessments, 'POMS');

  const tone = resolveToneFromWho5(who5);
  const anxietyHigh = isHighAnxiety(signals, stai);
  const stressElevated = hasElevatedStress(assessments);

  const duration = resolveDuration(tone, stressElevated, anxietyHigh);
  const intensity = resolveIntensity(tone, stressElevated, anxietyHigh);

  const nextCta = tone === 'delicate' ? 'Respirer 1 min' : tone === 'energized' ? 'Explorer un module créatif' : 'Continuer en douceur';

  const fallback2D = prefersReducedMotion || stressElevated;

  const musicPreset = resolveMusicTexture(poms);
  const microGesture = resolveScanGesture(sam, anxietyHigh);

  const summaries = {
    wellbeing: who5?.summary,
    mood: sam?.summary,
    anxiety: stai?.summary,
    stress: suds?.summary,
  };

  const moduleCues: ModuleCueMap = {
    dashboard: {
      tone,
      cta: tone === 'delicate' ? { label: 'Respirer 1 min', to: '/app/breath' } : null,
    },
    nyvee: {
      autoGrounding: Boolean(stai && stai.summary.toLowerCase().includes('tension')),
      groundingLabel: 'Routine 5-4-3-2-1',
    },
    scan: {
      shouldDispatchMood: Boolean(sam),
      tone,
      intensity,
      microGesture,
      microGestureLabel:
        microGesture === 'long_exhale'
          ? 'Prolonge ton expiration'
          : microGesture === 'shoulder_release'
            ? 'Relâche doucement les épaules'
            : 'Dépose un sourire léger',
    },
    music: {
      texture: musicPreset.texture,
      intensity: musicPreset.intensity,
      recommendedCategory: musicPreset.recommendedCategory,
      resumeLabel: musicPreset.texture === 'airy' ? 'Reprise apaisée' : musicPreset.texture === 'bright' ? 'Reprise dynamique' : 'Reprise chaleureuse',
    },
    flashGlow: {
      extendDuration: stressElevated,
      exitMode: stressElevated ? 'default' : 'soft',
      companionPath: '/app/screen-silk',
    },
  };

  return {
    tone,
    duration,
    intensity,
    nextCta,
    fallback2D,
    summaries,
    moduleCues,
  };
};

const fetchClinicalSignals = async (): Promise<ClinicalSignal[]> => {
  try {
    const { data, error } = await supabase
      .from('clinical_signals')
      .select('id, source_instrument, domain, level, module_context, metadata, created_at, expires_at')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      throw error;
    }

    const parsed = z.array(signalSchema).safeParse(data ?? []);
    if (!parsed.success) {
      throw new Error('invalid_clinical_signals');
    }

    return parsed.data;
  } catch (error) {
    console.error('[useClinicalHints] unable to fetch clinical signals', error);
    return [];
  }
};

const fetchAssessments = async (): Promise<AssessmentMap> => {
  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('instrument, score_json, submitted_at, ts')
      .in('instrument', TRACKED_INSTRUMENTS)
      .order('submitted_at', { ascending: false, nullsFirst: false })
      .order('ts', { ascending: false })
      .limit(20);

    if (error) {
      throw error;
    }

    const parsed = z.array(assessmentSchema).safeParse(data ?? []);
    if (!parsed.success) {
      throw new Error('invalid_assessment_history');
    }

    const result: AssessmentMap = {};

    for (const entry of parsed.data) {
      const instrument = entry.instrument as TrackedInstrument;
      if (result[instrument]) {
        continue;
      }

      result[instrument] = {
        summary: entry.score_json.summary,
        level: entry.score_json.level,
        recordedAt:
          entry.score_json.generated_at ??
          entry.submitted_at ??
          entry.ts ??
          new Date().toISOString(),
      };
    }

    return result;
  } catch (error) {
    console.error('[useClinicalHints] unable to fetch assessments', error);
    return {};
  }
};

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(media.matches);
    update();

    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return prefersReducedMotion;
};

export const useClinicalHints = (): ClinicalHintsSnapshot => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const { data: signals = [] } = useQuery({
    queryKey: ['clinical-signals'],
    queryFn: fetchClinicalSignals,
    staleTime: 60_000,
    enabled: typeof window !== 'undefined',
  });

  const { data: assessments = {} } = useQuery({
    queryKey: ['clinical-assessments'],
    queryFn: fetchAssessments,
    staleTime: 5 * 60_000,
    enabled: typeof window !== 'undefined',
  });

  return useMemo(
    () => deriveClinicalHints({ assessments, signals, prefersReducedMotion }),
    [assessments, signals, prefersReducedMotion],
  );
};

