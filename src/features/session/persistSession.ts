import * as Sentry from '@sentry/react';

import { supabase } from '@/integrations/supabase/client';

type PersistableModule = 'flash_glow';

type FlashGlowSessionMetadata = {
  variant: 'default' | 'hr';
  visuals_intensity: 'low' | 'medium' | 'lowered';
  breath: 'exhale_longer' | 'neutral';
  extended_ms: number;
  exit: 'soft' | 'none';
  post_cta: 'screen_silk' | 'none';
};

type PersistablePayload = FlashGlowSessionMetadata;

type PersistSessionResult = {
  success: boolean;
  id?: string;
};

const sanitizePayload = (payload: PersistablePayload) => ({
  variant: payload.variant,
  visuals_intensity: payload.visuals_intensity,
  breath: payload.breath,
  extended_ms: Number.isFinite(payload.extended_ms)
    ? Math.max(0, Math.round(payload.extended_ms))
    : 0,
  exit: payload.exit,
  post_cta: payload.post_cta,
});

export async function persistSession(module: PersistableModule, payload: PersistablePayload): Promise<PersistSessionResult> {
  const sanitized = sanitizePayload(payload);

  Sentry.addBreadcrumb({
    category: 'session',
    message: 'session:persist:flash_glow',
    level: 'info',
    data: {
      module,
      exit: sanitized.exit,
      post_cta: sanitized.post_cta,
      variant: sanitized.variant,
    },
  });

  try {
    const timestamp = new Date().toISOString();
    const { data, error } = await supabase
      .from('session_text_logs')
      .insert({
        module,
        created_at: timestamp,
        metadata: sanitized,
      })
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    const id = typeof data?.id === 'string' ? data.id : undefined;
    return { success: true, id };
  } catch (error) {
    Sentry.captureException(error);
    return { success: false };
  }
}

export type { FlashGlowSessionMetadata };
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
