import * as Sentry from '@sentry/react';
import type { Breadcrumb, SeverityLevel } from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

interface SentryContextOptions {
  component?: string;
  operation?: string;
  element?: string;
  attempted?: string;
}

let sentryInitialized = false;
let domMonitoringAttached = false;

export const hasSentryClient = () => Boolean(Sentry.getCurrentHub().getClient());

type SentryUserContext = {
  id: string;
  email?: string | null;
  mode?: string | null;
  roles?: string[] | null;
};

type CaptureErrorOptions = {
  level?: SeverityLevel;
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  fingerprint?: string[];
  userMessage?: string;
};

const normaliseScopeContext = (
  context: Record<string, unknown> | null | undefined
): Record<string, unknown> | null => {
  if (!context || Object.keys(context).length === 0) {
    return null;
  }

  return context;
};

export function addSentryBreadcrumb(breadcrumb: Breadcrumb): void {
  if (!hasSentryClient()) {
    return;
  }

  Sentry.addBreadcrumb({
    timestamp: Date.now() / 1000,
    ...breadcrumb,
  });
}

export function clearSentryUser(): void {
  if (!hasSentryClient()) {
    return;
  }

  Sentry.configureScope((scope) => {
    scope.setUser(null);
    scope.setTag('user_mode', 'guest');
    scope.setContext('user_roles', null);
  });
}

export function setSentryUser(user: SentryUserContext | null): void {
  if (!hasSentryClient()) {
    return;
  }

  if (!user) {
    clearSentryUser();
    return;
  }

  Sentry.setUser({ id: user.id, email: user.email ?? undefined });
  Sentry.configureScope((scope) => {
    scope.setTag('user_mode', user.mode ?? 'guest');
    scope.setContext('user_roles', normaliseScopeContext(
      user.roles && user.roles.length ? { roles: user.roles } : null
    ));
  });
}

export function captureAppError(
  error: unknown,
  options: CaptureErrorOptions = {}
): string | undefined {
  if (!hasSentryClient()) {
    if (import.meta.env.DEV) {
      console.warn('[Sentry] captureAppError skipped – client not ready', error);
    }
    return undefined;
  }

  const { level = 'error', tags, extra, fingerprint, userMessage } = options;
  const throwable =
    error instanceof Error
      ? error
      : new Error(typeof error === 'string' ? error : 'Unknown error');

  return Sentry.captureException(throwable, (scope) => {
    scope.setLevel(level);

    if (tags) {
      Object.entries(tags).forEach(([key, value]) => scope.setTag(key, value));
    }

    if (extra) {
      scope.setContext('app_extra', { ...extra });
    }

    if (fingerprint) {
      scope.setFingerprint(fingerprint);
    }

    if (userMessage) {
      scope.setContext('user_message', { message: userMessage });
    }
  });
}

const parseRate = (value: string | undefined, fallback: number) => {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export function initializeSentry(): void {
  if (sentryInitialized || typeof window === 'undefined') {
    return;
  }

  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (!dsn) {
    if (import.meta.env.DEV) {
      console.info('[Sentry] Aucun DSN détecté, initialisation ignorée');
    }
    return;
  }

  try {
    Sentry.init({
      dsn,
      environment: import.meta.env.VITE_SENTRY_ENVIRONMENT ?? import.meta.env.MODE ?? 'development',
      integrations: [new BrowserTracing()],
      tracesSampleRate: parseRate(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE, 0.1),
      replaysSessionSampleRate: parseRate(import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE, 0),
      replaysOnErrorSampleRate: parseRate(import.meta.env.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE, 1.0),
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
