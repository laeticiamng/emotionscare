// @ts-nocheck
import { captureException } from '@/lib/ai-monitoring';

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export type OrchestrationModule = 'community' | 'social_cocon';
export type OrchestrationMetadata = Record<string, string | undefined>;

const TABLE = 'session_text_logs';

const sanitizeMetadata = (metadata: OrchestrationMetadata) =>
  Object.entries(metadata).reduce<Record<string, string>>((acc, [key, value]) => {
    if (typeof value === 'string' && value.trim().length > 0) {
      acc[key] = value.trim();
    }
    return acc;
  }, {});

export async function persistOrchestrationSession(
  module: OrchestrationModule,
  metadata: OrchestrationMetadata,
): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  const sanitized = sanitizeMetadata(metadata);
  if (!Object.keys(sanitized).length) {
    return;
  }

  const createdAt = new Date().toISOString();

  Sentry.addBreadcrumb({
    category: 'session',
    message: 'session:persist:orchestration',
    level: 'info',
    data: { module, ...sanitized },
  });

  logger.info('[orchestration] persist', { module, metadata: sanitized }, 'SYSTEM');

  try {
    const { error } = await supabase
      .from(TABLE)
      .insert({
        module,
        created_at: createdAt,
        metadata: sanitized,
      });

    if (error) {
      throw error;
    }
  } catch (error) {
    Sentry.captureException(error, {
      tags: { module, scope: 'orchestration' },
      extra: { metadata: sanitized },
    });
  }
}
