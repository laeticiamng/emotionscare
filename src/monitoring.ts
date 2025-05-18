import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { env } from './env.mjs';

if (env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: env.NEXT_PUBLIC_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
    environment: env.NODE_ENV,
  });
}

export default Sentry;
