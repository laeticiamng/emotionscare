import { serve } from '../_shared/serve.ts';
import { z } from '../_shared/zod.ts';
import { createClient } from '../_shared/supabase.ts';

import { authenticateRequest, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';
import { getCatalog, instrumentSchema, sanitizeSummaryText, summarizeAssessment } from '../_shared/assess.ts';
import { appendCorsHeaders, preflightResponse, rejectCors, resolveCors } from '../_shared/cors.ts';
import { json } from '../_shared/http.ts';
import { hash } from '../_shared/hash_user.ts';
import { logAccess } from '../_shared/logging.ts';
import { addSentryBreadcrumb, captureSentryException } from '../_shared/sentry.ts';
import { buildRateLimitResponse, enforceEdgeRateLimit } from '../_shared/rate-limit.ts';

const answerValueSchema = z.union([z.string(), z.number(), z.boolean()]);

const submitSchema = z.object({
  instrument: instrumentSchema,
  answers: z.record(answerValueSchema).refine(
    (value) => Object.keys(value).length > 0,
    'answers_required',
  ),
  ts: z.string().datetime().optional(),
});

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

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

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('[assess-submit] missing Supabase configuration');
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
      route: 'assess-submit',
      userId: auth.user.id,
      description: 'submit assessment answers',
    });
    if (!rateDecision.allowed) {
      return buildRateLimitResponse(rateDecision, cors.headers);
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return appendCorsHeaders(json(422, { error: 'invalid_body' }), cors);
    }

    const parsed = submitSchema.safeParse(body);
    if (!parsed.success) {
      return appendCorsHeaders(json(422, { error: 'invalid_body', details: 'validation_failed' }), cors);
    }

    const { instrument, answers, ts } = parsed.data;
    const summary = summarizeAssessment(instrument, answers);
    const catalog = getCatalog(instrument, 'fr');
    const sanitizedSummary = sanitizeSummaryText(summary.summary);

    addSentryBreadcrumb({
      category: 'assess:submit',
      message: 'summary generated',
      data: { instrument },
    });

    addSentryBreadcrumb({
      category: 'assess:submit',
      message: 'storing sanitized summary',
      data: { instrument },
    });

    const authHeader = req.headers.get('authorization') ?? '';
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const payload = {
      user_id: auth.user.id,
      instrument,
      score_json: {
        summary: sanitizedSummary,
        focus: summary.focus,
        instrument_version: catalog.version,
        generated_at: new Date().toISOString(),
      },
      ts: ts ?? new Date().toISOString(),
    };

    const { error } = await supabase.from('assessments').insert(payload);
    if (error) {
      captureSentryException(error, { route: 'assess-submit', stage: 'db_insert' });
      console.error('[assess-submit] failed to store summary', { message: error.message });
      return appendCorsHeaders(json(500, { error: 'storage_failed' }), cors);
    }

    await logAccess({
      user_id: hash(auth.user.id),
      role: auth.user.user_metadata?.role ?? null,
      route: 'assess-submit',
      action: 'assess:submit',
      result: 'success',
      user_agent: 'redacted',
      details: `instrument=${instrument}`,
    });

    addSentryBreadcrumb({
      category: 'assess:submit',
      message: 'assessment stored',
      data: { instrument },
    });

    const response = json(200, { status: 'ok', stored: true });
    return appendCorsHeaders(response, cors);
  } catch (error) {
    captureSentryException(error, { route: 'assess-submit' });
    console.error('[assess-submit] unexpected error', { message: error instanceof Error ? error.message : 'unknown' });
    return appendCorsHeaders(json(500, { error: 'internal_error' }), cors);
  }
});
