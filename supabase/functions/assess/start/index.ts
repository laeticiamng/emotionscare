// @ts-nocheck
import { serve } from '../../_shared/serve.ts';
import { z } from '../../_shared/zod.ts';
import { authenticateRequest, logUnauthorizedAccess } from '../../_shared/auth-middleware.ts';
import { appendCorsHeaders, preflightResponse, rejectCors, resolveCors } from '../../_shared/cors.ts';
import { applySecurityHeaders, json } from '../../_shared/http.ts';
import { addSentryBreadcrumb, captureSentryException } from '../../_shared/sentry.ts';
import { traced } from '../../_shared/otel.ts';
import { recordEdgeLatencyMetric } from '../../_shared/metrics.ts';
import { createClient } from '../../_shared/supabase.ts';
import { hash } from '../../_shared/hash_user.ts';

const SESSION_TTL_MS = 15 * 60 * 1000;

const startSchema = z.object({
  instrument: z.enum([
    'WHO5','STAI6','PANAS10','PSS10','UCLA3','MSPSS','AAQ2','POMS_SF','SSQ',
    'ISI','GAS','GRITS','BRS','WEMWBS','SWEMWBS','UWES9','CBI','CVSQ','SAM','SUDS'
  ]),
  lang: z.string().min(2).max(5).default('fr'),
  context: z.enum(['pre','post','weekly','monthly','adhoc']).optional()
});

type StartPayload = z.infer<typeof startSchema>;

type CatalogRow = {
  item_id: string;
  prompt: string;
  choices: unknown | null;
};

type SessionEntry = {
  user_id: string;
  instrument: StartPayload['instrument'];
  lang: string;
  context: StartPayload['context'] | null;
  item_ids: string[];
  created_at: number;
  expires_at: number;
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

function featureKey(instrument: StartPayload['instrument']): string {
  return `FF_ASSESS_${instrument}`;
}

async function fetchCatalog(
  client: ReturnType<typeof createClient>,
  instrument: StartPayload['instrument'],
  lang: string,
): Promise<CatalogRow[]> {
  const { data, error } = await traced(
    'supabase.catalog',
    () =>
      client
        .from('assess_items_catalog')
        .select('item_id,prompt,choices')
        .eq('instrument', instrument)
        .eq('version', 'v1')
        .eq('lang', lang)
        .order('item_id', { ascending: true }),
    {
      attributes: { route: 'assess/start', instrument, lang },
    },
  );

  if (error) {
    throw new Error(`catalog_fetch_failed:${error.message}`);
  }
  return data ?? [];
}

async function ensureFeatureFlag(
  client: ReturnType<typeof createClient>,
  instrument: StartPayload['instrument'],
): Promise<boolean> {
  const key = featureKey(instrument);
  const { data, error } = await traced(
    'supabase.feature',
    () =>
      client
        .from('assess_features')
        .select('enabled')
        .eq('key', key)
        .maybeSingle(),
    { attributes: { route: 'assess/start', feature: key } },
  );

  if (error) {
    console.error('[assess/start] feature flag lookup failed', { message: error.message });
    return true;
  }

  if (!data) {
    return true;
  }

  return Boolean(data.enabled);
}

async function storeSession(sessionId: string, entry: SessionEntry) {
  const kv = await Deno.openKv();
  await kv.set(['assess', 'session', sessionId], entry, { expireIn: SESSION_TTL_MS });
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
      route: 'assess/start',
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

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('[assess/start] missing Supabase configuration');
    const response = appendCorsHeaders(json(500, { error: 'SERVER_ERROR' }), cors);
    return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
      outcome: 'error',
      error: 'configuration_missing',
      stage: 'config',
    });
  }

  try {
    const auth = await authenticateRequest(req);
    if (auth.status !== 200 || !auth.user) {
      if (auth.status === 401 || auth.status === 403) {
        await logUnauthorizedAccess(req, auth.error ?? 'unauthorized');
      }
      const response = appendCorsHeaders(json(auth.status, { error: 'FORBIDDEN' }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'denied',
        error: 'auth_failed',
        stage: 'auth',
      });
    }

    hashedUserId = hash(auth.user.id);

    const body = await req.json().catch(() => null);
    if (!body) {
      const response = appendCorsHeaders(json(422, { error: 'INVALID_PAYLOAD' }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'denied',
        error: 'invalid_payload',
        stage: 'payload',
      });
    }

    const parsed = startSchema.safeParse(body);
    if (!parsed.success) {
      const response = appendCorsHeaders(json(422, { error: 'INVALID_PAYLOAD' }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'denied',
        error: 'validation_failed',
        stage: 'payload',
      });
    }

    const payload = parsed.data;
    const client = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const enabled = await ensureFeatureFlag(client, payload.instrument);
    if (!enabled) {
      addSentryBreadcrumb({
        category: 'assess.start',
        message: 'feature_flag_off',
        data: { instrument: payload.instrument },
      });
      const response = appendCorsHeaders(json(404, { error: 'FEATURE_OFF' }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'denied',
        error: 'feature_off',
        stage: 'feature',
      });
    }

    let catalog = await fetchCatalog(client, payload.instrument, payload.lang);
    if (catalog.length === 0 && payload.lang !== 'en') {
      catalog = await fetchCatalog(client, payload.instrument, 'en');
    }

    if (catalog.length === 0) {
      const response = appendCorsHeaders(json(404, { error: 'catalog_missing' }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'error',
        error: 'catalog_missing',
        stage: 'catalog',
      });
    }

    const sessionId = crypto.randomUUID();
    const createdAt = Date.now();
    const expiresAt = createdAt + SESSION_TTL_MS;

    await storeSession(sessionId, {
      user_id: auth.user.id,
      instrument: payload.instrument,
      lang: payload.lang,
      context: payload.context ?? null,
      item_ids: catalog.map((row) => row.item_id),
      created_at: createdAt,
      expires_at: expiresAt,
    });

    const responsePayload = {
      session_id: sessionId,
      items: catalog.map((row) => ({
        id: row.item_id,
        prompt: row.prompt,
        choices: Array.isArray(row.choices)
          ? (row.choices as (string | number)[])
          : undefined,
      })),
      expiry_ts: expiresAt,
    };

    const response = appendCorsHeaders(json(200, responsePayload), cors);
    return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
      outcome: 'success',
    });
  } catch (error) {
    console.error('[assess/start] unexpected failure', error);
    captureSentryException(error);
    const response = appendCorsHeaders(json(500, { error: 'SERVER_ERROR' }), cors);
    return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
      outcome: 'error',
      error: 'unexpected',
      stage: 'exception',
    });
  }
});
