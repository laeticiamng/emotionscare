import type { Breadcrumb } from '@sentry/types';
import * as Sentry from '@sentry/nextjs';

import { redact } from './redact';

export function addBreadcrumb(
  category: string,
  data?: Record<string, unknown>,
  message?: string,
): void {
  const hub = Sentry.getCurrentHub();
  const client = hub.getClient();
  if (!client) {
    return;
  }

  const crumb: Breadcrumb = {
    category,
    level: 'info',
    message: message ?? category,
    data: data ? (redact(data) as Record<string, unknown>) : undefined,
  };

  Sentry.addBreadcrumb(crumb);
}
