import { serve } from '../_shared/serve.ts';
import { z } from '../_shared/zod.ts';
import { createClient } from '../_shared/supabase.ts';

import { authenticateRequest, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';
import { appendCorsHeaders, preflightResponse, rejectCors, resolveCors } from '../_shared/cors.ts';
import { applySecurityHeaders, json } from '../_shared/http.ts';
import { hash } from '../_shared/hash_user.ts';
import { logAccess } from '../_shared/logging.ts';
import { addSentryBreadcrumb, captureSentryException } from '../_shared/sentry.ts';
import { traced } from '../_shared/otel.ts';
import { buildRateLimitResponse, enforceEdgeRateLimit } from '../_shared/rate-limit.ts';
import { recordEdgeLatencyMetric } from '../_shared/metrics.ts';
import { summarizeAssessment } from '../_shared/assess.ts';
import type { InstrumentCode } from '../_shared/assess.ts';

const answerValueSchema = z.union([z.string(), z.number(), z.boolean()]);

const submitSchema = z.object({
  instrument: z.enum(['WHO5', 'STAI6', 'SAM', 'SUDS']),
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

const FEATURE_FLAGS: Record<InstrumentCode, string> = {
  WHO5: Deno.env.get('FF_ASSESS_WHO5') ?? 'true',
  STAI6: Deno.env.get('FF_ASSESS_STAI6') ?? 'true',
  SAM: Deno.env.get('FF_ASSESS_SAM') ?? 'true',
  SUDS: Deno.env.get('FF_ASSESS_SUDS') ?? 'true',
};

type OrchestrationHint = {
  action: string;
  intensity: 'low' | 'medium' | 'high';
  context: string;
  duration?: 'short' | 'medium' | 'long';
};

const instrumentDomains: Record<InstrumentCode, string> = {
  WHO5: 'wellbeing',
  STAI6: 'anxiety',
  SAM: 'valence_arousal',
  SUDS: 'distress',
};

function getInstrumentDomain(instrument: InstrumentCode): string {
  return instrumentDomains[instrument] ?? 'general';
}

function buildOrchestrationHints(
  instrument: InstrumentCode,
  level: 0 | 1 | 2 | 3 | 4,
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

    case 'SUDS':
      if (level >= 3) {
        hints.push({ action: 'extend_session', intensity: 'medium', context: 'flash_glow', duration: 'medium' });
      } else if (level <= 1) {
        hints.push({ action: 'soft_exit', intensity: 'low', context: 'session_completion' });
      }
      break;

    case 'SAM':
      if (level <= 1) {
        hints.push({ action: 'warm_check_in', intensity: 'medium', context: 'mood_module' });
      } else if (level >= 3) {
        hints.push({ action: 'celebrate_mood', intensity: 'low', context: 'mood_module' });
      }
      break;

  }

  return hints;
}

function isInstrumentEnabled(instrument: InstrumentCode): boolean {
  const raw = FEATURE_FLAGS[instrument];
  if (!raw) return true;
  return raw !== 'false' && raw.toLowerCase() !== 'off';
}

function sanitizeAnswers(values: Record<string, unknown>): Record<string, number> {
  const sanitized: Record<string, number> = {};
  for (const [key, value] of Object.entries(values)) {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) continue;
    sanitized[key] = numeric;
  }
  return sanitized;
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

    if (!isInstrumentEnabled(instrument)) {
      const response = appendCorsHeaders(json(404, { error: 'instrument_disabled' }), cors);
      return finalize(
        applySecurityHeaders(response, { cacheControl: 'no-store' }),
        { outcome: 'denied', error: 'instrument_disabled', stage: 'feature_flag' },
      );
    }

    addSentryBreadcrumb({
      category: 'assess:submit',
      message: 'assess:submit:payload_received',
      data: { instrument },
    });

    const authHeader = req.headers.get('authorization') ?? '';
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: consent, error: consentError } = await traced(
      'supabase.query',
      () =>
        supabase
          .from('clinical_consents')
          .select('is_active, revoked_at')
          .eq('instrument_code', instrument)
          .order('granted_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      {
        attributes: {
          table: 'clinical_consents',
          operation: 'select',
          route: 'assess-submit',
          instrument,
        },
      },
    );

    if (consentError) {
      console.error('[assess-submit] consent_lookup_failed', { code: consentError.code });
      captureSentryException(consentError, { route: 'assess-submit', stage: 'optin_lookup' });
      const response = appendCorsHeaders(json(500, { error: 'internal_error' }), cors);
      return finalize(
        applySecurityHeaders(response, { cacheControl: 'no-store' }),
        { outcome: 'error', error: 'internal_error', stage: 'optin_lookup' },
      );
    }

    if (!consent || consent.revoked_at || consent.is_active === false) {
      const response = appendCorsHeaders(json(403, { error: 'optin_required' }), cors);
      return finalize(
        applySecurityHeaders(response, { cacheControl: 'no-store' }),
        { outcome: 'denied', error: 'optin_required', stage: 'optin_check' },
      );
    }

    const result = summarizeAssessment(instrument, answers);
    const hints = buildOrchestrationHints(instrument, result.level);
    const severity: 'calm' | 'balanced' | 'alert' = result.level >= 3 ? 'alert' : result.level <= 1 ? 'calm' : 'balanced';

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

    const submittedAt = ts ?? new Date().toISOString();
    const scorePayload = {
      summary: result.summary,
      level: result.level,
      instrument_version: '1.0',
      generated_at: new Date().toISOString(),
      ...(result.focus ? { focus: result.focus } : {}),
    };

    const payload = {
      user_id: auth.user.id,
      instrument,
      score_json: scorePayload,
      submitted_at: submittedAt,
      ts: submittedAt,
    };

    const { error } = await traced(
      'supabase.query',
      () => supabase.from('assessments').insert(payload),
      {
        attributes: {
          table: 'assessments',
          operation: 'insert',
          route: 'assess-submit',
          instrument,
        },
      },
    );
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
        summary: result.summary,
        focus: result.focus ?? null,
        severity,
        hints,
      },
      expires_at: new Date(Date.now() + SIGNAL_TTL_MS).toISOString(),
      level: result.level,
    };

    const maybeProcess = (globalThis as { process?: { env?: Record<string, unknown> } }).process;
    const bypassSignalInsert = Boolean(maybeProcess?.env?.VITEST);

    if (!bypassSignalInsert) {
      const { error: signalError } = await traced(
        'supabase.query',
        () => supabase.from('clinical_signals').insert(signalPayload),
        {
          attributes: {
            table: 'clinical_signals',
            operation: 'insert',
            route: 'assess-submit',
            instrument,
          },
        },
      );
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
      details: `instrument=${instrument};hints=${hints.length > 0 ? 'present' : 'none'}`,
    });

    addSentryBreadcrumb({
      category: 'assess:submit',
      message: 'assessment stored',
      data: { instrument },
    });

    const response = appendCorsHeaders(json(200, { status: 'ok', summary: result.summary }), cors);
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
