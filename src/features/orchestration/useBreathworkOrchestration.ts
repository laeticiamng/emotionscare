// @ts-nocheck
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { captureException } from '@/lib/ai-monitoring';

import { useAssessment, type UseAssessmentResult } from '@/hooks/useAssessment';
import { logger } from '@/lib/logger';

export type BreathProfile = 'calm_soft' | 'standard_soft' | 'long_exhale_focus';
export type Mode = 'default' | 'sleep_preset';
export type Next = 'none' | 'offer_more_silence';

export interface BreathworkOrch {
  staiPreDue: boolean;
  isiDue: boolean;
  startStaiPre: () => Promise<void>;
  startIsi: () => Promise<void>;
  profile: BreathProfile;
  mode: Mode;
  ambience: 'very_soft' | 'soft' | 'standard';
  guidance: 'none' | 'soft_anchor' | 'long_exhale';
  next: Next;
  summaryLabel: string;
  assessments: {
    stai: UseAssessmentResult;
    isi: UseAssessmentResult;
  };
}

const STAI_INTERVAL_HOURS = 6;
const ISI_INTERVAL_DAYS = 7;

const SUMMARY_FALLBACK: Record<BreathProfile, string> = {
  calm_soft: 'Respire doucement, laisse la détente s’installer.',
  standard_soft: 'Ton souffle s’équilibre, garde le rythme feutré.',
  long_exhale_focus: 'Allonge chaque sortie d’air, la tension s’en va.',
};

const resolveProfile = (level: number | null | undefined): BreathProfile => {
  if (typeof level !== 'number') {
    return 'calm_soft';
  }
  if (level >= 3) {
    return 'long_exhale_focus';
  }
  if (level === 2) {
    return 'standard_soft';
  }
  return 'calm_soft';
};

const resolveAmbience = (profile: BreathProfile): 'very_soft' | 'soft' | 'standard' => {
  switch (profile) {
    case 'long_exhale_focus':
      return 'very_soft';
    case 'standard_soft':
      return 'soft';
    default:
      return 'standard';
  }
};

const resolveGuidance = (profile: BreathProfile): 'none' | 'soft_anchor' | 'long_exhale' => {
  switch (profile) {
    case 'long_exhale_focus':
      return 'long_exhale';
    case 'standard_soft':
      return 'soft_anchor';
    default:
      return 'none';
  }
};

const sanitizeSummary = (summary: string | undefined, profile: BreathProfile) => {
  const base = summary?.replace(/\d+/g, '').replace(/\s{2,}/g, ' ').trim();
  if (base && base.length > 0) {
    return base;
  }
  return SUMMARY_FALLBACK[profile];
};

const hoursBetween = (from?: string) => {
  if (!from) return Number.POSITIVE_INFINITY;
  const fromDate = new Date(from);
  if (Number.isNaN(fromDate.getTime())) return Number.POSITIVE_INFINITY;
  const diffMs = Date.now() - fromDate.getTime();
  return diffMs / (1000 * 60 * 60);
};

const daysBetween = (from?: string) => {
  if (!from) return Number.POSITIVE_INFINITY;
  const fromDate = new Date(from);
  if (Number.isNaN(fromDate.getTime())) return Number.POSITIVE_INFINITY;
  const diffMs = Date.now() - fromDate.getTime();
  return diffMs / (1000 * 60 * 60 * 24);
};

const isEveningNow = () => {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 18 || hour < 6;
};

const addBreadcrumb = (message: string, data?: Record<string, unknown>) => {
  logger.info(message, data, 'BREATH');
};

export const useBreathworkOrchestration = (): BreathworkOrch => {
  const stai = useAssessment('STAI6');
  const isi = useAssessment('ISI');

  const [next, setNext] = useState<Next>('none');
  const staiPromptShownRef = useRef(false);
  const isiPromptShownRef = useRef(false);
  const staiSubmissionRef = useRef<string | null>(null);
  const isiSubmissionRef = useRef<string | null>(null);
  const previousLevelRef = useRef<number | null>(null);

  const staiLevel = stai.state.lastComputation?.level ?? null;
  const isiLevel = isi.state.lastComputation?.level ?? null;

  const profile = useMemo(() => resolveProfile(staiLevel), [staiLevel]);
  const ambience = useMemo(() => resolveAmbience(profile), [profile]);
  const guidance = useMemo(() => resolveGuidance(profile), [profile]);

  const summaryLabel = useMemo(
    () => sanitizeSummary(stai.state.lastComputation?.summary, profile),
    [profile, stai.state.lastComputation?.summary],
  );

  const staiPreDue = useMemo(() => {
    if (!stai.state.canDisplay) return false;
    const hours = hoursBetween(stai.state.lastCompletedAt);
    return hours >= STAI_INTERVAL_HOURS;
  }, [stai.state.canDisplay, stai.state.lastCompletedAt]);

  const isiDue = useMemo(() => {
    if (!isi.state.canDisplay) return false;
    const days = daysBetween(isi.state.lastCompletedAt);
    return days >= ISI_INTERVAL_DAYS;
  }, [isi.state.canDisplay, isi.state.lastCompletedAt]);

  const mode: Mode = useMemo(() => {
    if (typeof isiLevel === 'number' && isiLevel >= 3 && isEveningNow()) {
      return 'sleep_preset';
    }
    return 'default';
  }, [isiLevel]);

  useEffect(() => {
    addBreadcrumb(`breath:profile:${profile}`, { profile });
  }, [profile]);

  useEffect(() => {
    if (staiPreDue && !staiPromptShownRef.current) {
      staiPromptShownRef.current = true;
      addBreadcrumb('stai6:pre:shown', { instrument: 'STAI6' });
    }
    if (!staiPreDue) {
      staiPromptShownRef.current = false;
    }
  }, [staiPreDue]);

  useEffect(() => {
    if (isiDue && !isiPromptShownRef.current) {
      isiPromptShownRef.current = true;
      addBreadcrumb('isi:shown', { instrument: 'ISI' });
    }
    if (!isiDue) {
      isiPromptShownRef.current = false;
    }
  }, [isiDue]);

  useEffect(() => {
    const generatedAt = stai.state.lastComputation?.generatedAt ?? null;
    if (generatedAt && generatedAt !== staiSubmissionRef.current) {
      staiSubmissionRef.current = generatedAt;
      addBreadcrumb('stai6:pre:submitted', { instrument: 'STAI6' });
    }
  }, [stai.state.lastComputation?.generatedAt]);

  useEffect(() => {
    const generatedAt = isi.state.lastComputation?.generatedAt ?? null;
    if (generatedAt && generatedAt !== isiSubmissionRef.current) {
      isiSubmissionRef.current = generatedAt;
      addBreadcrumb('isi:submitted', { instrument: 'ISI' });
    }
  }, [isi.state.lastComputation?.generatedAt]);

  useEffect(() => {
    if (typeof staiLevel === 'number') {
      if (previousLevelRef.current !== null && staiLevel < previousLevelRef.current) {
        setNext('offer_more_silence');
        addBreadcrumb('breath:next:more_silence', { previous: previousLevelRef.current, current: staiLevel });
      }
      previousLevelRef.current = staiLevel;
    }
  }, [staiLevel]);

  const startStaiPre = useCallback(async () => {
    if (!stai.state.canDisplay) return;
    try {
      if (!stai.state.hasConsent) {
        await stai.grantConsent();
      }
      await stai.triggerAssessment('STAI6');
    } catch (error) {
      logger.error('[BreathworkOrchestration] unable to start STAI-6', error as Error, 'SYSTEM');
      Sentry.captureException(error);
    }
  }, [stai]);

  const startIsi = useCallback(async () => {
    if (!isi.state.canDisplay) return;
    try {
      if (!isi.state.hasConsent) {
        await isi.grantConsent();
      }
      await isi.triggerAssessment('ISI');
    } catch (error) {
      logger.error('[BreathworkOrchestration] unable to start ISI', error as Error, 'SYSTEM');
      Sentry.captureException(error);
    }
  }, [isi]);

  useEffect(() => {
    if (!staiPreDue) {
      previousLevelRef.current = staiLevel ?? null;
      setNext('none');
    }
  }, [staiPreDue, staiLevel]);

  return useMemo(
    () => ({
      staiPreDue,
      isiDue,
      startStaiPre,
      startIsi,
      profile,
      mode,
      ambience,
      guidance,
      next,
      summaryLabel,
      assessments: { stai, isi },
    }),
    [ambience, guidance, isi, isiDue, mode, next, profile, stai, staiPreDue, startIsi, startStaiPre, summaryLabel],
  );
};

export default useBreathworkOrchestration;
