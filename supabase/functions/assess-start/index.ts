import { serve } from '../_shared/serve.ts';
import { z } from '../_shared/zod.ts';

import { authenticateRequest, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';
import { getCatalog, instrumentSchema, localeSchema } from '../_shared/assess.ts';
import { appendCorsHeaders, preflightResponse, rejectCors, resolveCors } from '../_shared/cors.ts';
import { json } from '../_shared/http.ts';
import { hash } from '../_shared/hash_user.ts';
import { logAccess } from '../_shared/logging.ts';
import { addSentryBreadcrumb, captureSentryException } from '../_shared/sentry.ts';
import { buildRateLimitResponse, enforceEdgeRateLimit } from '../_shared/rate-limit.ts';
import { recordEdgeLatencyMetric } from '../_shared/metrics.ts';

const requestSchema = z.object({
  instrument: instrumentSchema,
  locale: localeSchema.optional(),
});

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
    return finalize(preflightResponse(cors));
  }

  if (!cors.allowed) {
    return finalize(rejectCors(cors), { outcome: 'denied', error: 'origin_not_allowed' });
  }

  if (req.method !== 'POST') {
    const response = appendCorsHeaders(new Response('Method Not Allowed', { status: 405 }), cors);
    return finalize(response, { outcome: 'denied', error: 'method_not_allowed' });
  }

  try {
    const auth = await authenticateRequest(req);
    if (auth.status !== 200 || !auth.user) {
      if (auth.status === 401 || auth.status === 403) {
        await logUnauthorizedAccess(req, auth.error ?? 'unauthorized');
      }
      const response = appendCorsHeaders(json(auth.status, { error: 'unauthorized' }), cors);
      return finalize(response, { outcome: 'denied', error: 'unauthorized' });
    }

    hashedUserId = hash(auth.user.id);

    const rateDecision = await enforceEdgeRateLimit(req, {
      route: 'assess-start',
      userId: auth.user.id,
      description: 'start assessment instrument delivery',
    });
    if (!rateDecision.allowed) {
      const response = buildRateLimitResponse(rateDecision, cors.headers);
      return finalize(response, { outcome: 'denied', error: 'rate_limited' });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      const response = appendCorsHeaders(json(422, { error: 'invalid_body' }), cors);
      return finalize(response, { outcome: 'denied', error: 'invalid_body' });
    }

    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      const response = appendCorsHeaders(json(422, { error: 'invalid_body', details: 'validation_failed' }), cors);
      return finalize(response, { outcome: 'denied', error: 'validation_failed' });
    }

    const { instrument, locale } = parsed.data;
    const catalog = getCatalog(instrument, locale ?? 'fr');

    addSentryBreadcrumb({
      category: 'assess',
      message: 'assess:start:catalog_served',
      data: { instrument, latency_ms: Date.now() - startedAt },
    });

    await logAccess({
      user_id: hashedUserId,
      role: auth.user.user_metadata?.role ?? null,
      route: 'assess-start',
      action: 'assess:start',
      result: 'success',
      user_agent: 'redacted',
      details: `instrument=${instrument}`,
    });

    const responsePayload = { instrument, locale: locale ?? 'fr', ...catalog };
    const response = appendCorsHeaders(json(200, responsePayload), cors);
    return finalize(response, { outcome: 'success', stage: 'catalog_served' });
  } catch (error) {
    captureSentryException(error, { route: 'assess-start' });
    console.error('[assess-start] unexpected error', { message: error instanceof Error ? error.message : 'unknown' });
    const response = appendCorsHeaders(json(500, { error: 'internal_error' }), cors);
    return finalize(response, { outcome: 'error', error: 'internal_error' });
  }
});