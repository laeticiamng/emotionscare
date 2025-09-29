import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

interface Measurement {
  ok: boolean;
  ms: number | null;
  error?: string;
}

const toBoolean = (value: string | undefined | null): boolean => {
  if (!value) {
    return false;
  }
  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
};

const responseHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store, max-age=0',
  'x-robots-tag': 'noindex',
  vary: 'Authorization, X-EC-Health-Key',
};

const softFail = toBoolean(process.env.HEALTH_SOFT_FAIL);

const readBaseUrl = (): string | null =>
  process.env.VITE_WEB_URL ??
  process.env.WEB_URL ??
  null;

const readSupabaseUrl = (): string | null =>
  process.env.VITE_SUPABASE_URL ??
  process.env.SUPABASE_URL ??
  null;

const readServiceRoleKey = (): string | null => process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;

const createTimeoutSignal = (timeoutMs: number) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort('timeout'), timeoutMs);
  return {
    signal: controller.signal,
    cancel: () => clearTimeout(timeout),
  };
};

const measure = async (fn: () => Promise<void>): Promise<Measurement> => {
  const start = performance.now();
  try {
    await fn();
    return { ok: true, ms: Math.round(performance.now() - start) };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    return { ok: false, ms: Math.round(performance.now() - start), error: message };
  }
};

const measureSupabase = async (): Promise<Measurement> => {
  const supabaseUrl = readSupabaseUrl();
  const serviceRoleKey = readServiceRoleKey();
  if (!supabaseUrl || !serviceRoleKey) {
    return { ok: false, ms: null, error: 'supabase_env_missing' };
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return measure(async () => {
    const { error } = await supabase.from('assessments').select('id', { head: true, count: 'exact' }).limit(1);
    if (error) {
      throw new Error(error.message ?? 'supabase_error');
    }
  });
};

const measureEdge = async (): Promise<Measurement> => {
  const baseUrl = readBaseUrl();
  if (!baseUrl) {
    return { ok: false, ms: null, error: 'base_url_missing' };
  }

  const url = new URL('/functions/v1/health-edge', baseUrl).toString();
  return measure(async () => {
    const { signal, cancel } = createTimeoutSignal(4000);
    try {
      const response = await fetch(url, { method: 'POST', signal });
      if (!response.ok) {
        throw new Error('edge_unhealthy');
      }
    } finally {
      cancel();
    }
  });
};

const measureStorage = async (): Promise<Measurement> => {
  const supabaseUrl = readSupabaseUrl();
  if (!supabaseUrl) {
    return { ok: false, ms: null, error: 'supabase_env_missing' };
  }

  const url = new URL('/storage/v1/object/public/health/pixel.png', supabaseUrl).toString();
  return measure(async () => {
    const { signal, cancel } = createTimeoutSignal(4000);
    try {
      const response = await fetch(url, { method: 'HEAD', signal });
      if (!response.ok) {
        throw new Error('storage_unhealthy');
      }
    } finally {
      cancel();
    }
  });
};

const enforceAccess = (request: Request | undefined): Measurement | null => {
  const requiredKey = process.env.EC_HEALTH_KEY;
  if (!requiredKey) {
    return null;
  }

  const provided = request?.headers.get('x-ec-health-key');
  if (provided !== requiredKey) {
    return { ok: false, ms: null, error: 'unauthorized' };
  }

  return null;
};

export async function GET(request: Request = new Request('http://localhost/api/health')) {
  const accessError = enforceAccess(request);
  if (accessError) {
    return new NextResponse(JSON.stringify({ error: accessError.error ?? 'unauthorized' }), {
      status: 401,
      headers: responseHeaders,
    });
  }

  const [supabaseMeasurement, edgeMeasurement, storageMeasurement] = await Promise.all([
    measureSupabase(),
    measureEdge(),
    measureStorage(),
  ]);

  const errors: Record<string, string> = {};
  if (!supabaseMeasurement.ok && supabaseMeasurement.error) {
    errors.supabase = supabaseMeasurement.error;
  }
  if (!edgeMeasurement.ok && edgeMeasurement.error) {
    errors.edge = edgeMeasurement.error;
  }
  if (!storageMeasurement.ok && storageMeasurement.error) {
    errors.storage = storageMeasurement.error;
  }

  const status = Object.keys(errors).length === 0 ? 'ok' : 'degraded';

  const body = {
    status,
    supabase_ms: supabaseMeasurement.ms,
    edge_ms: edgeMeasurement.ms,
    storage_ms: storageMeasurement.ms,
    version: process.env.SENTRY_RELEASE ?? 'dev',
    env: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV ?? 'local',
    checked_at: new Date().toISOString(),
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };

  const statusCode = status === 'ok' || softFail ? 200 : 503;

  return new NextResponse(JSON.stringify(body), {
    status: statusCode,
    headers: responseHeaders,
  });
}
