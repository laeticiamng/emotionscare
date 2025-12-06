import * as Sentry from '@sentry/react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useMoodStore } from '@/hooks/useMood';

type ActivityInsert = Database['public']['Tables']['user_activity_sessions']['Insert'];
type JournalInsert = Database['public']['Tables']['journal_entries']['Insert'];
type ActivityRow = Database['public']['Tables']['user_activity_sessions']['Row'];
type JournalRow = Database['public']['Tables']['journal_entries']['Row'];

export interface MoodSnapshot {
  valence?: number;
  arousal?: number;
  timestamp?: string;
}

export interface LogAndJournalPayload {
  type: 'flash_glow';
  duration_sec: number;
  mood_delta: number | null;
  journalText: string;
  moodBefore?: MoodSnapshot | null;
  moodAfter?: MoodSnapshot | null;
  metadata?: Record<string, unknown>;
}

export interface LogAndJournalResult {
  activity: ActivityRow;
  journal: JournalRow;
}

export function getCurrentMoodSnapshot(): MoodSnapshot {
  try {
    const { valence, arousal, timestamp } = useMoodStore.getState();
    return {
      valence: Number.isFinite(valence) ? Number(valence) : undefined,
      arousal: Number.isFinite(arousal) ? Number(arousal) : undefined,
      timestamp,
    };
  } catch {
    return {};
  }
}

const clampValence = (value: number | undefined): number | null => {
  if (!Number.isFinite(value)) {
    return null;
  }
  return Math.max(-100, Math.min(100, Math.round(value as number)));
};

const clampArousal = (value: number | undefined): number | null => {
  if (!Number.isFinite(value)) {
    return null;
  }
  return Math.max(0, Math.min(100, Math.round(value as number)));
};

const computeMoodScore = (snapshot?: MoodSnapshot | null): number | null => {
  if (!snapshot) {
    return null;
  }

  const valence = clampValence(snapshot.valence);
  const arousal = clampArousal(snapshot.arousal);

  if (valence === null && arousal === null) {
    return null;
  }

  const valenceScore = valence === null ? 50 : (valence + 100) / 2; // -100..100 -> 0..100
  const arousalScore = arousal === null ? 50 : arousal; // déjà 0..100

  const weighted = 0.6 * valenceScore + 0.4 * arousalScore;
  return Math.round(weighted);
};

export function computeMoodDelta(
  before?: MoodSnapshot | null,
  after?: MoodSnapshot | null,
): number | null {
  const beforeScore = computeMoodScore(before);
  const afterScore = computeMoodScore(after);

  if (beforeScore === null || afterScore === null) {
    return null;
  }

  return Math.round(afterScore - beforeScore);
}

const moodSnapshotToString = (snapshot?: MoodSnapshot | null): string | null => {
  if (!snapshot) {
    return null;
  }

  const valence = clampValence(snapshot.valence);
  const arousal = clampArousal(snapshot.arousal);

  if (valence === null && arousal === null) {
    return null;
  }

  return JSON.stringify({
    valence,
    arousal,
    timestamp: snapshot.timestamp ?? new Date().toISOString(),
  });
};

const computeSatisfaction = (delta: number | null): number | null => {
  if (delta === null || !Number.isFinite(delta)) {
    return null;
  }

  if (delta >= 12) return 5;
  if (delta >= 5) return 4;
  if (delta >= 1) return 3;
  if (delta >= -2) return 2;
  return 1;
};

const sanitizeDuration = (value: number | null | undefined): number => {
  if (!Number.isFinite(value) || value === null || value === undefined) {
    return 0;
  }

  return Math.max(0, Math.round(value));
};

const ensureMetadata = (metadata?: Record<string, unknown>): Record<string, unknown> => {
  if (!metadata || typeof metadata !== 'object') {
    return {};
  }

  return metadata;
};

export async function logAndJournal(payload: LogAndJournalPayload): Promise<LogAndJournalResult> {
  const duration = sanitizeDuration(payload.duration_sec);
  const nowIso = new Date().toISOString();
  const moodDelta = Number.isFinite(payload.mood_delta ?? null)
    ? Math.round(payload.mood_delta as number)
    : null;

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(authError.message ?? 'Impossible de vérifier la session utilisateur');
  }

  if (!authData?.user?.id) {
    throw new Error('Utilisateur non authentifié');
  }

  const userId = authData.user.id;
  const moodBefore = moodSnapshotToString(payload.moodBefore);
  const moodAfter = moodSnapshotToString(payload.moodAfter);

  const activityInsert: ActivityInsert = {
    user_id: userId,
    activity_type: payload.type,
    duration_seconds: duration,
    completed_at: nowIso,
    session_data: {
      ...(ensureMetadata(payload.metadata)),
      mood_delta: moodDelta,
    },
    mood_before: moodBefore,
    mood_after: moodAfter,
    satisfaction_score: computeSatisfaction(moodDelta),
  };

  const { data: activityRows, error: activityError } = await supabase
    .from('user_activity_sessions')
    .insert(activityInsert)
    .select('*')
    .limit(1);

  if (activityError || !activityRows || activityRows.length === 0) {
    throw new Error(activityError?.message ?? 'Impossible de journaliser la session');
  }

  const journalInsert: JournalInsert = {
    user_id: userId,
    content: payload.journalText,
    created_at: nowIso,
    updated_at: nowIso,
    emotion_analysis: {
      module: payload.type,
      mood_delta: moodDelta,
      duration_sec: duration,
      mood_before: payload.moodBefore ?? null,
      mood_after: payload.moodAfter ?? null,
    },
  };

  const { data: journalRows, error: journalError } = await supabase
    .from('journal_entries')
    .insert(journalInsert)
    .select('*')
    .limit(1);

  if (journalError || !journalRows || journalRows.length === 0) {
    throw new Error(journalError?.message ?? 'Impossible de créer l’entrée de journal');
  }

  Sentry.addBreadcrumb({
    category: 'journal',
    level: 'info',
    message: 'journal:auto:insert',
    data: {
      activity_type: payload.type,
      duration_sec: duration,
      mood_delta: moodDelta,
    },
  });

  return {
    activity: activityRows[0],
    journal: journalRows[0],
  };
}

