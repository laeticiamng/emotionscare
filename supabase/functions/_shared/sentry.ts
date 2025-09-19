const SENTRY_DSN = Deno.env.get('SENTRY_DSN');
const SENTRY_ENVIRONMENT = Deno.env.get('SENTRY_ENVIRONMENT') ?? 'edge';
const SENTRY_RELEASE = Deno.env.get('SENTRY_RELEASE');
const TRACES_SAMPLE_RATE = Number.parseFloat(Deno.env.get('SENTRY_TRACES_SAMPLE_RATE') ?? '0');
const IS_NODE_RUNTIME = typeof process !== 'undefined' && Boolean(process.versions?.node);

let sentry: typeof import('https://esm.sh/@sentry/deno@8.22.0') | null = null;

if (SENTRY_DSN && !IS_NODE_RUNTIME) {
  try {
    const mod = await import(/* @vite-ignore */ 'https://esm.sh/@sentry/deno@8.22.0');
    mod.init({
      dsn: SENTRY_DSN,
      environment: SENTRY_ENVIRONMENT,
      release: SENTRY_RELEASE,
      tracesSampleRate: Number.isFinite(TRACES_SAMPLE_RATE) ? Math.max(0, Math.min(1, TRACES_SAMPLE_RATE)) : 0,
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
    sentry.addBreadcrumb({
      category: crumb.category,
      message: crumb.message,
      data: crumb.data,
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
      if (context) {
        for (const [key, value] of Object.entries(context)) {
          scope.setContext(key, { value } as Record<string, unknown>);
        }
      }
      sentry.captureException(error);
    });
  } catch (captureError) {
    console.warn('[observability] failed to capture exception', captureError);
  }
}
