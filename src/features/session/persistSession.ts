// @ts-nocheck
import { Sentry } from '@/lib/errors/sentry-compat';
import { supabase } from '@/integrations/supabase/client';
import { createSession } from '@/services/sessions/sessionsApi';
import type { BreathProfile, Mode, Next } from '@/features/orchestration/useBreathworkOrchestration';
import { logger } from '@/lib/logger';

// Music session types and function
interface MusicSessionMetadata {
  texture: 'ambient_very_low' | 'calm_low' | 'warm_soft' | 'neutral';
  intensity: 'very_low' | 'low' | 'medium';
  bpm_profile: 'slow' | 'neutral';
  crossfade_ms: number;
  post_cta: 'nyvee' | 'encore_2min' | 'none';
}

interface PersistMusicSessionInput {
  module: 'music';
  metadata: MusicSessionMetadata;
  durationSec?: number;
}

export async function persistMusicSession(input: PersistMusicSessionInput): Promise<void> {
  const { module, metadata, durationSec = 0 } = input;
  try {
    logger.info('session:persist:music', { module }, 'SESSION');
    await createSession({
      type: module,
      duration_sec: Math.max(0, Math.round(durationSec)),
      mood_delta: null,
      meta: {
        module,
        metadata,
      },
    });
  } catch (error) {
    Sentry.captureException(error, { tags: { module }, extra: { metadata } });
    throw error;
  }
}

// Flash Glow session types and function
type FlashGlowSessionMetadata = {
  variant: 'default' | 'hr';
  visuals_intensity: 'low' | 'medium' | 'lowered';
  breath: 'exhale_longer' | 'neutral';
  extended_ms: number;
  exit: 'soft' | 'none';
  post_cta: 'screen_silk' | 'none';
};

type PersistSessionResult = {
  success: boolean;
  id?: string;
};

const sanitizeFlashGlowPayload = (payload: FlashGlowSessionMetadata) => ({
  variant: payload.variant,
  visuals_intensity: payload.visuals_intensity,
  breath: payload.breath,
  extended_ms: Number.isFinite(payload.extended_ms)
    ? Math.max(0, Math.round(payload.extended_ms))
    : 0,
  exit: payload.exit,
  post_cta: payload.post_cta,
});

export async function persistFlashGlowSession(module: 'flash_glow', payload: FlashGlowSessionMetadata): Promise<PersistSessionResult> {
  const sanitized = sanitizeFlashGlowPayload(payload);

  logger.info('session:persist:flash_glow', {
    module,
    exit: sanitized.exit,
    post_cta: sanitized.post_cta,
    variant: sanitized.variant,
  }, 'SESSION');

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

// Breath session types and function
interface PersistBreathPayload {
  profile: BreathProfile;
  mode: Mode;
  next: Next;
  notes: string;
  summary?: string;
  durationSec?: number;
}

export const persistBreathSession = async (module: 'breath', payload: PersistBreathPayload) => {
  const duration = Math.max(1, Math.round(payload.durationSec ?? 300));
  const meta = {
    module,
    profile: payload.profile,
    mode: payload.mode,
    next: payload.next,
    notes: payload.notes,
    summary: payload.summary ?? 'respiration apaisante',
  } as const;

  logger.info('breath:session:persist', meta, 'SESSION');

  try {
    await createSession({
      type: 'breath',
      duration_sec: duration,
      mood_delta: null,
      meta,
    });
  } catch (error) {
    logger.error('[Breath] persist session failed', error as Error, 'SYSTEM');
    Sentry.captureException(error);
  }
};

// Nyvee session types and function
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

export async function persistNyveeSession(
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

// Export all types
export type { 
  MusicSessionMetadata, 
  PersistMusicSessionInput, 
  FlashGlowSessionMetadata, 
  PersistBreathPayload,
  PersistSessionResult 
};
