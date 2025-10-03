import { serve } from '../_shared/serve.ts';
import { z } from '../_shared/zod.ts';

import { authenticateRequest, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';
import { appendCorsHeaders, preflightResponse, rejectCors, resolveCors } from '../_shared/cors.ts';
import { applySecurityHeaders, json } from '../_shared/http.ts';
import { hash } from '../_shared/hash_user.ts';
import { logAccess } from '../_shared/logging.ts';
import { addSentryBreadcrumb, captureSentryException } from '../_shared/sentry.ts';
import { traced } from '../_shared/otel.ts';
import { buildRateLimitResponse, enforceEdgeRateLimit } from '../_shared/rate-limit.ts';
import { recordEdgeLatencyMetric } from '../_shared/metrics.ts';
import { createClient } from '../_shared/supabase.ts';

import { getCatalog } from '../_shared/assess.ts';
import type { InstrumentCode, LocaleCode } from '../_shared/assess.ts';

const instrumentSchema = z.enum(['WHO5', 'STAI6', 'SAM', 'SUDS']);
const localeSchema = z.enum(['fr', 'en', 'es', 'de', 'it']);

const requestSchema = z.object({
  instrument: instrumentSchema,
  locale: localeSchema.optional(),
});

const CACHE_CONTROL = 'public, max-age=300, stale-while-revalidate=60';

type ConsentResult =
  | { status: 200 }
  | { status: 403; error: 'optin_required' }
  | { status: 500; error: 'internal_error'; detail: 'configuration_error' | 'optin_lookup_failed' };

function readFlag(value: string | undefined): boolean {
  if (!value) {
    return true;
  }
  const normalized = value.trim().toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'off';
}

function isInstrumentEnabled(instrument: InstrumentCode): boolean {
  const envKey = `FF_ASSESS_${instrument}`;
  return readFlag(Deno.env.get(envKey));
}

async function ensureClinicalOptIn(userId: string, instrument: InstrumentCode): Promise<ConsentResult> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[assess-start] missing Supabase service configuration');
    return { status: 500, error: 'internal_error', detail: 'configuration_error' };
  }

  const client = createClient(supabaseUrl, serviceRoleKey);
  const { data, error } = await traced(
    'supabase.query',
    () =>
      client
        .from('clinical_consents')
        .select('id')
        .eq('user_id', userId)
        .eq('instrument_code', instrument)
        .eq('is_active', true)
        .maybeSingle(),
    {
      attributes: {
        table: 'clinical_consents',
        operation: 'select',
        route: 'assess-start',
      },
    },
  );

  if (error) {
    console.error('[assess-start] clinical consent lookup failed', { message: error.message });
    return { status: 500, error: 'internal_error', detail: 'optin_lookup_failed' };
  }

  if (!data) {
    return { status: 403, error: 'optin_required' };
  }

  return { status: 200 };
}

async function computeEtag(payload: InstrumentCatalog): Promise<string> {
  const encoder = new TextEncoder();
  const raw = JSON.stringify(payload);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(raw));
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function etagMatches(request: Request, etag: string): boolean {
  const header = request.headers.get('if-none-match');
  if (!header) {
    return false;
  }
  return header
    .split(',')
    .map((candidate) => candidate.trim().replace(/^W\//, '').replace(/^"|"$/g, ''))
    .includes(etag);
}

serve(async (req) => {
  const startedAt = Date.now();
  const cors = resolveCors(req);
  let hashedUserId: string | null = null;

  const finalize = async (
    response: Response,
    metadata: { outcome?: 'success' | 'error' | 'denied'; stage?: string | null; error?: string | null } = {},
  ) => {
    await recordEdgeLatencyMetric({
      route: 'assess-start',
      durationMs: Date.now() - startedAt,
      status: response.status,
      hashedUserId,
      outcome: metadata.outcome,
      stage: metadata.stage ?? null,
      error: metadata.error ?? null,
    });
    return response;
  };

  if (req.method === 'OPTIONS') {
    return finalize(applySecurityHeaders(preflightResponse(cors), { cacheControl: 'no-store' }));
  }

  if (!cors.allowed) {
    return finalize(applySecurityHeaders(rejectCors(cors), { cacheControl: 'no-store' }), {
      outcome: 'denied',
      error: 'origin_not_allowed',
      stage: 'cors',
    });
  }

  if (req.method !== 'POST') {
    const response = appendCorsHeaders(json(405, { error: 'method_not_allowed' }), cors);
    return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
      outcome: 'denied',
      error: 'method_not_allowed',
      stage: 'method',
    });
  }

  try {
    const auth = await authenticateRequest(req);
    if (auth.status !== 200 || !auth.user) {
      if (auth.status === 401 || auth.status === 403) {
        await logUnauthorizedAccess(req, auth.error ?? 'unauthorized');
      }
      const response = appendCorsHeaders(json(auth.status, { error: 'unauthorized' }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'denied',
        error: 'unauthorized',
        stage: 'auth',
      });
    }

    hashedUserId = hash(auth.user.id);

    const rateDecision = await enforceEdgeRateLimit(req, {
      route: 'assess-start',
      userId: auth.user.id,
      description: 'start assessment instrument delivery',
      limit: 10,
      windowMs: 60_000,
    });

    if (!rateDecision.allowed) {
      addSentryBreadcrumb({
        category: 'assess',
        message: 'assess:start:rate_limited',
        data: { identifier: rateDecision.identifier, retry_after: rateDecision.retryAfterSeconds },
      });
      const response = buildRateLimitResponse(rateDecision, cors.headers);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'denied',
        error: 'rate_limited',
        stage: 'rate_limit',
      });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      const response = appendCorsHeaders(json(422, { error: 'invalid_body' }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'denied',
        error: 'invalid_body',
        stage: 'body_parse',
      });
    }

    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      const response = appendCorsHeaders(json(422, { error: 'invalid_body' }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'denied',
        error: 'validation_failed',
        stage: 'validation',
      });
    }

    const instrument = parsed.data.instrument as InstrumentCode;
    const locale = (parsed.data.locale ?? 'fr') as LocaleCode;

    addSentryBreadcrumb({
      category: 'assess',
      message: 'assess:start.request',
      data: { instrument, locale },
    });

    if (!isInstrumentEnabled(instrument)) {
      const response = appendCorsHeaders(json(404, { error: 'instrument_disabled' }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'denied',
        error: 'instrument_disabled',
        stage: 'feature_flag',
      });
    }

    const consent = await ensureClinicalOptIn(auth.user.id, instrument);
    if (consent.status !== 200) {
      const response = appendCorsHeaders(json(consent.status, { error: consent.error }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'denied',
        error: consent.status === 500 ? consent.detail : consent.error,
        stage: 'optin',
      });
    }

  let catalog: any;
    try {
      catalog = getCatalog(instrument, locale);
    } catch (error) {
      console.error('[assess-start] failed to resolve catalog', { instrument, locale, error });
      const response = appendCorsHeaders(json(500, { error: 'internal_error' }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'error',
        error: 'catalog_error',
        stage: 'catalog',
      });
    }

    const etag = await computeEtag(catalog);

    if (etagMatches(req, etag)) {
      const response = appendCorsHeaders(new Response(null, { status: 304 }), cors);
      const secured = applySecurityHeaders(response, {
        cacheControl: CACHE_CONTROL,
        extra: { ETag: `"${etag}"` },
      });
      return finalize(secured, { outcome: 'success', stage: 'not_modified' });
    }

    addSentryBreadcrumb({
      category: 'assess',
      message: 'assess:start.success',
      data: { instrument, locale },
    });

    await logAccess({
      user_id: hashedUserId,
      role: auth.user.user_metadata?.role ?? null,
      route: 'assess-start',
      action: 'assess:start',
      result: 'success',
      user_agent: 'redacted',
      details: `instrument=${instrument} locale=${locale}`,
    });

    const response = appendCorsHeaders(json(200, catalog), cors);
    const secured = applySecurityHeaders(response, {
      cacheControl: CACHE_CONTROL,
      extra: { ETag: `"${etag}"` },
    });
    return finalize(secured, { outcome: 'success', stage: 'catalog_served' });
  } catch (error) {
    captureSentryException(error, { route: 'assess-start' });
    console.error('[assess-start] unexpected error', { message: error instanceof Error ? error.message : 'unknown' });
    const response = appendCorsHeaders(json(500, { error: 'internal_error' }), cors);
    return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
      outcome: 'error',
      error: 'internal_error',
      stage: 'unhandled',
    });
  }
});

export const __test__ = {
  readFlag,
  isInstrumentEnabled,
  computeEtag,
};
