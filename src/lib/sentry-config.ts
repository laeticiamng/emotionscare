import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/react';
import { Replay } from '@sentry/replay';
import type { Breadcrumb, Event as SentryEvent } from '@sentry/types';
import { BUILD_INFO, SENTRY_CONFIG } from '@/lib/env';

declare const __APP_COMMIT_SHA__: string | undefined;

type SentryContextOptions = {
  component?: string;
  operation?: string;
  element?: string;
  attempted?: string;
};

type LayoutShiftEntry = PerformanceEntry & {
  value: number;
  hadRecentInput: boolean;
};

type LargestContentfulPaintEntry = PerformanceEntry & {
  renderTime?: number;
  loadTime?: number;
  startTime: number;
  size?: number;
  id?: string;
  url?: string;
  element?: Element;
};

type FirstInputEntry = PerformanceEventTiming & {
  processingStart: number;
  startTime: number;
  name: string;
};

let sentryInitialized = false;
let domMonitoringAttached = false;
let webVitalsMonitoringAttached = false;

type WebVitalName = 'CLS' | 'LCP' | 'FID';

const WEB_VITAL_UNITS: Record<WebVitalName, 'millisecond' | 'unitless'> = {
  CLS: 'unitless',
  LCP: 'millisecond',
  FID: 'millisecond',
};

const sensitiveKeyPattern = /(content|message|prompt|transcript|body|text|summary|entry|payload|answer|comment|note|journal|chat)/i;
const sensitiveUrlPattern = /(journal|coach|chat|conversation)/i;

const resolveCommitSha = () => {
  if (typeof __APP_COMMIT_SHA__ === 'string' && __APP_COMMIT_SHA__.length > 0) {
    return __APP_COMMIT_SHA__;
  }
  if (BUILD_INFO.commitSha) {
    return BUILD_INFO.commitSha;
  }
  return 'unknown';
};

const commitSha = resolveCommitSha();
const fallbackRelease = BUILD_INFO.release ?? `emotionscare@${commitSha}`;

const sanitizeUrl = (value: string) => {
  if (!value) return value;
  if (value.startsWith('/')) {
    return value.split('?')[0];
  }
  try {
    const parsed = new URL(value);
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return value.split('?')[0];
  }
};

const sanitizeString = (value: string) => {
  if (sensitiveUrlPattern.test(value)) {
    return '[scrubbed]';
  }
  if (value.length <= 140) {
    return value;
  }
  return `${value.slice(0, 70)}…${value.slice(-16)}`;
};

const sanitizeData = (input: unknown, depth = 0): unknown => {
  if (input == null) {
    return input;
  }

  if (depth > 3) {
    return '[trimmed]';
  }

  if (Array.isArray(input)) {
    return input.slice(0, 5).map(item => sanitizeData(item, depth + 1));
  }

  if (typeof input === 'object') {
    const entries = Object.entries(input as Record<string, unknown>).map(([key, value]) => {
      if (sensitiveKeyPattern.test(key)) {
        return [key, '[scrubbed]'];
      }
      if (typeof value === 'string' && sensitiveKeyPattern.test(value)) {
        return [key, '[scrubbed]'];
      }
      return [key, sanitizeData(value, depth + 1)];
    });
    return Object.fromEntries(entries);
  }

  if (typeof input === 'string') {
    return sanitizeString(input);
  }

  return input;
};

const sanitizeBreadcrumb = (breadcrumb: Breadcrumb): Breadcrumb => ({
  ...breadcrumb,
  message: breadcrumb.message ? sanitizeString(breadcrumb.message) : breadcrumb.message,
  data: breadcrumb.data ? (sanitizeData(breadcrumb.data) as Record<string, unknown>) : undefined,
});

const recordWebVital = (name: WebVitalName, value: number, extra: Record<string, unknown>): void => {
  if (!Number.isFinite(value)) {
    return;
  }

  const rounded = name === 'CLS' ? Number(value.toFixed(4)) : Math.round(value);
  const unit = WEB_VITAL_UNITS[name];

  const scope = Sentry.getCurrentHub().getScope();
  const transaction = scope?.getTransaction();
  if (transaction) {
    transaction.setMeasurement(name, rounded, unit);
  }

  Sentry.configureScope(activeScope => {
    activeScope.setExtra(`web-vital:${name}`, {
      value: rounded,
      unit,
      ...extra,
    });
  });

  if (import.meta.env.DEV) {
    const suffix = unit === 'unitless' ? '' : 'ms';
    console.debug(`[Sentry][Vitals] ${name}: ${rounded}${suffix}`);
  }
};

const sanitizeEvent = (event: SentryEvent): SentryEvent | null => {
  if (event.request) {
    if (event.request.url) {
      const sanitizedUrl = sanitizeUrl(event.request.url);
      event.request.url = sanitizedUrl;
      if (sensitiveUrlPattern.test(sanitizedUrl)) {
        event.request.data = undefined;
        event.request.cookies = undefined;
        event.request.query_string = undefined;
      }
    }

    if (event.request.headers) {
      const whitelistedHeaders = ['referer', 'user-agent', 'accept-language'];
      const nextHeaders: Record<string, string> = {};
      for (const header of whitelistedHeaders) {
        const value = (event.request.headers as Record<string, string | undefined>)[header];
        if (value) {
          nextHeaders[header] = sanitizeString(String(value));
        }
      }
      event.request.headers = Object.keys(nextHeaders).length ? nextHeaders : undefined;
    }

    if (event.request.data) {
      event.request.data = '[scrubbed]';
    }
  }

  if (event.user) {
    const { id, ip_address } = event.user;
    event.user = id || ip_address ? { id, ip_address } : undefined;
  }

  if (event.contexts) {
    event.contexts = sanitizeData(event.contexts) as typeof event.contexts;
  }

  if (event.extra) {
    event.extra = sanitizeData(event.extra) as typeof event.extra;
  }

  if (event.breadcrumbs) {
    event.breadcrumbs = event.breadcrumbs.slice(-50).map(sanitizeBreadcrumb);
  }

  return event;
};

const hasSentryClient = () => Boolean(Sentry.getCurrentHub().getClient());

export function initializeSentry(): void {
  if (sentryInitialized || typeof window === 'undefined') {
    return;
  }

  const dsn = SENTRY_CONFIG.dsn;

  if (!dsn) {
    if (import.meta.env.DEV) {
      console.info('[Sentry] DSN non configuré, instrumentation désactivée.');
    }
    return;
  }

  const environment = SENTRY_CONFIG.environment ?? import.meta.env.MODE ?? 'development';
  const tracesSampleRate = Number.isFinite(SENTRY_CONFIG.tracesSampleRate)
    ? SENTRY_CONFIG.tracesSampleRate
    : 0.2;
  const replaysSessionSampleRate = Number.isFinite(SENTRY_CONFIG.replaysSessionSampleRate)
    ? SENTRY_CONFIG.replaysSessionSampleRate
    : 0;
  const replaysOnErrorSampleRate = Number.isFinite(SENTRY_CONFIG.replaysOnErrorSampleRate)
    ? SENTRY_CONFIG.replaysOnErrorSampleRate
    : 0;

  const integrations = [
    new BrowserTracing({
      tracePropagationTargets: [
        /^https?:\/\/localhost(?::\d+)?/,
        /^https?:\/\/[^/]*supabase\.co/,
        /^https?:\/\/api\.emotionscare\.com/,
      ],
    }),
  ];

  if (replaysSessionSampleRate > 0 || replaysOnErrorSampleRate > 0) {
    integrations.push(
      new Replay({
        blockAllMedia: true,
        maskAllInputs: true,
        sessionSampleRate: replaysSessionSampleRate,
        errorSampleRate: replaysOnErrorSampleRate || 0.1,
      }),
    );
  }

  Sentry.init({
    dsn,
    environment,
    release: fallbackRelease,
    integrations,
    tracesSampleRate,
    replaysSessionSampleRate,
    replaysOnErrorSampleRate,
    beforeSend(event) {
      return sanitizeEvent(event);
    },
  });

  Sentry.configureScope(scope => {
    scope.setTag('environment', environment);
    scope.setTag('release', fallbackRelease);
    scope.setTag('commit_sha', commitSha);
    scope.setTag('app_version', BUILD_INFO.version ?? 'unknown');
    scope.setTag('feature_flag_router_v2', 'enabled');
    scope.setContext('build', {
      version: BUILD_INFO.version ?? 'unknown',
      commitSha,
      release: fallbackRelease,
    });
  });

  Sentry.addGlobalEventProcessor(event => sanitizeEvent(event));

  sentryInitialized = true;

  monitorWebVitals();

  if (import.meta.env.DEV) {
    console.log('[Sentry] Observabilité initialisée');
  }
}

export function reportReadingAddError(error: Error, context: SentryContextOptions): void {
  if (!hasSentryClient()) {
    if (import.meta.env.DEV) {
      console.warn('[Sentry] Client inactif, impossible de reporter l\'erreur.');
    }
    return;
  }

  Sentry.withScope(scope => {
    scope.setLevel('error');
    scope.setTag('error_type', 'reading_add');
    scope.setTag('critical', 'true');

    if (context.component) scope.setTag('component', context.component);
    if (context.operation) scope.setTag('operation', context.operation);

    scope.setContext('errorDetails', sanitizeData({
      element: context.element ?? 'unknown',
      attempted: context.attempted ?? 'unknown',
      preventable: true,
      solution: 'Use safe-helpers.ts functions',
    }) as Record<string, unknown>);

    Sentry.captureException(error);
  });
}

export function monitorDOMErrors(): void {
  if (domMonitoringAttached || typeof window === 'undefined') {
    return;
  }

  const originalError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    const messageText = typeof message === 'string' ? message : '';
    if (messageText.includes("Cannot read properties of undefined (reading 'add')")) {
      reportReadingAddError(error || new Error(messageText), {
        component: source ? source.split('/').pop() : 'unknown',
        operation: 'dom_manipulation',
        attempted: 'add_operation',
      });
    }

    if (originalError) {
      return originalError(message, source, lineno, colno, error);
    }

    return false;
  };

  window.addEventListener('unhandledrejection', event => {
    const reason = event.reason as Error | undefined;
    if (reason?.message?.includes("Cannot read properties of undefined (reading 'add')")) {
      reportReadingAddError(reason, {
        component: 'promise',
        operation: 'async_dom_manipulation',
      });
    }
  });

  domMonitoringAttached = true;

  if (import.meta.env.DEV) {
    console.log('[Sentry] Surveillance DOM activée');
  }
}

function monitorWebVitals(): void {
  if (webVitalsMonitoringAttached || typeof window === 'undefined') {
    return;
  }

  if (typeof PerformanceObserver === 'undefined') {
    return;
  }

  webVitalsMonitoringAttached = true;

  const clsState = {
    value: 0,
    lastReported: 0,
  };
  const clsSamples: Array<{ startTime: number; value: number }> = [];

  const clsObserver = new PerformanceObserver(list => {
    for (const entry of list.getEntries() as LayoutShiftEntry[]) {
      if ('hadRecentInput' in entry && entry.hadRecentInput) {
        continue;
      }
      const shift = entry as LayoutShiftEntry;
      clsState.value += shift.value;
      clsSamples.push({ startTime: shift.startTime, value: shift.value });
    }

    if (clsState.value - clsState.lastReported > 0.001) {
      recordWebVital('CLS', clsState.value, {
        samples: clsSamples.slice(-5),
      });
      clsState.lastReported = clsState.value;
    }
  });

  try {
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch (error) {
    if (import.meta.env.DEV) {
      console.debug('[Sentry][Vitals] Impossible d\'observer CLS', error);
    }
  }

  let latestLcp: LargestContentfulPaintEntry | null = null;
  const lcpObserver = new PerformanceObserver(list => {
    const entries = list.getEntries() as LargestContentfulPaintEntry[];
    const last = entries[entries.length - 1];
    if (last) {
      latestLcp = last;
    }
  });

  let vitalsFinalized = false;
  const finalizeLcp = () => {
    if (!latestLcp) {
      return;
    }
    const value = Math.max(latestLcp.renderTime ?? 0, latestLcp.loadTime ?? 0, latestLcp.startTime);
    recordWebVital('LCP', value, {
      id: latestLcp.id,
      url: latestLcp.url,
      size: latestLcp.size,
      element: latestLcp.element?.tagName?.toLowerCase?.(),
    });
    lcpObserver.disconnect();
  };

  const handleVisibilityHidden = () => {
    if (vitalsFinalized) {
      return;
    }
    vitalsFinalized = true;
    finalizeLcp();
    clsObserver.takeRecords();
    clsObserver.disconnect();
    lcpObserver.disconnect();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('pagehide', handleVisibilityHidden, true);
  };

  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      handleVisibilityHidden();
    }
  };

  try {
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', handleVisibilityHidden, { once: true, capture: true });
  } catch (error) {
    if (import.meta.env.DEV) {
      console.debug('[Sentry][Vitals] Impossible d\'observer LCP', error);
    }
  }

  const fidObserver = new PerformanceObserver(list => {
    const entries = list.getEntries() as FirstInputEntry[];
    const first = entries[0];
    if (!first) {
      return;
    }
    const fid = first.processingStart - first.startTime;
    recordWebVital('FID', fid, {
      name: first.name,
      startTime: first.startTime,
    });
    fidObserver.disconnect();
  });

  try {
    fidObserver.observe({ type: 'first-input', buffered: true });
  } catch (error) {
    if (import.meta.env.DEV) {
      console.debug('[Sentry][Vitals] Impossible d\'observer FID', error);
    }
  }
}
