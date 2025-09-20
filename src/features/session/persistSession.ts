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
