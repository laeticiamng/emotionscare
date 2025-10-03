import type { Breadcrumb } from '@sentry/types';

import { Sentry } from '@/lib/obs/sentry.web';
import { redact } from '@/lib/obs/redact';

type BreadcrumbOptions = {
  message?: string;
  data?: Record<string, unknown> | undefined;
  level?: Breadcrumb['level'];
  type?: Breadcrumb['type'];
};

export function addBreadcrumb(category: string, options: BreadcrumbOptions = {}): void {
  const client = Sentry.getCurrentHub().getClient();
  if (!client) {
    return;
  }

  const { data, level, message, type } = options;
  const sanitizedData = data ? (redact(data) as Record<string, unknown>) : undefined;

  Sentry.addBreadcrumb({
    category,
    level: level ?? 'info',
    message,
    type,
    data: sanitizedData,
    timestamp: Date.now() / 1000,
  });
}
