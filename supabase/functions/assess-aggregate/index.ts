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

const aggregateSchema = z.object({
  org_id: z.string().min(1),
  period: z.string().min(1),
  instruments: z.array(instrumentSchema).optional(),
});

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

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

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[assess-aggregate] missing Supabase configuration');
    return appendCorsHeaders(json(500, { error: 'configuration_error' }), cors);
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
      route: 'assess-aggregate',
      userId: auth.user.id,
      description: 'aggregate assessment rollups',
    });
    if (!rateDecision.allowed) {
      return buildRateLimitResponse(rateDecision, cors.headers);
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return appendCorsHeaders(json(422, { error: 'invalid_body' }), cors);
    }

    const parsed = aggregateSchema.safeParse(body);
    if (!parsed.success) {
      return appendCorsHeaders(json(422, { error: 'invalid_body', details: 'validation_failed' }), cors);
    }

    const { org_id: orgId, period, instruments } = parsed.data;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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
      return appendCorsHeaders(json(500, { error: 'read_failed' }), cors);
    }

    const summaries = (data ?? [])
      .filter((row) => typeof row.n === 'number' && row.n >= 5)
      .map((row) => ({
        instrument: row.instrument,
        period: row.period,
        text: sanitizeAggregateText(row.text_summary ?? ''),
      }));

    addSentryBreadcrumb({
      category: 'assess:aggregate',
      message: 'aggregate served',
      data: { instruments: summaries.map((entry) => entry.instrument) },
    });

    await logAccess({
      user_id: hash(auth.user.id),
      role: auth.user.user_metadata?.role ?? null,
      route: 'assess-aggregate',
      action: 'assess:aggregate',
      result: 'success',
      user_agent: 'redacted',
      details: `org=${hash(orgId)};period=${period}`,
    });

    const response = json(200, { summaries });
    return appendCorsHeaders(response, cors);
  } catch (error) {
    captureSentryException(error, { route: 'assess-aggregate' });
    console.error('[assess-aggregate] unexpected error', { message: error instanceof Error ? error.message : 'unknown' });
    return appendCorsHeaders(json(500, { error: 'internal_error' }), cors);
  }
});