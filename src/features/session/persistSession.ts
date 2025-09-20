import * as Sentry from '@sentry/react';

import { createSession } from '@/services/sessions/sessionsApi';

import type { BreathProfile, Mode, Next } from '@/features/orchestration/useBreathworkOrchestration';

interface PersistBreathPayload {
  profile: BreathProfile;
  mode: Mode;
  next: Next;
  notes: string;
  summary?: string;
  durationSec?: number;
}

export const persistSession = async (module: 'breath', payload: PersistBreathPayload) => {
  const duration = Math.max(1, Math.round(payload.durationSec ?? 300));
  const meta = {
    module,
    profile: payload.profile,
    mode: payload.mode,
    next: payload.next,
    notes: payload.notes,
    summary: payload.summary ?? 'respiration apaisante',
  } as const;

  Sentry.addBreadcrumb({
    category: 'session',
    message: 'breath:session:persist',
    level: 'info',
    data: meta,
  });

  try {
    await createSession({
      type: 'breath',
      duration_sec: duration,
      mood_delta: null,
      meta,
    });
  } catch (error) {
    console.error('[Breath] persist session failed', error);
    Sentry.captureException(error);
  }
};

export default persistSession;
