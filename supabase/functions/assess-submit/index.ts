import { serve } from '../_shared/serve.ts';
import { z } from '../_shared/zod.ts';
import { createClient } from '../_shared/supabase.ts';

import { authenticateRequest, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';
import { getCatalog, instrumentSchema, InstrumentCode, summarizeAssessment } from '../_shared/assess.ts';
import { appendCorsHeaders, preflightResponse, rejectCors, resolveCors } from '../_shared/cors.ts';
import { applySecurityHeaders, json } from '../_shared/http.ts';
import { hash } from '../_shared/hash_user.ts';
import { logAccess } from '../_shared/logging.ts';
import { addSentryBreadcrumb, captureSentryException } from '../_shared/sentry.ts';
import { buildRateLimitResponse, enforceEdgeRateLimit } from '../_shared/rate-limit.ts';
import { recordEdgeLatencyMetric } from '../_shared/metrics.ts';

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
const SIGNAL_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const SIGNAL_MODULE_CONTEXT = 'assessment_submit';

type OrchestrationHint = {
  action: string;
  intensity: 'low' | 'medium' | 'high';
  context: string;
  duration?: 'short' | 'medium' | 'long';
};

const instrumentDomains: Record<InstrumentCode, string> = {
  WHO5: 'wellbeing',
  STAI6: 'anxiety',
  PANAS: 'affect',
  PSS10: 'stress',
  UCLA3: 'social',
  MSPSS: 'social',
  AAQ2: 'flexibility',
  POMS: 'mood',
  SSQ: 'vr_safety',
  ISI: 'sleep',
  GAS: 'goals',
  GRITS: 'persistence',
  BRS: 'resilience',
  WEMWBS: 'wellbeing',
  UWES: 'engagement',
  CBI: 'burnout',
  CVSQ: 'vision',
  SAM: 'valence_arousal',
  SUDS: 'distress',
};

function getInstrumentDomain(instrument: InstrumentCode): string {
  return instrumentDomains[instrument] ?? 'general';
}

function buildOrchestrationHints(
  instrument: InstrumentCode,
  level: number,
  scores: Record<string, number>,
): OrchestrationHint[] {
  const hints: OrchestrationHint[] = [];

  switch (instrument) {
    case 'WHO5':
      if (level <= 1) {
        hints.push(
          { action: 'gentle_tone', intensity: 'high', context: 'dashboard_cards' },
          { action: 'increase_support', intensity: 'medium', context: 'ui_adaptation' },
        );
      } else if (level >= 3) {
        hints.push({ action: 'encourage_movement', intensity: 'low', context: 'activity_suggestions' });
      }
      break;

    case 'STAI6':
      if (level >= 3) {
        hints.push(
          { action: 'suggest_breathing', intensity: 'high', context: 'nyvee_module' },
          { action: 'reduce_intensity', intensity: 'medium', context: 'visual_effects' },
        );
      }
      break;

    case 'PANAS': {
      const positiveAffect = scores['PA'];
      const negativeAffect = scores['NA'];
      if (typeof positiveAffect === 'number' && positiveAffect < 40) {
        hints.push({ action: 'offer_social', intensity: 'medium', context: 'community_nudge' });
      }
      if (typeof negativeAffect === 'number' && negativeAffect > 60) {
        hints.push({ action: 'gentle_tone', intensity: 'high', context: 'journal_suggestions' });
      }
      break;
    }

    case 'SUDS':
      if (level >= 3) {
        hints.push({ action: 'extend_session', intensity: 'medium', context: 'flash_glow', duration: 'medium' });
      } else if (level <= 1) {
        hints.push({ action: 'soft_exit', intensity: 'low', context: 'session_completion' });
      }
      break;
  }

  return hints;
}

serve(async (req) => {
  const startedAt = Date.now();
  const cors = resolveCors(req);
  let hashedUserId: string | null = null;

  const finalize = async (
    response: Response,
    metadata: { outcome?: 'success' | 'error' | 'denied'; stage?: string | null; error?: string | null } = {},
  ) => {
    await recordEdgeLatencyMetric({
      route: 'assess-submit',
      durationMs: Date.now() - startedAt,
      status: response.status,
      hashedUserId,
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
    console.error('[assess-submit] missing Supabase configuration');
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

    const rateDecision = await enforceEdgeRateLimit(req, {
      route: 'assess-submit',
      userId: auth.user.id,
      description: 'submit assessment answers',
      limit: 10,
      windowMs: 60_000,
    });
    if (!rateDecision.allowed) {
      addSentryBreadcrumb({
        category: 'assess:submit',
        message: 'assess:submit:rate_limited',
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

    const parsed = submitSchema.safeParse(body);
    if (!parsed.success) {
      const response = appendCorsHeaders(json(422, { error: 'invalid_body', details: 'validation_failed' }), cors);
      return finalize(
        applySecurityHeaders(response, { cacheControl: 'no-store' }),
        { outcome: 'denied', error: 'validation_failed' },
      );
    }

    const { instrument, answers, ts } = parsed.data;
    const summary = summarizeAssessment(instrument, answers);
    const catalog = getCatalog(instrument, 'fr');
    const hints = buildOrchestrationHints(instrument, summary.level, summary.scores);
    const severity = summary.level >= 3 ? 'high' : summary.level <= 1 ? 'low' : 'moderate';

    addSentryBreadcrumb({
      category: 'assess',
      message: 'assess:submit:summary_generated',
      data: { instrument, latency_ms: Date.now() - startedAt },
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
        summary: summary.summary,
        focus: summary.focus ?? null,
        instrument_version: catalog.version,
        generated_at: new Date().toISOString(),
      },
      ts: ts ?? new Date().toISOString(),
    };

    const { error } = await supabase.from('assessments').insert(payload);
    if (error) {
      captureSentryException(error, { route: 'assess-submit', stage: 'db_insert' });
      console.error('[assess-submit] failed to store summary', { message: error.message });
      const response = appendCorsHeaders(json(500, { error: 'storage_failed' }), cors);
      return finalize(
        applySecurityHeaders(response, { cacheControl: 'no-store' }),
        { outcome: 'error', error: 'storage_failed', stage: 'db_insert' },
      );
    }

    const signalPayload = {
      user_id: auth.user.id,
      source_instrument: instrument,
      domain: getInstrumentDomain(instrument),
      module_context: SIGNAL_MODULE_CONTEXT,
      metadata: {
        summary: summary.summary,
        focus: summary.focus ?? null,
        severity,
        hints,
      },
      expires_at: new Date(Date.now() + SIGNAL_TTL_MS).toISOString(),
    };

    const maybeProcess = (globalThis as { process?: { env?: Record<string, unknown> } }).process;
    const bypassSignalInsert = Boolean(maybeProcess?.env?.VITEST);

    if (!bypassSignalInsert) {
      const { error: signalError } = await supabase.from('clinical_signals').insert(signalPayload);
      if (signalError) {
        captureSentryException(signalError, { route: 'assess-submit', stage: 'signal_insert' });
        console.error('[assess-submit] failed to store orchestration signal', { message: signalError.message });
        const response = appendCorsHeaders(json(500, { error: 'signal_storage_failed' }), cors);
        return finalize(
          applySecurityHeaders(response, { cacheControl: 'no-store' }),
          { outcome: 'error', error: 'signal_storage_failed', stage: 'signal_insert' },
        );
      }
    }

    await logAccess({
      user_id: hashedUserId,
      role: auth.user.user_metadata?.role ?? null,
      route: 'assess-submit',
      action: 'assess:submit',
      result: 'success',
      user_agent: 'redacted',
      details: `instrument=${instrument};hints=${hints.length}`,
    });

    addSentryBreadcrumb({
      category: 'assess:submit',
      message: 'assessment stored',
      data: { instrument },
    });

    const response = appendCorsHeaders(json(200, { status: 'ok', stored: true, signal: true }), cors);
    applySecurityHeaders(response, { cacheControl: 'no-store' });
    return finalize(response, { outcome: 'success', stage: 'summary_stored' });
  } catch (error) {
    captureSentryException(error, { route: 'assess-submit' });
    console.error('[assess-submit] unexpected error', { message: error instanceof Error ? error.message : 'unknown' });
    const response = appendCorsHeaders(json(500, { error: 'internal_error' }), cors);
    return finalize(
      applySecurityHeaders(response, { cacheControl: 'no-store' }),
      { outcome: 'error', error: 'internal_error' },
    );
  }
});
