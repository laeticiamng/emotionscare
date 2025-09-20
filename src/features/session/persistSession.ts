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
export type NyveePersistPayload = {
  profile: string;
  next: 'anchor' | '54321';
  exit: 'soft';
  notes: string;
};

const DEFAULT_ENDPOINT = '/api/modules/nyvee/sessions';

type PersistSessionOptions = {
  endpoint?: string;
};

export async function persistSession(
  module: 'nyvee',
  payload: NyveePersistPayload,
  options: PersistSessionOptions = {}
): Promise<void> {
  const endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
  const body = JSON.stringify({ module, payload });

  const response = await (typeof fetch === 'function'
    ? fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      })
    : Promise.reject(new Error('fetch_unavailable')));

  if (!response || !('ok' in response)) {
    throw new Error('persist_session_invalid_response');
  }

  if (!response.ok) {
    throw new Error(`persist_session_failed:${response.status}`);
  }
}
