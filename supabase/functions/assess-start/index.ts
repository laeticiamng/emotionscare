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

const requestSchema = z.object({
  instrument: instrumentSchema,
  locale: localeSchema.optional(),
});

serve(async (req) => {
  const cors = resolveCors(req);

  if (req.method === 'OPTIONS') {
    return preflightResponse(cors);
  }

  if (!cors.allowed) {
    return rejectCors(cors);
  }

  if (req.method !== 'POST') {
    return appendCorsHeaders(new Response('Method Not Allowed', { status: 405 }), cors);
  }

  try {
    const auth = await authenticateRequest(req);
    if (auth.status !== 200 || !auth.user) {
      if (auth.status === 401 || auth.status === 403) {
        await logUnauthorizedAccess(req, auth.error ?? 'unauthorized');
      }
      return appendCorsHeaders(json(auth.status, { error: 'unauthorized' }), cors);
    }

    const rateDecision = await enforceEdgeRateLimit(req, {
      route: 'assess-start',
      userId: auth.user.id,
      description: 'start assessment instrument delivery',
    });
    if (!rateDecision.allowed) {
      return buildRateLimitResponse(rateDecision, cors.headers);
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return appendCorsHeaders(json(422, { error: 'invalid_body' }), cors);
    }

    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return appendCorsHeaders(json(422, { error: 'invalid_body', details: 'validation_failed' }), cors);
    }

    const { instrument, locale } = parsed.data;
    const catalog = getCatalog(instrument, locale ?? 'fr');

    addSentryBreadcrumb({
      category: 'assess:start',
      message: 'catalog served',
      data: { instrument },
    });

    await logAccess({
      user_id: hash(auth.user.id),
      role: auth.user.user_metadata?.role ?? null,
      route: 'assess-start',
      action: 'assess:start',
      result: 'success',
      user_agent: 'redacted',
      details: `instrument=${instrument}`,
    });

    const response = json(200, catalog);
    return appendCorsHeaders(response, cors);
  } catch (error) {
    captureSentryException(error, { route: 'assess-start' });
    console.error('[assess-start] unexpected error', { message: error instanceof Error ? error.message : 'unknown' });
    return appendCorsHeaders(json(500, { error: 'internal_error' }), cors);
  }
});
