// @ts-nocheck
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Sentry from '@sentry/react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

import { useAssessment } from '@/hooks/useAssessment';
import { useAssessmentHistory } from '@/hooks/useAssessmentHistory';
import { useConsent } from '@/features/clinical-optin/ConsentProvider';
import { useFlags } from '@/core/flags';
import { logger } from '@/lib/logger';

export type Who5Tone = 'very_low' | 'low' | 'neutral' | 'high' | 'very_high';

export interface Who5Orchestration {
  due: boolean;
  start: () => Promise<void>;
  apply: () => void;
  tone: Who5Tone;
  primaryCta: 'breath_soft' | 'nyvee_calm' | 'journal_light' | 'music_soft' | 'scan' | 'coach_micro';
  cardOrder: string[];
  summaryLabel: string;
  snooze: (durationHours?: number) => void;
}

dayjs.extend(isoWeek);

const SNOOZE_STORAGE_KEY = 'who5.invite.snooze_until';
const DEFAULT_SUMMARY = 'équilibre stable';

type CardOrderMapping = Record<Who5Tone, string[]>;

type PrimaryCtaMapping = Record<Who5Tone, Who5Orchestration['primaryCta']>;

const CARD_ORDER: CardOrderMapping = {
  very_low: ['card-nyvee', 'card-breath', 'card-music', 'card-journal', 'card-scan', 'card-coach'],
  low: ['card-nyvee', 'card-breath', 'card-journal', 'card-music', 'card-scan', 'card-coach'],
  neutral: ['card-scan', 'card-journal', 'card-music', 'card-nyvee', 'card-breath', 'card-coach'],
  high: ['card-music', 'card-journal', 'card-scan', 'card-nyvee', 'card-coach', 'card-breath'],
  very_high: ['card-coach', 'card-music', 'card-scan', 'card-journal', 'card-nyvee', 'card-breath'],
};

const PRIMARY_CTA: PrimaryCtaMapping = {
  very_low: 'breath_soft',
  low: 'nyvee_calm',
  neutral: 'scan',
  high: 'music_soft',
  very_high: 'coach_micro',
};

const clampLevel = (value: number): 0 | 1 | 2 | 3 | 4 => {
  if (value <= 0) return 0;
  if (value === 1) return 1;
  if (value === 2) return 2;
  if (value === 3) return 3;
  return 4;
};

const resolveTone = (level: number): Who5Tone => {
  const safeLevel = clampLevel(level);
  if (safeLevel === 0) return 'very_low';
  if (safeLevel === 1) return 'low';
  if (safeLevel === 2) return 'neutral';
  if (safeLevel === 3) return 'high';
  return 'very_high';
};

const sanitizeSummary = (summary?: string | null): string => {
  if (!summary) {
    return DEFAULT_SUMMARY;
  }
  const cleaned = summary.replace(/\d/g, '').trim();
  return cleaned.length ? cleaned : DEFAULT_SUMMARY;
};

const readStoredSnooze = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const value = window.localStorage.getItem(SNOOZE_STORAGE_KEY);
    return value ?? null;
  } catch (error) {
    logger.warn('[who5] unable to read snooze value', error as Error, 'SYSTEM');
    return null;
  }
};

const persistSnooze = (value: string | null) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    if (!value) {
      window.localStorage.removeItem(SNOOZE_STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(SNOOZE_STORAGE_KEY, value);
  } catch (error) {
    logger.warn('[who5] unable to persist snooze value', error as Error, 'SYSTEM');
  }
};

const isoWeekKey = (date: dayjs.Dayjs) => `${date.isoWeekYear()}-${date.isoWeek()}`;

interface DueComputationInput {
  lastCompletedAt?: string;
  snoozedUntil?: string | null;
  hasConsent: boolean;
  isFlagEnabled: boolean;
  canDisplay: boolean;
  zeroNumbersReady: boolean;
  now?: dayjs.Dayjs;
}

export const isWho5Due = ({
  lastCompletedAt,
  snoozedUntil,
  hasConsent,
  isFlagEnabled,
  canDisplay,
  zeroNumbersReady,
  now = dayjs(),
}: DueComputationInput): boolean => {
  if (!hasConsent || !isFlagEnabled || !canDisplay || !zeroNumbersReady) {
    return false;
  }

  if (snoozedUntil) {
    const snoozeDate = dayjs(snoozedUntil);
    if (snoozeDate.isValid() && snoozeDate.isAfter(now)) {
      return false;
    }
  }

  if (!lastCompletedAt) {
    return true;
  }

  const lastDate = dayjs(lastCompletedAt);
  if (!lastDate.isValid()) {
    return true;
  }

  return isoWeekKey(lastDate) !== isoWeekKey(now);
};

export const getToneFromLevel = (level: number): Who5Tone => resolveTone(level);

export const getPrimaryCtaFromLevel = (level: number): Who5Orchestration['primaryCta'] => {
  const tone = resolveTone(level);
  return PRIMARY_CTA[tone];
};

export const getCardOrderFromLevel = (level: number): string[] => {
  const tone = resolveTone(level);
  return CARD_ORDER[tone];
};

export function useWho5Orchestration(): Who5Orchestration {
  const { status } = useConsent();
  const hasClinicalConsent = status === 'accepted';
  const { flags } = useFlags();
  const zeroNumbersReady = flags.FF_ZERO_NUMBERS ?? true;
  const who5Assessment = useAssessment('WHO5');
  const history = useAssessmentHistory('WHO5', {
    limit: 1,
    enabled: hasClinicalConsent && who5Assessment.state.canDisplay,
  });

  const [snoozedUntil, setSnoozedUntil] = useState<string | null>(() => readStoredSnooze());

  useEffect(() => {
    persistSnooze(snoozedUntil);
  }, [snoozedUntil]);

  const lastHistoryEntry = history.data?.[0];
  const lastComputation = who5Assessment.state.lastComputation;
  const lastLevel = lastComputation?.level ?? lastHistoryEntry?.level ?? 2;
  const tone = resolveTone(lastLevel);
  const cardOrder = CARD_ORDER[tone];
  const primaryCta = PRIMARY_CTA[tone];
  const summaryLabel = sanitizeSummary(lastComputation?.summary ?? lastHistoryEntry?.summary ?? DEFAULT_SUMMARY);
  const lastCompletedAt = who5Assessment.state.lastCompletedAt ?? lastHistoryEntry?.timestamp;

  const due = useMemo(
    () =>
      isWho5Due({
        lastCompletedAt,
        snoozedUntil,
        hasConsent: hasClinicalConsent,
        isFlagEnabled: who5Assessment.state.isFlagEnabled,
        canDisplay: who5Assessment.state.canDisplay,
        zeroNumbersReady,
      }),
    [hasClinicalConsent, lastCompletedAt, snoozedUntil, who5Assessment.state.canDisplay, who5Assessment.state.isFlagEnabled, zeroNumbersReady],
  );

  const inviteLoggedRef = useRef<string | null>(null);
  const submittedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!due) {
      return;
    }
    const now = dayjs();
    const key = isoWeekKey(now);
    if (inviteLoggedRef.current === key) {
      return;
    }
    inviteLoggedRef.current = key;
    Sentry.addBreadcrumb({ category: 'who5', message: 'who5:invite_shown', level: 'info', data: { tone } });
  }, [due, tone]);

  useEffect(() => {
    if (!lastCompletedAt) {
      return;
    }
    if (submittedRef.current === lastCompletedAt) {
      return;
    }
    submittedRef.current = lastCompletedAt;
    setSnoozedUntil(null);
    Sentry.addBreadcrumb({ category: 'who5', message: 'who5:submitted', level: 'info', data: { tone } });
  }, [lastCompletedAt, tone]);

  const start = useCallback(async () => {
    Sentry.addBreadcrumb({ category: 'who5', message: 'who5:start_clicked', level: 'info', data: { tone } });
    await who5Assessment.start();
  }, [tone, who5Assessment]);

  const apply = useCallback(() => {
    Sentry.addBreadcrumb({ category: 'who5', message: 'who5:applied', level: 'info', data: { tone, level: clampLevel(lastLevel) } });
  }, [lastLevel, tone]);

  const snooze = useCallback(
    (durationHours = 48) => {
      const until = dayjs().add(durationHours, 'hour').toISOString();
      setSnoozedUntil(until);
      Sentry.addBreadcrumb({ category: 'who5', message: 'who5:skipped', level: 'info', data: { tone, durationHours } });
    },
    [tone],
  );

  return {
    due,
    start,
    apply,
    tone,
    primaryCta,
    cardOrder,
    summaryLabel,
    snooze,
  };
}

export type { CardOrderMapping };
