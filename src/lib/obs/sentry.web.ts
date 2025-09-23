import * as Sentry from '@sentry/react';
import type { Breadcrumb } from '@sentry/types';

import { redact } from '@/lib/obs/redact';

const resolveSampleRate = (raw: string | undefined, fallback: number): number => {
  if (!raw) {
    return fallback;
  }

  const parsed = Number.parseFloat(raw);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(0, Math.min(1, parsed));
};

const ensureSentryClient = (): void => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) {
    return;
  }

  if (Sentry.getCurrentHub().getClient()) {
    return;
  }

  const tracesSampleRate = resolveSampleRate(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE, 0.2);
  const replaysSampleRate = resolveSampleRate(import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE, 0);
  const replaysOnErrorSampleRate = resolveSampleRate(import.meta.env.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE, 0);

  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
    release: import.meta.env.VITE_SENTRY_RELEASE,
    tracesSampleRate,
    replaysSessionSampleRate: replaysSampleRate,
    replaysOnErrorSampleRate,
    beforeSend(event) {
      return event ? (redact(event) as typeof event) : event;
    },
    beforeBreadcrumb(breadcrumb) {
      return breadcrumb ? (redact(breadcrumb) as Breadcrumb) : breadcrumb;
    },
  });
};

ensureSentryClient();

export { Sentry, ensureSentryClient };
