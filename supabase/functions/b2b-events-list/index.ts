import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import {
  appendAuditLog,
  buildCorsHeaders,
  getAuthContext,
  isSuiteEnabled,
  jsonResponse,
  serviceClient,
} from '../_shared/b2b.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

function enforceSuiteEnabled(req: Request) {
  if (!isSuiteEnabled()) {
    throw jsonResponse(req, 404, { error: 'not_found' });
  }
}

serve(async (req) => {
  const corsHeaders = {
    ...buildCorsHeaders(req),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    enforceSuiteEnabled(req);

    if (req.method !== 'GET') {
      return jsonResponse(req, 405, { error: 'method_not_allowed' });
    }

    const auth = await getAuthContext(req).catch((error) => {
      if (error instanceof Response) return error;
      return jsonResponse(req, 401, { error: 'unauthorized' });
    });

    if (auth instanceof Response) {
      return auth;
    }

    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'b2b-events-list',
      userId: auth.userId,
      limit: 30,
      windowMs: 60_000,
      description: 'B2B events list API',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        error: 'Too many requests',
        retryAfter: rateLimit.retryAfter,
      });
    }

    const { data, error } = await serviceClient
      .from('org_events')
      .select('id, title, description, starts_at, ends_at, location, reminders, created_at')
      .eq('org_id', auth.orgId)
      .order('starts_at', { ascending: true });

    if (error) {
      console.error('[b2b] events list failed', error);
      return jsonResponse(req, 500, { error: 'query_failed' });
    }

    await appendAuditLog({
      orgId: auth.orgId,
      actorId: auth.userId,
      event: 'event.list.viewed',
      target: `org:${auth.orgId}`,
      summary: 'Consultation des événements',
    });

    return jsonResponse(req, 200, { events: data ?? [] });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error('[b2b] events list error', error);
    return jsonResponse(req, 500, { error: 'unexpected_error' });
  }
});
