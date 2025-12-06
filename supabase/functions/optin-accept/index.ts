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

type ConsentRow = {
  id: string;
  version: string;
  scope: Record<string, boolean>;
  accepted_at: string | null;
};

const requestSchema = z.object({
  version: z.string().min(1),
  scope: z.record(z.boolean()).default({}),
});

function isSameScope(a: Record<string, boolean>, b: Record<string, boolean>): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  return Array.from(keys).every((key) => Boolean(a[key]) === Boolean(b[key]));
}

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
    .from('consents')
    .select('id, version, scope, accepted_at')
    .eq('user_id', auth.user.id)
    .is('revoked_at', null)
    .maybeSingle<ConsentRow>();

  if (selectError) {
    console.error('[optin-accept] failed to fetch active consent', { message: selectError.message });
    return finalize(json(500, { error: 'consent_lookup_failed' }));
  }

  if (activeConsent && activeConsent.version === parsed.data.version && isSameScope(activeConsent.scope ?? {}, parsed.data.scope)) {
    await logAccess({
      user_id: hashedUserId,
      route: 'optin-accept',
      action: 'accept',
      result: 'success',
      user_agent: 'redacted',
      details: `version:${parsed.data.version}`,
    });
    return finalize(json(200, {
      status: 'accepted',
      accepted_at: activeConsent.accepted_at,
      version: activeConsent.version,
    }));
  }

  if (activeConsent) {
    const { error: revokeError } = await client
      .from('consents')
      .update({ revoked_at: now })
      .eq('user_id', auth.user.id)
      .is('revoked_at', null)
      .select('id')
      .maybeSingle();

    if (revokeError) {
      console.error('[optin-accept] failed to revoke previous consent', { message: revokeError.message });
      return finalize(json(500, { error: 'revoke_failed' }));
    }
  }

  const { data: inserted, error: insertError } = await client
    .from('consents')
    .insert({
      user_id: auth.user.id,
      version: parsed.data.version,
      scope: parsed.data.scope,
      accepted_at: now,
    })
    .select('accepted_at, version')
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
    details: `version:${inserted.version}`,
  });

  return finalize(json(200, {
    status: 'accepted',
    accepted_at: inserted.accepted_at,
    version: inserted.version,
  }));
});
