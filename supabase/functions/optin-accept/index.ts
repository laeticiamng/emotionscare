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
  scope: z.string().min(1).default('clinical'),
});

function getSupabaseClient(req: Request) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  return createClient(supabaseUrl, anonKey, {
    global: {
      headers: {
        Authorization: req.headers.get('authorization') ?? '',
      },
    },
  });
}

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
      route: 'optin-accept',
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
    route: 'optin-accept',
    userId: auth.user.id,
    limit: 5,
    windowMs: 60_000,
    description: 'clinical opt-in acceptance',
  });

  if (!rateDecision.allowed) {
    return finalize(buildRateLimitResponse(rateDecision, cors.headers), { cors: false });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return finalize(json(422, { error: 'invalid_body' }));
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return finalize(json(422, { error: 'invalid_body' }));
  }

  const client = getSupabaseClient(req);
  const now = new Date().toISOString();

  const { data: activeConsent, error: selectError } = await client
    .from('clinical_optins')
    .select('id, scope, created_at')
    .eq('user_id', auth.user.id)
    .eq('scope', parsed.data.scope)
    .is('revoked_at', null)
    .maybeSingle();

  if (selectError) {
    console.error('[optin-accept] failed to fetch active consent', { message: selectError.message });
    return finalize(json(500, { error: 'consent_lookup_failed' }));
  }

  if (activeConsent) {
    await logAccess({
      user_id: hashedUserId,
      route: 'optin-accept',
      action: 'accept',
      result: 'success',
      user_agent: 'redacted',
      details: `scope:${parsed.data.scope}`,
    });
    return finalize(json(200, {
      status: 'accepted',
      scope: activeConsent.scope,
      created_at: activeConsent.created_at,
    }));
  }

  const { data: inserted, error: insertError } = await client
    .from('clinical_optins')
    .insert({
      user_id: auth.user.id,
      scope: parsed.data.scope,
    })
    .select('scope, created_at')
    .single();

  if (insertError || !inserted) {
    console.error('[optin-accept] failed to insert consent', { message: insertError?.message });
    return finalize(json(500, { error: 'insert_failed' }));
  }

  await logAccess({
    user_id: hashedUserId,
    route: 'optin-accept',
    action: 'accept',
    result: 'success',
    user_agent: 'redacted',
    details: `scope:${inserted.scope}`,
  });

  return finalize(json(200, {
    status: 'accepted',
    scope: inserted.scope,
    created_at: inserted.created_at,
  }));
});
