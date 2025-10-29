import { serve } from '../_shared/serve.ts';
import { z } from '../_shared/zod.ts';

import { authenticateRequest, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';
import { appendCorsHeaders, preflightResponse, rejectCors, resolveCors } from '../_shared/cors.ts';
import { applySecurityHeaders, json } from '../_shared/http.ts';
import { hash } from '../_shared/hash_user.ts';
import { logAccess } from '../_shared/logging.ts';
import { buildRateLimitResponse, enforceEdgeRateLimit } from '../_shared/rate-limit.ts';
import { createClient } from '../_shared/supabase.ts';
import { recordEdgeLatencyMetric } from '../_shared/metrics.ts';

const requestSchema = z.object({
  scope: z.string().min(1).default('coach'),
  reason: z.string().min(1).max(500).optional(),
});

serve(async (req) => {
  const startedAt = Date.now();
  const cors = resolveCors(req);
  let hashedUserId: string | null = null;

  const finalize = async (
    response: Response,
    options: { cors?: boolean } = {},
  ) => {
    const responseWithCors = options.cors === false ? response : appendCorsHeaders(response, cors);
    const secured = applySecurityHeaders(responseWithCors, { cacheControl: 'no-store' });
    await recordEdgeLatencyMetric({
      route: 'optin-revoke',
      durationMs: Date.now() - startedAt,
      status: secured.status,
      hashedUserId,
    });
    return secured;
  };

  if (req.method === 'OPTIONS') {
    return finalize(preflightResponse(cors));
  }

  if (!cors.allowed) {
    return finalize(rejectCors(cors), { cors: false });
  }

  if (req.method !== 'POST') {
    return finalize(json(405, { error: 'method_not_allowed' }));
  }

  const auth = await authenticateRequest(req);
  if (auth.status !== 200 || !auth.user) {
    if (auth.status === 401 || auth.status === 403) {
      await logUnauthorizedAccess(req, auth.error ?? 'unauthorized');
    }
    return finalize(json(auth.status, { error: 'unauthorized' }));
  }

  hashedUserId = hash(auth.user.id);

  const rateDecision = await enforceEdgeRateLimit(req, {
    route: 'optin-revoke',
    userId: auth.user.id,
    limit: 5,
    windowMs: 60_000,
    description: 'clinical opt-in revocation',
  });

  if (!rateDecision.allowed) {
    return finalize(buildRateLimitResponse(rateDecision, cors.headers), { cors: false });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return finalize(json(422, { error: 'invalid_body' }));
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  const client = createClient(supabaseUrl, anonKey, {
    global: {
      headers: {
        Authorization: req.headers.get('authorization') ?? '',
      },
    },
  });

  const now = new Date().toISOString();

  const { data: revoked, error: revokeError } = await client
    .from('clinical_optins')
    .update({ revoked_at: now })
    .eq('user_id', auth.user.id)
    .eq('scope', parsed.data.scope)
    .is('revoked_at', null)
    .select('revoked_at')
    .maybeSingle();

  if (revokeError) {
    console.error('[optin-revoke] failed to revoke consent', { message: revokeError.message });
    return finalize(json(500, { error: 'revoke_failed' }));
  }

  const revokedAt = revoked?.revoked_at ?? now;

  await logAccess({
    user_id: hashedUserId,
    route: 'optin-revoke',
    action: 'revoke',
    result: 'success',
    user_agent: 'redacted',
    details: parsed.data.reason ? 'reason:provided' : `scope:${parsed.data.scope}`,
  });

  return finalize(json(200, {
    status: 'revoked',
    revoked_at: revokedAt,
  }));
});
