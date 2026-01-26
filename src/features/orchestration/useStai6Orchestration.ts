// @ts-nocheck
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useAssessment } from '@/hooks/useAssessment';
import { useFlags } from '@/core/flags';
import { logger } from '@/lib/logger';

export type CalmProfile = 'silent_anchor' | 'soft_guided' | 'standard';
export type Guidance = 'none' | 'breath_long_exhale' | 'grounding_soft';

export interface Stai6Orchestration {
  preDue: boolean;
  postDue: boolean;
  startPre: () => Promise<void>;
  startPost: () => Promise<void>;
  sceneProfile: CalmProfile;
  guidance: Guidance;
  summaryLabel: string;
}

const SUMMARY_FALLBACK: Record<number, string> = {
  0: 'calme profond',
  1: 'souffle apaisé',
  2: 'tonus régulier',
  3: 'tension présente',
  4: 'besoin d’apaisement',
};

export const resolveSceneProfile = (level: number): CalmProfile => {
  if (level <= 1) {
    return 'silent_anchor';
  }
  if (level === 2) {
    return 'soft_guided';
  }
  return 'standard';
};

export const resolveGuidance = (level: number): Guidance => {
  if (level <= 1) {
    return 'grounding_soft';
  }
  if (level === 2) {
    return 'breath_long_exhale';
  }
  return 'breath_long_exhale';
};

export const sanitizeSummaryLabel = (label: string | null | undefined, level: number): string => {
  const clean = label?.replace(/\d+/g, '').replace(/\s{2,}/g, ' ').trim();
  if (clean && clean.length > 0) {
    return clean;
  }
  const fallbackLevel = Number.isFinite(level) ? Math.min(Math.max(Math.round(level), 0), 4) : 2;
  return SUMMARY_FALLBACK[fallbackLevel as keyof typeof SUMMARY_FALLBACK];
};

const logBreadcrumb = (message: string, data?: Record<string, unknown>) => {
  logger.info(message, data, 'NYVEE');
};

export const useStai6Orchestration = (): Stai6Orchestration => {
  const assessment = useAssessment('STAI6');
  const { has } = useFlags();
  const lastPhaseRef = useRef<'pre' | 'post' | null>(null);
  const previousDueRef = useRef<{ pre: boolean; post: boolean }>({ pre: false, post: false });

  const level = assessment.lastLevel ?? 2;
  const summaryLabel = sanitizeSummaryLabel(assessment.lastSummary, level);

  const sceneProfile = useMemo(() => resolveSceneProfile(level), [level]);
  const guidance = useMemo(() => resolveGuidance(level), [level]);

  const featureEnabled = has('FF_ASSESS_STAI6');
  const preDue = featureEnabled && assessment.isDue('pre');
  const postDue = featureEnabled && assessment.isDue('post');

  useEffect(() => {
    const previous = previousDueRef.current;
    if (previous.pre && !preDue) {
      logBreadcrumb('stai6:pre:submitted');
      lastPhaseRef.current = 'pre';
    }
    if (previous.post && !postDue) {
      logBreadcrumb('stai6:post:submitted');
      lastPhaseRef.current = 'post';
    }
    previousDueRef.current = { pre: preDue, post: postDue };
  }, [preDue, postDue]);

  const startPre = useCallback(async () => {
    if (!featureEnabled) {
      return;
    }
    try {
      await assessment.start();
      lastPhaseRef.current = 'pre';
    } catch (error) {
      logger.error('[useStai6Orchestration] unable to start pre STAI-6', error as Error, 'SYSTEM');
    }
  }, [assessment, featureEnabled]);

  const startPost = useCallback(async () => {
    if (!featureEnabled) {
      return;
    }
    try {
      await assessment.start();
      lastPhaseRef.current = 'post';
    } catch (error) {
      logger.error('[useStai6Orchestration] unable to start post STAI-6', error as Error, 'SYSTEM');
    }
  }, [assessment, featureEnabled]);

  return {
    preDue,
    postDue,
    startPre,
    startPost,
    sceneProfile,
    guidance,
    summaryLabel,
  };
};

export default useStai6Orchestration;
