import { serve } from '../_shared/serve.ts';
import { z } from '../_shared/zod.ts';
import { createClient } from '../_shared/supabase.ts';

import { authenticateRequest, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';
import { sanitizeAggregateText, instrumentSchema } from '../_shared/assess.ts';
import { appendCorsHeaders, preflightResponse, rejectCors, resolveCors } from '../_shared/cors.ts';
import { json } from '../_shared/http.ts';
import { hash } from '../_shared/hash_user.ts';
import { logAccess } from '../_shared/logging.ts';
import { addSentryBreadcrumb, captureSentryException } from '../_shared/sentry.ts';
import { buildRateLimitResponse, enforceEdgeRateLimit } from '../_shared/rate-limit.ts';
import { recordEdgeLatencyMetric } from '../_shared/metrics.ts';

const aggregateSchema = z.object({
  org_id: z.string().min(1),
  period: z.string().min(1),
  instruments: z.array(instrumentSchema).optional(),
});

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

serve(async (req) => {
  const startedAt = Date.now();
  const cors = resolveCors(req);
  let hashedUserId: string | null = null;
  let hashedOrgId: string | null = null;

  const finalize = async (
    response: Response,
    metadata: { outcome?: 'success' | 'error' | 'denied'; stage?: string | null; error?: string | null } = {},
  ) => {
    await recordEdgeLatencyMetric({
      route: 'assess-aggregate',
      durationMs: Date.now() - startedAt,
      status: response.status,
      hashedUserId,
      hashedOrgId,
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

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[assess-aggregate] missing Supabase configuration');
    const response = appendCorsHeaders(json(500, { error: 'configuration_error' }), cors);
    return finalize(response, { outcome: 'error', error: 'configuration_error' });
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
      route: 'assess-aggregate',
      userId: auth.user.id,
      description: 'aggregate assessment rollups',
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

    const parsed = aggregateSchema.safeParse(body);
    if (!parsed.success) {
      const response = appendCorsHeaders(json(422, { error: 'invalid_body', details: 'validation_failed' }), cors);
      return finalize(response, { outcome: 'denied', error: 'validation_failed' });
    }

    const { org_id: orgId, period, instruments } = parsed.data;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    hashedOrgId = hash(orgId);

    let query = supabase
      .from('org_assess_rollups')
      .select('instrument, period, n, text_summary')
      .eq('org_id', orgId)
      .eq('period', period);

    if (instruments && instruments.length > 0) {
      query = query.in('instrument', instruments);
    }

    const { data, error } = await query;
    if (error) {
      captureSentryException(error, { route: 'assess-aggregate', stage: 'db_read' });
      console.error('[assess-aggregate] failed to load rollups', { message: error.message });
      const response = appendCorsHeaders(json(500, { error: 'read_failed' }), cors);
      return finalize(response, { outcome: 'error', error: 'read_failed', stage: 'db_read' });
    }

    const summaries = (data ?? [])
      .filter((row) => typeof row.n === 'number' && row.n >= 5)
      .map((row) => ({
        instrument: row.instrument,
        period: row.period,
        text: sanitizeAggregateText(row.text_summary ?? ''),
      }));

    addSentryBreadcrumb({
      category: 'assess',
      message: 'assess:aggregate:summaries_served',
      data: {
        instruments: summaries.map((entry) => entry.instrument),
        latency_ms: Date.now() - startedAt,
      },
    });

    await logAccess({
      user_id: hashedUserId,
      role: auth.user.user_metadata?.role ?? null,
      route: 'assess-aggregate',
      action: 'assess:aggregate',
      result: 'success',
      user_agent: 'redacted',
      details: `org=${hashedOrgId};period=${period}`,
    });

    const response = appendCorsHeaders(json(200, { summaries }), cors);
    return finalize(response, { outcome: 'success', stage: 'summaries_served' });
  } catch (error) {
    captureSentryException(error, { route: 'assess-aggregate' });
    console.error('[assess-aggregate] unexpected error', { message: error instanceof Error ? error.message : 'unknown' });
    const response = appendCorsHeaders(json(500, { error: 'internal_error' }), cors);
    return finalize(response, { outcome: 'error', error: 'internal_error' });
  }
});