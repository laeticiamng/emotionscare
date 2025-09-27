import { hash } from './hash_user.ts';

const SENTRY_DSN = Deno.env.get('SENTRY_DSN');
const SENTRY_ENVIRONMENT = Deno.env.get('SENTRY_ENVIRONMENT') ?? 'edge';
const SENTRY_RELEASE = Deno.env.get('SENTRY_RELEASE');
const TRACES_SAMPLE_RATE = Number.parseFloat(Deno.env.get('SENTRY_TRACES_SAMPLE_RATE') ?? '');
const IS_NODE_RUNTIME = typeof process !== 'undefined' && Boolean(process.versions?.node);

let sentry: typeof import('https://esm.sh/@sentry/deno@8.22.0') | null = null;

const EMAIL_REGEX = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const PHONE_REGEX = /(?:\+?\d[\s-.]?)?(?:\(?\d{2,3}\)?[\s-.]?)?\d{2,4}[\s-.]?\d{2,4}[\s-.]?\d{2,4}/g;
const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;

function clampSampleRate(rate: number | null): number {
  if (!Number.isFinite(rate) || rate === null) {
    return 0.15;
  }
  if (rate < 0.1) {
    return 0.1;
  }
  if (rate > 0.2) {
    return 0.2;
  }
  return rate;
}

function redactString(value: string): string {
  if (!value) {
    return value;
  }
  let sanitized = value
    .replace(EMAIL_REGEX, '[email]')
    .replace(UUID_REGEX, '[id]')
    .replace(PHONE_REGEX, '[tel]');

  if (sanitized.length > 80) {
    try {
      const digest = hash(sanitized);
      return `[hash:${digest.slice(0, 16)}]`;
    } catch {
      return '[hash:redacted]';
    }
  }

  return sanitized;
}

function sanitizeValue(value: unknown, depth = 0): unknown {
  if (value === null || value === undefined) {
    return value ?? null;
  }

  if (typeof value === 'string') {
    return redactString(value);
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      return null;
    }
    return Math.round(value * 1000) / 1000;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (Array.isArray(value)) {
    if (depth >= 2) {
      return value.length;
    }
    return value.slice(0, 10).map((entry) => sanitizeValue(entry, depth + 1));
  }

  if (typeof value === 'object') {
    if (depth >= 2) {
      return '[object]';
    }
    const entries = Object.entries(value as Record<string, unknown>)
      .slice(0, 10)
      .map(([key, val]) => [key, sanitizeValue(val, depth + 1)])
      .filter(([, val]) => val !== undefined);
    return Object.fromEntries(entries);
  }

  return null;
}

function sanitizeBreadcrumb(crumb: {
  category: string;
  message?: string;
  data?: Record<string, unknown>;
}) {
  const sanitizedData = crumb.data ? sanitizeValue(crumb.data) : undefined;
  return {
    category: redactString(crumb.category),
    message: crumb.message ? redactString(crumb.message) : undefined,
    data:
      sanitizedData && typeof sanitizedData === 'object'
        ? (sanitizedData as Record<string, unknown>)
        : undefined,
  };
}

function sanitizeContext(context?: Record<string, unknown>) {
  if (!context) {
    return undefined;
  }
  const sanitized = sanitizeValue(context);
  return typeof sanitized === 'object' && sanitized !== null ? (sanitized as Record<string, unknown>) : undefined;
}

if (SENTRY_DSN && !IS_NODE_RUNTIME) {
  try {
    const mod = await import(/* @vite-ignore */ 'https://esm.sh/@sentry/deno@8.22.0');
    mod.init({
      dsn: SENTRY_DSN,
      environment: SENTRY_ENVIRONMENT,
      release: SENTRY_RELEASE,
      tracesSampleRate: clampSampleRate(Number.isFinite(TRACES_SAMPLE_RATE) ? TRACES_SAMPLE_RATE : null),
      beforeSend(event) {
        if (event?.request?.headers) {
          event.request.headers = {};
        }
        if (event?.request?.cookies) {
          event.request.cookies = undefined;
        }
        if (event?.user) {
          event.user = undefined;
        }
        if (event?.extra) {
          event.extra = sanitizeContext(event.extra);
        }
        if (event?.tags) {
          const sanitizedTags = sanitizeContext(event.tags);
          event.tags = sanitizedTags
            ? Object.fromEntries(
                Object.entries(sanitizedTags).map(([key, value]) => [key, String(value ?? '')]),
              )
            : undefined;
        }
        return event;
      },
    });
    sentry = mod;
    console.info('[observability] Sentry initialised for edge assessments');
  } catch (error) {
    console.warn('[observability] unable to initialise Sentry', error);
  }
} else if (SENTRY_DSN && IS_NODE_RUNTIME) {
  console.info('[observability] Sentry initialisation skipped in node runtime');
}

type SentryScope = { setContext: (key: string, value: Record<string, unknown>) => void };

function withSentryScope(callback: (scope: SentryScope) => void) {
  if (!sentry) {
    return;
  }
  sentry.withScope((scope) => {
    try {
      callback(scope);
    } catch (error) {
      console.warn('[observability] scope callback failed', error);
    }
  });
}

export function addSentryBreadcrumb(crumb: { category: string; message?: string; data?: Record<string, unknown> }) {
  if (!sentry) {
    return;
  }
  try {
    const sanitized = sanitizeBreadcrumb(crumb);
    sentry.addBreadcrumb({
      category: sanitized.category,
      message: sanitized.message,
      data: sanitized.data,
      level: 'info',
      timestamp: Date.now() / 1000,
    });
  } catch (error) {
    console.warn('[observability] failed to add breadcrumb', error);
  }
}

export function captureSentryException(error: unknown, context?: Record<string, unknown>) {
  if (!sentry) {
    return;
  }
  try {
    withSentryScope((scope) => {
      const sanitizedContext = sanitizeContext(context);
      if (sanitizedContext) {
        for (const [key, value] of Object.entries(sanitizedContext)) {
          scope.setContext(key, { value } as Record<string, unknown>);
        }
      }
      sentry.captureException(error);
    });
  } catch (captureError) {
    console.warn('[observability] failed to capture exception', captureError);
  }
}

export function initSentry() {
  return sentry;
}
