import { captureException } from '@/lib/ai-monitoring';
import { logger } from '@/lib/logger';
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

  logger.info('session:log:start', { type: payload.type, durationSec }, 'SESSION');

  try {
    // Récupérer l'utilisateur courant
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Utiliser breathing_vr_sessions au lieu de sessions
    const insertPayload = {
      user_id: user.id,
      pattern: (payload.metadata?.profile as string) || 'default',
      duration_seconds: durationSec,
      mood_before: typeof payload.metadata?.mood_before === 'number' ? payload.metadata.mood_before : null,
      mood_after: typeof payload.moodDelta === 'number' ? (payload.metadata?.mood_before as number ?? 5) + payload.moodDelta : null,
      notes: payload.metadata?.notes as string ?? null,
      vr_mode: payload.metadata?.mode === 'vr',
      started_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('breathing_vr_sessions')
      .insert(insertPayload)
      .select('id')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    result.sessionId = data?.id ?? null;

    logger.info('session:log:complete', { type: payload.type, sessionId: result.sessionId ?? undefined }, 'SESSION');
  } catch (error) {
    const normalizedError = error instanceof Error ? error : new Error('Unknown session logging error');
    result.errors.session = normalizedError;
    captureException(normalizedError, {
      feature: 'breath',
      session: { type: payload.type, durationSec },
    });
    logger.error('session:log:error', normalizedError, 'SESSION');
  }

  if (payload.journalText && typeof window !== 'undefined') {
    logger.info('journal:auto:start', { type: payload.type }, 'JOURNAL');

    try {
      const entry = await journalService.saveEntry({
        type: 'text',
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

      if (entry) {
        logger.info('journal:auto:success', { entryId: entry.id }, 'JOURNAL');
      }
    } catch (error) {
      const normalizedError = error instanceof Error ? error : new Error('Unknown journal error');
      result.errors.journal = normalizedError;
      logger.error('journal:auto:error', normalizedError, 'JOURNAL');
    }
  }

  return result;
}
