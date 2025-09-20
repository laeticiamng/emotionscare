import * as Sentry from '@sentry/react';

import { createSession } from '@/services/sessions/sessionsApi';

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

export async function persistSession(input: PersistMusicSessionInput): Promise<void> {
  const { module, metadata, durationSec = 0 } = input;
  try {
    Sentry.addBreadcrumb({ category: 'session', message: 'session:persist:music', level: 'info', data: { module } });
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

export type { MusicSessionMetadata, PersistMusicSessionInput };
