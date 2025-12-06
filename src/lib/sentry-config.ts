// @ts-nocheck
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/react';
import { Replay } from '@sentry/replay';
import type { Breadcrumb, Event as SentryEvent } from '@sentry/types';
import { BUILD_INFO, SENTRY_CONFIG } from '@/lib/env';
import { hasConsent } from '@/lib/consent';
import { logger } from '@/lib/logger';

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
let doNotTrackEnabled = false;

type WebVitalName = 'CLS' | 'LCP' | 'FID';

const WEB_VITAL_UNITS: Record<WebVitalName, 'millisecond' | 'unitless'> = {
  CLS: 'unitless',
  LCP: 'millisecond',
  FID: 'millisecond',
};

const sensitiveKeyPattern = /(content|message|prompt|transcript|body|text|summary|entry|payload|answer|comment|note|journal|chat)/i;
const sensitiveUrlPattern = /(journal|coach|chat|conversation)/i;
const piiKeyPattern = /(email|phone|tel|mobile|supabase|token|authorization|apikey|api[_-]?key)/i;
const userIdPrefixes = ['user', 'member', 'profile', 'supabase', 'session', 'customer', 'patient', 'account', 'contact'];
const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE_REGEX = /\b(?:\+?\d[\d\s().-]{7,}\d)\b/g;
const UUID_REGEX = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi;
const JWT_REGEX = /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g;
const BEARER_TOKEN_REGEX = /\bBearer\s+[A-Za-z0-9\-._~+/=]{10,}\b/gi;
const BASIC_TOKEN_REGEX = /\bBasic\s+[A-Za-z0-9\-._~+/=]{6,}\b/gi;
const TOKEN_QUERY_PARAM_REGEX = /([?&](?:token|access_token|refresh_token|api[_-]?key|auth|authorization)=)[^&#]+/gi;
const SUPABASE_SERVICE_ROLE_VALUE_REGEX = /(supabase[_-]?service[_-]?role[_-]?key\s*[:=]\s*)([^&\s]+)/gi;

const normalizeKey = (key: string): string =>
  key
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^a-z0-9_]/gi, '_')
    .toLowerCase();

const isPiiKey = (key: string): boolean => {
  const normalized = normalizeKey(key);
  return piiKeyPattern.test(normalized) || normalized.includes('supabase_service_role_key');
};

const isUserIdentifierKey = (key: string): boolean => {
  const normalized = normalizeKey(key);
  if (normalized === 'id' || normalized === 'uid') {
    return true;
  }
  if (normalized.includes('user_id') || normalized.includes('userid')) {
    return true;
  }
  if (normalized.includes('supabase') && normalized.includes('id')) {
    return true;
  }
  if (normalized.endsWith('_id')) {
    const prefix = normalized.slice(0, -3).replace(/_+$/, '');
    if (userIdPrefixes.some(candidate => prefix.endsWith(candidate))) {
      return true;
    }
  }
  if (normalized.endsWith('_uid')) {
    return true;
  }
  return false;
};

const containsSensitiveString = (value: string): boolean => {
  if (!value) {
    return false;
  }

  const patterns = [EMAIL_REGEX, PHONE_REGEX, UUID_REGEX, JWT_REGEX, BEARER_TOKEN_REGEX, BASIC_TOKEN_REGEX];
  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    if (pattern.test(value)) {
      return true;
    }
  }

  TOKEN_QUERY_PARAM_REGEX.lastIndex = 0;
  if (TOKEN_QUERY_PARAM_REGEX.test(value)) {
    return true;
  }

  SUPABASE_SERVICE_ROLE_VALUE_REGEX.lastIndex = 0;
  return SUPABASE_SERVICE_ROLE_VALUE_REGEX.test(value);
};

const redactSensitiveString = (value: string): string => {
  let sanitized = value;
  sanitized = sanitized.replace(EMAIL_REGEX, '[redacted-email]');
  sanitized = sanitized.replace(PHONE_REGEX, '[redacted-phone]');
  sanitized = sanitized.replace(UUID_REGEX, '[redacted-id]');
  sanitized = sanitized.replace(JWT_REGEX, '[redacted-token]');
  sanitized = sanitized.replace(BEARER_TOKEN_REGEX, 'Bearer [redacted]');
  sanitized = sanitized.replace(BASIC_TOKEN_REGEX, 'Basic [redacted]');
  sanitized = sanitized.replace(TOKEN_QUERY_PARAM_REGEX, '$1[redacted]');
  sanitized = sanitized.replace(SUPABASE_SERVICE_ROLE_VALUE_REGEX, '$1[redacted]');
  return sanitized;
};

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
  let cleaned: string;
  if (value.startsWith('/')) {
    cleaned = value.split('?')[0];
  } else {
    try {
      const parsed = new URL(value);
      parsed.search = '';
      parsed.hash = '';
      cleaned = parsed.toString();
    } catch {
      cleaned = value.split('?')[0];
    }
  }
  return redactSensitiveString(cleaned);
};

const sanitizeString = (value: string) => {
  const cleaned = redactSensitiveString(value);
  if (sensitiveUrlPattern.test(cleaned)) {
    return '[scrubbed]';
  }
  if (cleaned.length <= 140) {
    return cleaned;
  }
  return `${cleaned.slice(0, 70)}…${cleaned.slice(-16)}`;
};

const sanitizeUrlSearchParams = (params: URLSearchParams): Record<string, string> => {
  const sanitized: Record<string, string> = {};
  params.forEach((value, key) => {
    if (isPiiKey(key)) {
      sanitized[key] = '[redacted]';
      return;
    }

    if (containsSensitiveString(value)) {
      sanitized[key] = '[scrubbed]';
      return;
    }

    sanitized[key] = sanitizeString(value);
  });
  return sanitized;
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

  if (typeof URLSearchParams !== 'undefined' && input instanceof URLSearchParams) {
    return sanitizeUrlSearchParams(input);
  }

  if (input instanceof Date) {
    return input.toISOString();
  }

  if (typeof input === 'object') {
    const entries = Object.entries(input as Record<string, unknown>).map(([key, value]) => {
      if (isPiiKey(key) || isUserIdentifierKey(key)) {
        return [key, '[redacted]'];
      }

      if (typeof value === 'number' && isUserIdentifierKey(key)) {
        return [key, '[redacted]'];
      }

      if (sensitiveKeyPattern.test(key)) {
        return [key, '[scrubbed]'];
      }

      if (typeof value === 'string') {
        if (sensitiveKeyPattern.test(value)) {
          return [key, '[scrubbed]'];
        }
        return [key, sanitizeString(value)];
      }

      return [key, sanitizeData(value, depth + 1)];
    });
    return Object.fromEntries(entries);
  }

  if (typeof input === 'string') {
    return sanitizeString(input);
  }

  if (typeof input === 'number' || typeof input === 'boolean') {
    return input;
  }

  return input;
};

const containsSensitiveValue = (value: unknown, depth = 0): boolean => {
  if (value == null) {
    return false;
  }

  if (typeof value === 'string') {
    return containsSensitiveString(value);
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some(item => containsSensitiveValue(item, depth + 1));
  }

  if (typeof URLSearchParams !== 'undefined' && value instanceof URLSearchParams) {
    let sensitive = false;
    value.forEach((entryValue, entryKey) => {
      if (sensitive) {
        return;
      }
      if (isPiiKey(entryKey) || containsSensitiveString(entryValue)) {
        sensitive = true;
      }
    });
    return sensitive;
  }

  if (typeof value === 'object') {
    if (depth > 3) {
      return false;
    }

    return Object.entries(value as Record<string, unknown>).some(([key, nested]) => {
      if (isPiiKey(key) || isUserIdentifierKey(key)) {
        if (typeof nested === 'string' && (nested.startsWith('[redacted') || nested.startsWith('[scrubbed'))) {
          return false;
        }
        return true;
      }
      return containsSensitiveValue(nested, depth + 1);
    });
  }

  return false;
};

const NETWORK_BREADCRUMB_CATEGORIES = new Set(['http', 'fetch', 'xhr']);

const sanitizeBreadcrumb = (breadcrumb: Breadcrumb): Breadcrumb | null => {
  const category = breadcrumb.category ?? '';

  if (NETWORK_BREADCRUMB_CATEGORIES.has(category)) {
    if (containsSensitiveValue(breadcrumb.data)) {
      return null;
    }
    if (typeof breadcrumb.message === 'string' && containsSensitiveString(breadcrumb.message)) {
      return null;
    }
  }

  const sanitizedData = breadcrumb.data ? (sanitizeData(breadcrumb.data) as Record<string, unknown>) : undefined;

  if (sanitizedData && NETWORK_BREADCRUMB_CATEGORIES.has(category) && typeof sanitizedData.url === 'string') {
    sanitizedData.url = sanitizeUrl(sanitizedData.url);
  }

  return {
    ...breadcrumb,
    message: typeof breadcrumb.message === 'string' ? sanitizeString(breadcrumb.message) : breadcrumb.message,
    data: sanitizedData,
  };
};

const DO_NOT_TRACK_VALUES = new Set(['1', 'yes', 'true']);

const resolveDoNotTrackPreference = (): boolean => {
  if (typeof navigator === 'undefined') {
    return false;
  }

  const rawPreference =
    navigator.doNotTrack ??
    (navigator as unknown as { msDoNotTrack?: string }).msDoNotTrack ??
    (typeof window !== 'undefined' ? (window as unknown as { doNotTrack?: string }).doNotTrack : undefined);

  if (typeof rawPreference === 'string') {
    return DO_NOT_TRACK_VALUES.has(rawPreference);
  }

  return false;
};

const markDoNotTrackPreference = (): void => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-dnt', doNotTrackEnabled ? 'true' : 'false');
  }

  if (typeof window !== 'undefined') {
    (window as Record<string, unknown>).__EMOTIONSCARE_DNT__ = doNotTrackEnabled;
  }
};

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
  if (doNotTrackEnabled && event.type === 'transaction') {
    return null;
  }

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

  event.user = undefined;

  if (event.contexts) {
    event.contexts = sanitizeData(event.contexts) as typeof event.contexts;
  }

  if (event.extra) {
    event.extra = sanitizeData(event.extra) as typeof event.extra;
  }

  if (event.breadcrumbs) {
    const sanitizedBreadcrumbs = event.breadcrumbs
      .slice(-50)
      .map(sanitizeBreadcrumb)
      .filter((breadcrumb): breadcrumb is Breadcrumb => breadcrumb !== null);
    event.breadcrumbs = sanitizedBreadcrumbs.length ? sanitizedBreadcrumbs : undefined;
  }

  if (containsSensitiveValue(event.extra) || containsSensitiveValue(event.contexts)) {
    return null;
  }

  event.tags = {
    ...event.tags,
    pii_scrubbed: 'true',
    dnt: doNotTrackEnabled ? 'true' : 'false',
    telemetry_disabled: doNotTrackEnabled ? 'true' : 'false',
  };

  return event;
};

const hasSentryClient = () => Boolean(Sentry.getCurrentHub().getClient());

export const SENTRY_PRIVACY_GUARDS = {
  sanitizeEvent,
  sanitizeBreadcrumb,
  sanitizeData,
  containsSensitiveValue,
};

export function initializeSentry(): boolean {
  if (sentryInitialized) {
    return true;
  }

  if (typeof window === 'undefined') {
    return false;
  }

  if (!hasConsent('analytics')) {
    if (import.meta.env.DEV) {
      logger.info('[Sentry] Initialisation différée : consentement analytics absent.', 'LIB');
    }
    return false;
  }

  const dsn = SENTRY_CONFIG.dsn;

  if (!dsn) {
    if (import.meta.env.DEV) {
      logger.info('[Sentry] DSN non configuré, instrumentation désactivée.', 'LIB');
    }
    return false;
  }

  const environment = SENTRY_CONFIG.environment ?? import.meta.env.MODE ?? 'development';
  const baseTracesSampleRate = Number.isFinite(SENTRY_CONFIG.tracesSampleRate)
    ? SENTRY_CONFIG.tracesSampleRate
    : 0.2;
  const baseReplaysSessionSampleRate = Number.isFinite(SENTRY_CONFIG.replaysSessionSampleRate)
    ? SENTRY_CONFIG.replaysSessionSampleRate
    : 0;
  const baseReplaysOnErrorSampleRate = Number.isFinite(SENTRY_CONFIG.replaysOnErrorSampleRate)
    ? SENTRY_CONFIG.replaysOnErrorSampleRate
    : 0;

  doNotTrackEnabled = resolveDoNotTrackPreference();
  markDoNotTrackPreference();

  const tracesSampleRate = doNotTrackEnabled ? 0 : baseTracesSampleRate;
  const replaysSessionSampleRate = doNotTrackEnabled ? 0 : baseReplaysSessionSampleRate;
  const replaysOnErrorSampleRate = doNotTrackEnabled ? 0 : baseReplaysOnErrorSampleRate;

  const integrations = [] as NonNullable<Parameters<typeof Sentry.init>[0]['integrations']>;

  if (tracesSampleRate > 0) {
    integrations.push(
      new BrowserTracing({
        tracePropagationTargets: [
          /^https?:\/\/localhost(?::\d+)?/,
          /^https?:\/\/[^/]*supabase\.co/,
          /^https?:\/\/api\.emotionscare\.com/,
        ],
      }),
    );
  }

  if (!doNotTrackEnabled && (replaysSessionSampleRate > 0 || replaysOnErrorSampleRate > 0)) {
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
    sendDefaultPii: false,
    autoSessionTracking: !doNotTrackEnabled,
    enableTracing: tracesSampleRate > 0,
    beforeSend(event) {
      return sanitizeEvent(event);
    },
    beforeBreadcrumb(breadcrumb) {
      return sanitizeBreadcrumb(breadcrumb);
    },
  });

  Sentry.configureScope(scope => {
    scope.setTag('environment', environment);
    scope.setTag('release', fallbackRelease);
    scope.setTag('commit_sha', commitSha);
    scope.setTag('app_version', BUILD_INFO.version ?? 'unknown');
    scope.setTag('feature_flag_router_v2', 'enabled');
    scope.setTag('dnt', doNotTrackEnabled ? 'true' : 'false');
    if (doNotTrackEnabled) {
      scope.setTag('telemetry_disabled', 'true');
    }
    scope.setContext('build', {
      version: BUILD_INFO.version ?? 'unknown',
      commitSha,
      release: fallbackRelease,
    });
    scope.setContext('privacy', {
      doNotTrack: doNotTrackEnabled,
      pii_scrubbing: 'strict',
    });
  });

  Sentry.addGlobalEventProcessor(event => sanitizeEvent(event));

  sentryInitialized = true;

  if (!doNotTrackEnabled) {
    monitorWebVitals();
  }

  if (import.meta.env.DEV) {
    const dntMessage = doNotTrackEnabled ? ' (respect do-not-track activé)' : '';
    logger.debug(`[Sentry] Observabilité initialisée${dntMessage}`, 'LIB');
  }

  return true;
}

export function reportReadingAddError(error: Error, context: SentryContextOptions): void {
  if (!hasSentryClient()) {
    if (import.meta.env.DEV) {
      logger.warn('[Sentry] Client inactif, impossible de reporter l\'erreur.', 'LIB');
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
    logger.debug('[Sentry] Surveillance DOM activée', 'LIB');
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
