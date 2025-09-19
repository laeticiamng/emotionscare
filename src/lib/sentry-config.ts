import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import {
  BUILD_INFO,
  SENTRY_DSN,
  SENTRY_ENVIRONMENT,
  SENTRY_RELEASE,
  SENTRY_TRACES_SAMPLE_RATE,
  SENTRY_REPLAYS_SESSION_SAMPLE_RATE,
  SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE,
} from '@/lib/env';

interface SentryContextOptions {
  component?: string;
  operation?: string;
  element?: string;
  attempted?: string;
}

let sentryInitialized = false;
let domMonitoringAttached = false;

const hasSentryClient = () => Boolean(Sentry.getCurrentHub().getClient());

export function initializeSentry(): void {
  if (sentryInitialized || typeof window === 'undefined') {
    return;
  }

  const dsn = SENTRY_DSN;

  if (!dsn) {
    if (import.meta.env.DEV) {
      console.info('[Sentry] Aucun DSN détecté, initialisation ignorée');
    }
    return;
  }

  try {
    const release = SENTRY_RELEASE;
    const environment = SENTRY_ENVIRONMENT ?? import.meta.env.MODE ?? 'development';

    Sentry.init({
      dsn,
      environment,
      release,
      integrations: [new BrowserTracing()],
      tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE,
      replaysSessionSampleRate: SENTRY_REPLAYS_SESSION_SAMPLE_RATE,
      replaysOnErrorSampleRate: SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE,
      beforeSend(event) {
        if (event.exception?.values?.[0]?.value?.includes("Cannot read properties of undefined (reading 'add')")) {
          event.tags = {
            ...event.tags,
            errorType: 'reading_add',
            critical: true,
            component: 'dom_manipulation'
          };

          event.contexts = {
            ...event.contexts,
            debugging: {
              suggestion: 'Use safe-helpers.ts functions instead of direct .add() calls',
              documentation: 'Check src/lib/safe-helpers.ts for safe alternatives',
              preventable: true
            }
          };

          event.level = 'error';
        }

        if (import.meta.env.DEV) {
          console.group('🚨 Sentry Error Report');
          console.error('Error:', event.exception?.values?.[0]?.value);
          console.error('Context:', event.contexts);
          console.error('Tags:', event.tags);
          console.groupEnd();
        }

        return event;
      }
    });

    Sentry.configureScope((scope) => {
      scope.setTag('deploymentEnvironment', environment);

      if (release) {
        scope.setTag('release', release);
      }

      scope.setContext('build', {
        version: BUILD_INFO.version ?? 'unknown',
        commitSha: BUILD_INFO.commitSha ?? 'unknown',
        release: release ?? 'unversioned',
      });
    });

    Sentry.addGlobalEventProcessor((event) => {
      if (event.exception?.values?.[0]?.stacktrace?.frames) {
        const frames = event.exception.values[0].stacktrace.frames;

        const hasDOMFrame = frames.some(
          (frame) =>
            frame.filename?.includes('AccessibilityEnhancer') ||
            frame.filename?.includes('theme-provider') ||
            frame.filename?.includes('MoodMixer') ||
            frame.function?.includes('classList')
        );

        if (hasDOMFrame) {
          event.tags = {
            ...event.tags,
            domError: true,
            feature: 'ui_interaction'
          };
        }
      }

      return event;
    });

    sentryInitialized = true;

    if (import.meta.env.DEV) {
      console.log('[Sentry] Error tracking initialized for "reading add" errors');
    }
  } catch (error) {
    console.error('[Sentry] Failed to initialize:', error);
  }
}

export function reportReadingAddError(error: Error, context: SentryContextOptions): void {
  if (!hasSentryClient()) {
    if (import.meta.env.DEV) {
      console.warn('[Sentry] Cannot report error, Sentry not available');
    }
    return;
  }

  Sentry.withScope((scope) => {
    scope.setLevel('error');
    scope.setTag('errorType', 'reading_add');
    scope.setTag('critical', true);

    if (context.component) scope.setTag('component', context.component);
    if (context.operation) scope.setTag('operation', context.operation);

    scope.setContext('errorDetails', {
      element: context.element || 'unknown',
      attempted: context.attempted || 'unknown operation',
      preventable: true,
      solution: 'Use safe-helpers.ts functions'
    });

    Sentry.captureException(error);
  });
}

export function monitorDOMErrors(): void {
  if (domMonitoringAttached || typeof window === 'undefined') {
    return;
  }

  const originalError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    if (typeof message === 'string' && message.includes("Cannot read properties of undefined (reading 'add')")) {
      reportReadingAddError(error || new Error(message), {
        component: source ? source.split('/').pop() : 'unknown',
        operation: 'dom_manipulation',
        attempted: 'add_operation'
      });
    }

    if (originalError) {
      return originalError(message, source, lineno, colno, error);
    }

    return false;
  };

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason as Error | undefined;

    if (reason?.message?.includes("Cannot read properties of undefined (reading 'add')")) {
      reportReadingAddError(reason, {
        component: 'promise',
        operation: 'async_dom_manipulation'
      });
    }
  });

  domMonitoringAttached = true;

  if (import.meta.env.DEV) {
    console.log('[Sentry] DOM error monitoring active');
  }
}
