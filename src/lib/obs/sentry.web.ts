import type { Breadcrumb, Event } from '@sentry/types';
import * as Sentry from '@sentry/nextjs';

import { redact } from './redact';

const clampRate = (value: number | null | undefined, fallback: number) => {
  if (!Number.isFinite(value ?? NaN)) {
    return fallback;
  }
  return Math.min(1, Math.max(0, Number(value)));
};

let initialized = false;

export function initSentryWeb(): void {
  if (initialized) {
    return;
  }

  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[obs] Sentry DSN absent, instrumentation front désactivée.');
    }
    return;
  }

  const environment = process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development';
  const release = process.env.SENTRY_RELEASE;
  const tracesSampleRate = clampRate(Number.parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE ?? ''), 0.2);

  Sentry.init({
    dsn,
    environment,
    release,
    tracesSampleRate,
    replaysSessionSampleRate: 0,
    sendDefaultPii: false,
    beforeSend(event) {
      const sanitized = redact(event) as Event | string;
      return typeof sanitized === 'object' && sanitized !== null ? sanitized : event;
    },
    beforeBreadcrumb(breadcrumb) {
      if (!breadcrumb) {
        return breadcrumb;
      }

      const next: Breadcrumb = {
        ...breadcrumb,
        data: breadcrumb.data ? (redact(breadcrumb.data) as Record<string, unknown>) : undefined,
      };

      if (typeof next.message === 'string') {
        next.message = redact(next.message);
      }

      if (typeof next.category === 'string') {
        next.category = redact(next.category);
      }

      return next;
    },
  });

  Sentry.configureScope(scope => {
    scope.setTag('runtime', 'web');
    scope.setTag('pii_scrubbed', 'true');
    if (environment) {
      scope.setTag('environment', environment);
    }
    if (release) {
      scope.setTag('release', release);
    }
  });

  initialized = true;
}

if (typeof window !== 'undefined') {
  initSentryWeb();
}
