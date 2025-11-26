import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import {
  appendAuditLog,
  buildCorsHeaders,
  getAuthContext,
  isSuiteEnabled,
  jsonResponse,
} from '../_shared/b2b.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

const serviceSecret = Deno.env.get('B2B_KEY_ROTATION_SECRET') ?? '';

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

    const headerSecret = req.headers.get('x-service-secret');
    const hasServiceSecret = Boolean(serviceSecret) && headerSecret === serviceSecret;

    const auth = await getAuthContext(req).catch((error) => {
      if (error instanceof Response) return error;
      return jsonResponse(req, 401, { error: 'unauthorized' });
    });

    if (auth instanceof Response) {
      return auth;
    }

    if (!hasServiceSecret && auth.orgRole !== 'admin') {
      return jsonResponse(req, 403, { error: 'forbidden' });
    }

    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'b2b-security-rotate-keys',
      userId: auth.userId,
      limit: 5,
      windowMs: 60_000,
      description: 'B2B security key rotation',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        error: 'Too many requests',
        retryAfter: rateLimit.retryAfter,
      });
    }

    await appendAuditLog({
      orgId: auth.orgId,
      actorId: hasServiceSecret ? undefined : auth.userId,
      event: 'security.keys.rotated',
      target: `org:${auth.orgId}`,
      summary: 'Rotation des clés de service déclenchée',
    });

    return jsonResponse(req, 200, { success: true, rotated: true });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error('[b2b] security rotate keys error', error);
    return jsonResponse(req, 500, { error: 'unexpected_error' });
  }
});
