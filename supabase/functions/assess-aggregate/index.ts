import { serve } from '../_shared/serve.ts';
import { z } from '../_shared/zod.ts';
import { createClient } from '../_shared/supabase.ts';

import { authenticateRequest, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';
import { instrumentSchema } from '../_shared/assess.ts';
import { sanitizeAggregateText } from '../_shared/clinical_text.ts';
import { appendCorsHeaders, preflightResponse, rejectCors, resolveCors } from '../_shared/cors.ts';
import { applySecurityHeaders, json } from '../_shared/http.ts';
import { hash } from '../_shared/hash_user.ts';
import { logAccess } from '../_shared/logging.ts';
import { addSentryBreadcrumb, captureSentryException } from '../_shared/sentry.ts';
import { buildRateLimitResponse, enforceEdgeRateLimit } from '../_shared/rate-limit.ts';
import { recordEdgeLatencyMetric } from '../_shared/metrics.ts';

const aggregateSchema = z.object({
  org_id: z.string().uuid(),
  period: z.string().regex(/^[0-9]{4}-(0[1-9]|1[0-2]|W[0-5][0-9])$/, 'invalid_period'),
  instruments: z.array(instrumentSchema).optional(),
});

const ORG_ALLOWED_ROLES = ['b2b_admin', 'b2b_hr', 'b2b_user', 'admin'] as const;

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

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
    return finalize(applySecurityHeaders(preflightResponse(cors), { cacheControl: 'no-store' }));
  }

  if (!cors.allowed) {
    return finalize(applySecurityHeaders(rejectCors(cors), { cacheControl: 'no-store' }), {
      outcome: 'denied',
      error: 'origin_not_allowed',
    });
  }

  if (req.method !== 'POST') {
    const response = appendCorsHeaders(new Response('Method Not Allowed', { status: 405 }), cors);
    return finalize(
      applySecurityHeaders(response, { cacheControl: 'no-store' }),
      { outcome: 'denied', error: 'method_not_allowed' },
    );
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('[assess-aggregate] missing Supabase configuration');
    const response = appendCorsHeaders(json(500, { error: 'configuration_error' }), cors);
    return finalize(
      applySecurityHeaders(response, { cacheControl: 'no-store' }),
      { outcome: 'error', error: 'configuration_error' },
    );
  }

  try {
    const auth = await authenticateRequest(req);
    if (auth.status !== 200 || !auth.user) {
      if (auth.status === 401 || auth.status === 403) {
        await logUnauthorizedAccess(req, auth.error ?? 'unauthorized');
      }
      const response = appendCorsHeaders(json(auth.status, { error: 'unauthorized' }), cors);
      return finalize(
        applySecurityHeaders(response, { cacheControl: 'no-store' }),
        { outcome: 'denied', error: 'unauthorized' },
      );
    }

    hashedUserId = hash(auth.user.id);

    const userRole = auth.user.user_metadata?.role ?? 'b2c';
    if (!ORG_ALLOWED_ROLES.includes(userRole as (typeof ORG_ALLOWED_ROLES)[number])) {
      await logUnauthorizedAccess(req, 'forbidden_role');
      const response = appendCorsHeaders(json(403, { error: 'forbidden' }), cors);
      return finalize(
        applySecurityHeaders(response, { cacheControl: 'no-store' }),
        { outcome: 'denied', error: 'forbidden', stage: 'role_check' },
      );
    }

    const rateDecision = await enforceEdgeRateLimit(req, {
      route: 'assess-aggregate',
      userId: auth.user.id,
      description: 'aggregate assessment rollups',
      limit: 5,
      windowMs: 60_000,
    });
    if (!rateDecision.allowed) {
      addSentryBreadcrumb({
        category: 'assess',
        message: 'assess:aggregate:rate_limited',
        data: { identifier: rateDecision.identifier, retry_after: rateDecision.retryAfterSeconds },
      });
      const response = buildRateLimitResponse(rateDecision, cors.headers);
      return finalize(
        applySecurityHeaders(response, { cacheControl: 'no-store' }),
        { outcome: 'denied', error: 'rate_limited', stage: 'rate_limit' },
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      const response = appendCorsHeaders(json(422, { error: 'invalid_body' }), cors);
      return finalize(
        applySecurityHeaders(response, { cacheControl: 'no-store' }),
        { outcome: 'denied', error: 'invalid_body' },
      );
    }

    const parsed = aggregateSchema.safeParse(body);
    if (!parsed.success) {
      const response = appendCorsHeaders(json(422, { error: 'invalid_body', details: 'validation_failed' }), cors);
      return finalize(
        applySecurityHeaders(response, { cacheControl: 'no-store' }),
        { outcome: 'denied', error: 'validation_failed' },
      );
    }

    const { org_id: orgId, period, instruments } = parsed.data;

    const metadata = auth.user.user_metadata ?? {};
    const appMetadata = auth.user.app_metadata ?? {};
    const claimedOrgIds = new Set<string>();

    if (typeof metadata.org_id === 'string' && metadata.org_id.length > 0) {
      claimedOrgIds.add(metadata.org_id);
    }
    if (Array.isArray(metadata.org_ids)) {
      metadata.org_ids.filter((value): value is string => typeof value === 'string').forEach((value) => {
        if (value.length > 0) claimedOrgIds.add(value);
      });
    }
    if (typeof appMetadata.org_id === 'string' && appMetadata.org_id.length > 0) {
      claimedOrgIds.add(appMetadata.org_id);
    }
    if (Array.isArray(appMetadata.org_ids)) {
      appMetadata.org_ids.filter((value: unknown): value is string => typeof value === 'string').forEach((value) => {
        if (value.length > 0) claimedOrgIds.add(value);
      });
    }

    if (claimedOrgIds.size === 0) {
      await logUnauthorizedAccess(req, 'missing_org_claim');
      const response = appendCorsHeaders(json(403, { error: 'forbidden' }), cors);
      return finalize(
        applySecurityHeaders(response, { cacheControl: 'no-store' }),
        { outcome: 'denied', error: 'forbidden', stage: 'org_claim_missing' },
      );
    }

    if (!claimedOrgIds.has(orgId)) {
      await logUnauthorizedAccess(req, 'forbidden_org_scope');
      const response = appendCorsHeaders(json(403, { error: 'forbidden' }), cors);
      return finalize(
        applySecurityHeaders(response, { cacheControl: 'no-store' }),
        { outcome: 'denied', error: 'forbidden', stage: 'org_scope' },
      );
    }

    const authHeader = req.headers.get('authorization');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    });

    hashedOrgId = hash(orgId);

    let query = supabase
      .from('org_assess_rollups')
      .select('instrument, period, n, text_summary')
      .eq('org_id', orgId)
      .eq('period', period)
      .gte('n', 5);

    if (instruments && instruments.length > 0) {
      query = query.in('instrument', instruments);
    }

    const { data, error } = await query;
    if (error) {
      captureSentryException(error, { route: 'assess-aggregate', stage: 'db_read' });
      console.error('[assess-aggregate] failed to load rollups', { message: error.message });
      const response = appendCorsHeaders(json(500, { error: 'read_failed' }), cors);
      return finalize(
        applySecurityHeaders(response, { cacheControl: 'no-store' }),
        { outcome: 'error', error: 'read_failed', stage: 'db_read' },
      );
    }

    const summaries = (data ?? [])
      .filter((row) => typeof row.n === 'number' && row.n >= 5)
      .map((row) => {
        const sanitizedText = sanitizeAggregateText(row.text_summary ?? '');
        return {
          instrument: row.instrument,
          period: row.period,
          text: sanitizedText,
        };
      })
      .filter((summary) => summary.text.length > 0 && !/\d/.test(summary.text));

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
    applySecurityHeaders(response, { cacheControl: 'private, max-age=120, must-revalidate' });
    return finalize(response, { outcome: 'success', stage: 'summaries_served' });
  } catch (error) {
    captureSentryException(error, { route: 'assess-aggregate' });
    console.error('[assess-aggregate] unexpected error', { message: error instanceof Error ? error.message : 'unknown' });
    const response = appendCorsHeaders(json(500, { error: 'internal_error' }), cors);
    return finalize(
      applySecurityHeaders(response, { cacheControl: 'no-store' }),
      { outcome: 'error', error: 'internal_error' },
    );
  }
});