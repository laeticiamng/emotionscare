import * as Sentry from '@sentry/react';
import { supabase } from '@/integrations/supabase/client';
import { journalService } from '@/modules/journal/journalService';
import type { JournalEntry } from '@/modules/journal/journalService';

export interface LogAndJournalPayload {
  type: 'breath';
  durationSec: number;
  moodDelta?: number | null;
  journalText?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface LogAndJournalResult {
  sessionId?: string | null;
  journalEntry?: JournalEntry | null;
  errors: {
    session?: Error;
    journal?: Error;
  };
}

const clampDuration = (durationSec: number): number => {
  if (!Number.isFinite(durationSec) || durationSec <= 0) {
    return 1;
  }
  return Math.min(60 * 60, Math.max(1, Math.round(durationSec)));
};

export async function logAndJournal(payload: LogAndJournalPayload): Promise<LogAndJournalResult> {
  const result: LogAndJournalResult = { errors: {} };
  const durationSec = clampDuration(payload.durationSec);

  Sentry.addBreadcrumb({
    category: 'session',
    level: 'info',
    message: 'session:log:start',
    data: { type: payload.type, durationSec },
  });

  try {
    const insertPayload = {
      type: payload.type,
      duration_sec: durationSec,
      mood_delta: typeof payload.moodDelta === 'number' ? payload.moodDelta : null,
      meta: payload.metadata ?? null,
    } as const;

    const { data, error } = await supabase
      .from('sessions')
      .insert(insertPayload)
      .select('id')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    result.sessionId = data?.id ?? null;

    Sentry.addBreadcrumb({
      category: 'session',
      level: 'info',
      message: 'session:log:complete',
      data: { type: payload.type, sessionId: result.sessionId ?? undefined },
    });
  } catch (error) {
    const normalizedError = error instanceof Error ? error : new Error('Unknown session logging error');
    result.errors.session = normalizedError;
    Sentry.captureException(normalizedError, {
      tags: { feature: 'breath' },
      contexts: { session: { type: payload.type, durationSec } },
    });
  }

  if (payload.journalText && typeof window !== 'undefined') {
    Sentry.addBreadcrumb({
      category: 'journal',
      level: 'info',
      message: 'journal:auto:start',
      data: { type: payload.type },
    });

    try {
      const entry = await journalService.saveEntry({
        content: payload.journalText,
        summary: 'Session de respiration guidée',
        tone: payload.moodDelta !== undefined && payload.moodDelta !== null && payload.moodDelta < 0 ? 'negative' : 'positive',
        ephemeral: false,
        duration: durationSec,
        metadata: {
          module: payload.type,
          mood_delta: payload.moodDelta ?? null,
          source: 'breath-guided',
        },
      });

      result.journalEntry = entry;

      Sentry.addBreadcrumb({
        category: 'journal',
        level: 'info',
        message: 'journal:auto:success',
        data: { entryId: entry.id },
      });
    } catch (error) {
      const normalizedError = error instanceof Error ? error : new Error('Unknown journal error');
      result.errors.journal = normalizedError;
      Sentry.addBreadcrumb({
        category: 'journal',
        level: 'error',
        message: 'journal:auto:error',
        data: { reason: normalizedError.message },
      });
    }
  }

  return result;
}
