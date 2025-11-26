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

    if (auth.orgRole !== 'admin' && auth.orgRole !== 'manager') {
      return jsonResponse(req, 403, { error: 'forbidden' });
    }

    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'b2b-audit-list',
      userId: auth.userId,
      limit: 30,
      windowMs: 60_000,
      description: 'B2B audit list API',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        error: 'Too many requests',
        retryAfter: rateLimit.retryAfter,
      });
    }

    const url = new URL(req.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const event = url.searchParams.get('event');

    let query = serviceClient
      .from('org_audit_logs')
      .select('occurred_at, event, target, text_summary')
      .eq('org_id', auth.orgId)
      .order('occurred_at', { ascending: false })
      .limit(200);

    if (from) {
      query = query.gte('occurred_at', from);
    }
    if (to) {
      query = query.lte('occurred_at', to);
    }
    if (event) {
      query = query.eq('event', event);
    }

    const { data, error } = await query;
    if (error) {
      console.error('[b2b] audit list failed', error);
      return jsonResponse(req, 500, { error: 'query_failed' });
    }

    await appendAuditLog({
      orgId: auth.orgId,
      actorId: auth.userId,
      event: 'audit.list.viewed',
      target: `org:${auth.orgId}`,
      summary: 'Consultation des journaux',
    });

    return jsonResponse(req, 200, { items: data ?? [] });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error('[b2b] audit list error', error);
    return jsonResponse(req, 500, { error: 'unexpected_error' });
  }
});
