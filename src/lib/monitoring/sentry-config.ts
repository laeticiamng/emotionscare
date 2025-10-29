// @ts-nocheck
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

/**
 * Initialize Sentry monitoring for production
 */
export function initSentry() {
  // Only initialize in production
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new BrowserTracing({
          tracePropagationTargets: [
            'localhost',
            /^\//,
            /^https:\/\/yaincoxihiqdksxgrsrk\.supabase\.co/,
          ],
        }),
        new Sentry.Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],

      // Performance Monitoring
      tracesSampleRate: 0.1, // 10% of transactions

      // Session Replay
      replaysSessionSampleRate: 0.1, // 10% of sessions
      replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

      // Environment
      environment: import.meta.env.MODE,

      // Release tracking
      release: import.meta.env.VITE_APP_VERSION || 'unknown',

      // Ignore common errors
      ignoreErrors: [
        // Browser extensions
        'top.GLOBALS',
        'chrome-extension://',
        'moz-extension://',
        // Network errors
        'NetworkError',
        'Failed to fetch',
        'Load failed',
        // ResizeObserver
        'ResizeObserver loop limit exceeded',
      ],

      beforeSend(event, hint) {
        // Filter out PII from scan data
        if (event.contexts?.scan) {
          delete event.contexts.scan.userId;
          delete event.contexts.scan.email;
        }

        // Add scan-specific tags
        if (event.tags?.event_category === 'scan') {
          event.fingerprint = ['scan-error', event.tags.event_name || 'unknown'];
        }

        return event;
      },
    });
  }
}

/**
 * Track scan-specific errors with context
 */
export function trackScanError(
  error: Error,
  context: {
    mode?: 'camera' | 'sliders';
    source?: string;
    hasConsent?: boolean;
    [key: string]: any;
  }
) {
  Sentry.captureException(error, {
    tags: {
      feature: 'scan',
      mode: context.mode,
      source: context.source,
    },
    contexts: {
      scan: {
        hasConsent: context.hasConsent,
        ...context,
      },
    },
  });
}

/**
 * Track scan performance metrics
 */
export function trackScanPerformance(
  operation: string,
  durationMs: number,
  metadata?: Record<string, any>
) {
  const transaction = Sentry.startTransaction({
    name: `scan.${operation}`,
    op: 'scan',
  });

  transaction.setMeasurement('duration', durationMs, 'millisecond');

  if (metadata) {
    Object.entries(metadata).forEach(([key, value]) => {
      transaction.setTag(key, value);
    });
  }

  transaction.finish();
}

/**
 * Set user context for Sentry (anonymized)
 */
export function setSentryUser(userId: string, segment?: string) {
  Sentry.setUser({
    id: userId,
    segment,
  });
}

/**
 * Clear user context
 */
export function clearSentryUser() {
  Sentry.setUser(null);
}
