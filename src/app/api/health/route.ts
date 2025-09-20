import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const RESPONSE_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store, max-age=0',
  'x-robots-tag': 'noindex',
};

const clampMs = (value: number): number => Math.max(0, Math.round(value));

const sanitizeError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message.slice(0, 120);
  }
  if (typeof error === 'string') {
    return error.slice(0, 120);
  }
  return 'unknown_error';
};

const parseHeaders = (value: string | null | undefined): Record<string, string> => {
  if (!value) {
    return {};
  }
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, item) => {
      const [key, ...rest] = item.split('=');
      if (!key || rest.length === 0) {
        return acc;
      }
      acc[key.trim().toLowerCase()] = rest.join('=').trim();
      return acc;
    }, {});
};

const normalizeUrl = (value: string): URL | null => {
  try {
    return new URL(value);
  } catch {
    try {
      return new URL(`https://${value}`);
    } catch {
      return null;
    }
  }
};

const resolveEdgeFunctionUrl = (supabaseUrl: string): string => {
  const override = process.env.SUPABASE_FUNCTIONS_URL;
  if (override) {
    const normalized = normalizeUrl(override);
    if (normalized) {
      const base = normalized.href.endsWith('/') ? normalized.href : `${normalized.href}/`;
      try {
        return new URL('health-edge', base).toString();
      } catch {
        // fall through to Supabase project default
      }
    }
  }

  return new URL('/functions/v1/health-edge', supabaseUrl).toString();
};

const resolveVersion = (): string =>
  process.env.SENTRY_RELEASE ??
  process.env.VERCEL_GIT_COMMIT_SHA ??
  process.env.GITHUB_SHA ??
  'dev';

const resolveEnvironment = (): string => process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV ?? 'local';

async function measure<T>(operation: () => Promise<T>): Promise<{ ms: number; data: T }> {
  const start = performance.now();
  const data = await operation();
  const duration = clampMs(performance.now() - start);
  return { ms: duration, data };
}

export async function GET(request: Request): Promise<Response> {
  const requiredKey = process.env.HEALTH_ACCESS_KEY;
  if (requiredKey) {
    const provided = request.headers.get('x-ec-health-key');
    if (provided !== requiredKey) {
      return new Response('unauthorized', { status: 401, headers: RESPONSE_HEADERS });
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const missing = [] as string[];
  if (!supabaseUrl) missing.push('supabase_url');
  if (!serviceRoleKey) missing.push('service_role_key');

  if (missing.length) {
    const body = {
      status: 'error',
      supabase_ms: null,
      edge_ms: null,
      storage_ms: null,
      version: resolveVersion(),
      env: resolveEnvironment(),
      error: `config_missing:${missing.join(',')}`,
    };
    return new Response(JSON.stringify(body), { status: 500, headers: RESPONSE_HEADERS });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
    global: { headers: parseHeaders(process.env.SUPABASE_SERVICE_HEADERS) },
  });

  let supabaseMs: number | null = null;
  let edgeMs: number | null = null;
  let storageMs: number | null = null;
  let failingProbe: string | null = null;

  try {
    failingProbe = 'supabase';
    const supa = await measure(async () => {
      const { error } = await supabase
        .from('assessments')
        .select('id', { head: true, limit: 1 });
      if (error) {
        throw new Error(error.message ?? 'supabase_error');
      }
    });
    supabaseMs = supa.ms;

    const edgeUrl = resolveEdgeFunctionUrl(supabaseUrl);
    failingProbe = 'edge';
    const edge = await measure(async () => {
      const response = await fetch(edgeUrl, { method: 'POST', cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`edge_${response.status}`);
      }
    });
    edgeMs = edge.ms;

    const storageUrl = new URL('/storage/v1/object/public/health/pixel.png', supabaseUrl).toString();
    failingProbe = 'storage';
    const storage = await measure(async () => {
      const response = await fetch(storageUrl, { method: 'HEAD', cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`storage_${response.status}`);
      }
    });
    storageMs = storage.ms;

    const body = {
      status: 'ok' as const,
      supabase_ms: supabaseMs,
      edge_ms: edgeMs,
      storage_ms: storageMs,
      version: resolveVersion(),
      env: resolveEnvironment(),
    };

    return new Response(JSON.stringify(body), { status: 200, headers: RESPONSE_HEADERS });
  } catch (error) {
    const failing = failingProbe ?? 'unknown';
    const softFail = (process.env.HEALTH_SOFT_FAIL ?? '').toLowerCase() === 'true';
    const status = softFail ? 200 : 503;
    const body = {
      status: softFail ? 'degraded' : 'error',
      supabase_ms: supabaseMs,
      edge_ms: edgeMs,
      storage_ms: storageMs,
      version: resolveVersion(),
      env: resolveEnvironment(),
      error: sanitizeError(error),
      failing_probe: failing,
    };

    return new Response(JSON.stringify(body), { status, headers: RESPONSE_HEADERS });
  }
}
