// @ts-nocheck
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import {
  appendAuditLog,
  buildCorsHeaders,
  getAuthContext,
  isSuiteEnabled,
  jsonResponse,
  serviceClient,
  sha256,
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
      route: 'b2b-security-roles',
      userId: auth.userId,
      limit: 30,
      windowMs: 60_000,
      description: 'B2B security roles API',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        error: 'Too many requests',
        retryAfter: rateLimit.retryAfter,
      });
    }

    const { data, error } = await serviceClient
      .from('org_members')
      .select('user_id, role, invited_at, joined_at')
      .eq('org_id', auth.orgId)
      .order('joined_at', { ascending: true });

    if (error) {
      console.error('[b2b] roles list failed', error);
      return jsonResponse(req, 500, { error: 'query_failed' });
    }

    const members = await Promise.all(
      (data ?? []).map(async (row, index) => {
        const identifier = (await sha256(row.user_id)).slice(0, 10);
        return {
          id: row.user_id,
          role: row.role,
          label: `Membre #${identifier.slice(0, 6)}`,
          joined_at: row.joined_at,
          invited_at: row.invited_at,
          order: index,
        };
      }),
    );

    await appendAuditLog({
      orgId: auth.orgId,
      actorId: auth.userId,
      event: 'security.roles.viewed',
      target: `org:${auth.orgId}`,
      summary: `Consultation des rôles (${members.length})`,
    });

    return jsonResponse(req, 200, { members });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error('[b2b] security roles error', error);
    return jsonResponse(req, 500, { error: 'unexpected_error' });
  }
});
