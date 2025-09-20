import * as Sentry from '@sentry/nextjs';
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

const ensureSentryClient = () => {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    return;
  }

  if (Sentry.getCurrentHub().getClient()) {
    return;
  }

  const tracesSampleRate = resolveSampleRate(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE, 0.2);
  const replaysSampleRate = resolveSampleRate(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE, 0);
  const replaysOnErrorSampleRate = resolveSampleRate(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE, 0);

  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT,
    release: process.env.SENTRY_RELEASE,
    tracesSampleRate,
    replaysSessionSampleRate: replaysSampleRate,
    replaysOnErrorSampleRate,
    beforeSend(event) {
      return event ? (redact(event) as typeof event) : event;
    },
    beforeBreadcrumb(breadcrumb) {
      if (!breadcrumb) {
        return breadcrumb;
      }

      const sanitizedData = breadcrumb.data ? (redact(breadcrumb.data) as Breadcrumb['data']) : breadcrumb.data;
      return {
        ...breadcrumb,
        data: sanitizedData,
      };
    },
  });
};

ensureSentryClient();

export { Sentry };
