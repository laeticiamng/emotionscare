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

type DeletePayload = {
  event_id: string;
};

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

    if (req.method !== 'POST') {
      return jsonResponse(req, 405, { error: 'method_not_allowed' });
    }

    const auth = await getAuthContext(req).catch((error) => {
      if (error instanceof Response) return error;
      return jsonResponse(req, 401, { error: 'unauthorized' });
    });

    if (auth instanceof Response) {
      return auth;
    }

    if (auth.orgRole !== 'admin' && auth.orgRole !== 'manager') {
      return jsonResponse(req, 403, { error: 'forbidden' });
    }

    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'b2b-events-delete',
      userId: auth.userId,
      limit: 20,
      windowMs: 60_000,
      description: 'B2B events delete API',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        error: 'Too many requests',
        retryAfter: rateLimit.retryAfter,
      });
    }

    const payload = (await req.json().catch(() => null)) as DeletePayload | null;
    if (!payload || typeof payload.event_id !== 'string' || payload.event_id.length === 0) {
      return jsonResponse(req, 400, { error: 'invalid_payload' });
    }

    const { data, error } = await serviceClient
      .from('org_events')
      .delete()
      .eq('org_id', auth.orgId)
      .eq('id', payload.event_id)
      .select('id')
      .single();

    if (error || !data) {
      return jsonResponse(req, 404, { error: 'event_not_found' });
    }

    await appendAuditLog({
      orgId: auth.orgId,
      actorId: auth.userId,
      event: 'event.deleted',
      target: `event:${payload.event_id}`,
      summary: 'Événement supprimé',
    });

    return jsonResponse(req, 200, { success: true });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error('[b2b] events delete error', error);
    return jsonResponse(req, 500, { error: 'unexpected_error' });
  }
});
