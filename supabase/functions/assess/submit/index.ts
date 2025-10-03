import { serve } from '../../_shared/serve.ts';
import { z } from '../../_shared/zod.ts';
import { authenticateRequest, logUnauthorizedAccess } from '../../_shared/auth-middleware.ts';
import { appendCorsHeaders, preflightResponse, rejectCors, resolveCors } from '../../_shared/cors.ts';
import { applySecurityHeaders, json } from '../../_shared/http.ts';
import { traced } from '../../_shared/otel.ts';
import { recordEdgeLatencyMetric } from '../../_shared/metrics.ts';
import { createClient } from '../../_shared/supabase.ts';
import { hash } from '../../_shared/hash_user.ts';
import { captureSentryException } from '../../_shared/sentry.ts';

const submitSchema = z.object({
  session_id: z.string().uuid(),
  answers: z.array(z.object({ id: z.string(), value: z.number() })).min(1),
  meta: z
    .object({
      duration_ms: z.number().int().nonnegative().optional(),
      device_flags: z.record(z.string(), z.any()).optional(),
    })
    .optional(),
});

type SessionEntry = {
  user_id: string;
  instrument:
    | 'WHO5'
    | 'STAI6'
    | 'PANAS10'
    | 'PSS10'
    | 'UCLA3'
    | 'MSPSS'
    | 'AAQ2'
    | 'POMS_SF'
    | 'SSQ'
    | 'ISI'
    | 'GAS'
    | 'GRITS'
    | 'BRS'
    | 'WEMWBS'
    | 'SWEMWBS'
    | 'UWES9'
    | 'CBI'
    | 'CVSQ'
    | 'SAM'
    | 'SUDS';
  lang: string;
  context: 'pre' | 'post' | 'weekly' | 'monthly' | 'adhoc' | null;
  item_ids: string[];
  created_at: number;
  expires_at: number;
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

async function getSession(sessionId: string): Promise<SessionEntry | null> {
  const kv = await Deno.openKv();
  const value = await kv.get<SessionEntry>(['assess', 'session', sessionId]);
  if (!value.value) {
    return null;
  }
  return value.value;
}

async function destroySession(sessionId: string) {
  const kv = await Deno.openKv();
  await kv.delete(['assess', 'session', sessionId]);
}

async function enforceInstrumentRateLimit(
  client: ReturnType<typeof createClient>,
  userId: string,
  instrument: SessionEntry['instrument'],
): Promise<void> {
  const { data: freq } = await traced(
    'supabase.frequency',
    () =>
      client
        .from('assess_frequency')
        .select('min_interval_secs,max_per_day')
        .eq('instrument', instrument)
        .maybeSingle(),
    { attributes: { route: 'assess/submit', instrument } },
  );

  if (!freq) {
    return;
  }

  const { data: rl } = await traced(
    'supabase.rate_limiter',
    () =>
      client
        .from('assess_rate_limiter')
        .select('last_ts,count_today')
        .eq('user_id', userId)
        .eq('instrument', instrument)
        .maybeSingle(),
    { attributes: { route: 'assess/submit', instrument } },
  );

  const now = new Date();
  const nowIso = now.toISOString();
  const todayKey = nowIso.slice(0, 10);

  if (rl) {
    const last = new Date(rl.last_ts);
    const diffSeconds = (now.getTime() - last.getTime()) / 1000;
    if (diffSeconds < freq.min_interval_secs) {
      const retry = Math.max(0, freq.min_interval_secs - diffSeconds) * 1000;
      throw { code: 'RATE_LIMIT', retry_after_ms: Math.ceil(retry) } as const;
    }

    const lastDayKey = rl.last_ts.slice(0, 10);
    const nextCount = lastDayKey === todayKey ? rl.count_today + 1 : 1;

    if (nextCount > freq.max_per_day) {
      throw { code: 'RATE_LIMIT', retry_after_ms: 24 * 60 * 60 * 1000 } as const;
    }

    await client
      .from('assess_rate_limiter')
      .update({ last_ts: nowIso, count_today: nextCount })
      .eq('user_id', userId)
      .eq('instrument', instrument);
  } else {
    await client.from('assess_rate_limiter').insert({
      user_id: userId,
      instrument,
      last_ts: nowIso,
      count_today: 1,
    });
  }
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function scale(value: number, min: number, max: number): number {
  if (max === min) return 0;
  const normalized = ((value - min) / (max - min)) * 100;
  return clampScore(normalized);
}

function computeWHO5(values: number[]) {
  const sum = values.reduce((acc, value) => acc + value, 0);
  return { score_scaled: clampScore(sum * 4) };
}

function computeSTAI6(values: number[]) {
  const inverted = new Set([0, 2, 4]);
  const corrected = values.map((value, index) => (inverted.has(index) ? 5 - value : value));
  const sum = corrected.reduce((acc, value) => acc + value, 0);
  return { score_scaled: scale(sum, 6, 24) };
}

function computePANAS10(values: number[]) {
  const positive = values.slice(0, 5).reduce((acc, value) => acc + value, 0);
  const negative = values.slice(5, 10).reduce((acc, value) => acc + value, 0);
  return {
    pa_scaled: scale(positive, 5, 25),
    na_scaled: scale(negative, 5, 25),
  };
}

function computePSS10(values: number[]) {
  const inverted = new Set([0, 1, 2, 5, 8]);
  const corrected = values.map((value, index) => (inverted.has(index) ? 4 - value : value));
  const sum = corrected.reduce((acc, value) => acc + value, 0);
  return { score_scaled: scale(sum, 0, 40) };
}

function computeMSPSS(values: number[]) {
  const family = values.slice(0, 4).reduce((acc, value) => acc + value, 0);
  const friends = values.slice(4, 8).reduce((acc, value) => acc + value, 0);
  const significant = values.slice(8, 12).reduce((acc, value) => acc + value, 0);
  const clamp = (value: number) => clampScore((value / 28) * 100);
  return {
    family: clamp(family),
    friends: clamp(friends),
    significant: clamp(significant),
    global: clampScore(((family + friends + significant) / 84) * 100),
  };
}

function computeSSQ(values: number[]) {
  const nausea = values.slice(0, 4).reduce((acc, value) => acc + value, 0);
  const oculomotor = values.slice(4, 8).reduce((acc, value) => acc + value, 0);
  const disorientation = values.slice(8, 12).reduce((acc, value) => acc + value, 0);
  const total = nausea + oculomotor + disorientation;
  return {
    nausea: clampScore((nausea / 32) * 100),
    oculomotor: clampScore((oculomotor / 32) * 100),
    disorientation: clampScore((disorientation / 32) * 100),
    global: clampScore((total / 96) * 100),
  };
}

function computeSUDS(values: number[]) {
  const level = values[0] ?? 0;
  return { level: clampScore(level) };
}

function computeSAM(values: number[]) {
  const [valence = 0, arousal = 0] = values;
  return {
    valence: clampScore((valence / 9) * 100),
    arousal: clampScore((arousal / 9) * 100),
  };
}

function computeGeneric(values: number[]) {
  if (values.length === 0) {
    return { note: 'empty' };
  }
  const average = values.reduce((acc, value) => acc + value, 0) / values.length;
  return { summary_scaled: clampScore((average / 5) * 100) };
}

function computeScore(instrument: SessionEntry['instrument'], values: number[]) {
  switch (instrument) {
    case 'WHO5':
      return computeWHO5(values);
    case 'STAI6':
      return computeSTAI6(values);
    case 'PANAS10':
      return computePANAS10(values);
    case 'PSS10':
      return computePSS10(values);
    case 'MSPSS':
      return computeMSPSS(values);
    case 'SSQ':
      return computeSSQ(values);
    case 'SUDS':
      return computeSUDS(values);
    case 'SAM':
      return computeSAM(values);
    default:
      return computeGeneric(values);
  }
}

type ScoreResult = ReturnType<typeof computeScore>;

function deriveHints(instrument: SessionEntry['instrument'], score: ScoreResult): string[] {
  switch (instrument) {
    case 'WHO5':
      if (typeof (score as { score_scaled?: number }).score_scaled === 'number' &&
        (score as { score_scaled?: number }).score_scaled < 40) {
        return ['nudges_cocon', 'cta_respire_1m', 'prioriser_journal_2lignes'];
      }
      return ['ambiance_douce'];
    case 'STAI6': {
      const value = (score as { score_scaled?: number }).score_scaled ?? 0;
      return value <= 30 ? ['silence_ancrage'] : ['carte_54321'];
    }
    case 'SUDS': {
      const value = (score as { level?: number }).level ?? 0;
      return value >= 70 ? ['encore_60s'] : ['sortie_douce'];
    }
    case 'SSQ': {
      const global = (score as { global?: number }).global ?? 0;
      if (global >= 20) {
        return ['fallback_vr_2d', 'effets_reduits'];
      }
      return ['continuite_vr'];
    }
    case 'PANAS10': {
      const na = (score as { na_scaled?: number }).na_scaled ?? 0;
      return na > 60 ? ['petite_pause_apaisante'] : ['vibration_positive'];
    }
    default:
      return ['presence_gentille'];
  }
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
      route: 'assess/submit',
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
      stage: 'cors',
    });
  }

  if (req.method !== 'POST') {
    const response = appendCorsHeaders(json(405, { error: 'method_not_allowed' }), cors);
    return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
      outcome: 'denied',
      error: 'method_not_allowed',
      stage: 'method',
    });
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    const response = appendCorsHeaders(json(500, { error: 'SERVER_ERROR' }), cors);
    return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
      outcome: 'error',
      error: 'configuration_missing',
      stage: 'config',
    });
  }

  try {
    const auth = await authenticateRequest(req);
    if (auth.status !== 200 || !auth.user) {
      if (auth.status === 401 || auth.status === 403) {
        await logUnauthorizedAccess(req, auth.error ?? 'unauthorized');
      }
      const response = appendCorsHeaders(json(auth.status, { error: 'FORBIDDEN' }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'denied',
        error: 'auth_failed',
        stage: 'auth',
      });
    }

    hashedUserId = hash(auth.user.id);

    const body = await req.json().catch(() => null);
    if (!body) {
      const response = appendCorsHeaders(json(422, { error: 'INVALID_PAYLOAD' }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'denied',
        error: 'invalid_payload',
        stage: 'payload',
      });
    }

    const parsed = submitSchema.safeParse(body);
    if (!parsed.success) {
      const response = appendCorsHeaders(json(422, { error: 'INVALID_PAYLOAD' }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'denied',
        error: 'validation_failed',
        stage: 'payload',
      });
    }

    const payload = parsed.data;

    const session = await getSession(payload.session_id);
    if (!session) {
      const response = appendCorsHeaders(json(410, { error: 'INVALID_SESSION' }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'denied',
        error: 'invalid_session',
        stage: 'session',
      });
    }

    if (session.user_id !== auth.user.id) {
      const response = appendCorsHeaders(json(403, { error: 'FORBIDDEN' }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'denied',
        error: 'session_mismatch',
        stage: 'session',
      });
    }

    if (Date.now() > session.expires_at) {
      await destroySession(payload.session_id);
      const response = appendCorsHeaders(json(410, { error: 'SESSION_EXPIRED' }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'denied',
        error: 'session_expired',
        stage: 'session',
      });
    }

    const sessionItemSet = new Set(session.item_ids);
    const numericValues: number[] = [];
    for (const answer of payload.answers) {
      if (!sessionItemSet.has(answer.id)) {
        const response = appendCorsHeaders(json(422, { error: 'INVALID_PAYLOAD' }), cors);
        return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
          outcome: 'denied',
          error: 'invalid_item',
          stage: 'payload',
        });
      }
      numericValues.push(answer.value);
    }

    const client = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    try {
      await enforceInstrumentRateLimit(client, auth.user.id, session.instrument);
    } catch (error) {
      if (typeof error === 'object' && error && 'code' in error) {
        const retryAfterMs = (error as { retry_after_ms?: number }).retry_after_ms ?? 0;
        const response = appendCorsHeaders(
          json(429, { error: { code: 'RATE_LIMIT', retry_after_ms: retryAfterMs } }),
          cors,
        );
        return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
          outcome: 'denied',
          error: 'rate_limit',
          stage: 'rate_limit',
        });
      }
      throw error;
    }

    const score = computeScore(session.instrument, numericValues);

    const insertPayload = {
      user_id: auth.user.id,
      instrument: session.instrument,
      context: session.context ?? 'adhoc',
      lang: session.lang,
      score_json_min: score,
      meta: {
        ...payload.meta,
        answered_count: numericValues.length,
        session_created_at: new Date(session.created_at).toISOString(),
      },
    };

    const { data, error } = await traced(
      'supabase.assessment_insert',
      () =>
        client
          .from('assessments')
          .insert(insertPayload)
          .select('id,score_json_min')
          .single(),
      { attributes: { route: 'assess/submit', instrument: session.instrument } },
    );

    if (error || !data) {
      console.error('[assess/submit] failed to persist assessment', error);
      const response = appendCorsHeaders(json(500, { error: 'SERVER_ERROR' }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'error',
        error: 'persistence_failed',
        stage: 'storage',
      });
    }

    const hints = deriveHints(session.instrument, score);

    await destroySession(payload.session_id);

    const response = appendCorsHeaders(
      json(200, {
        receipt_id: data.id,
        orchestration: {
          hints,
        },
      }),
      cors,
    );

    return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
      outcome: 'success',
    });
  } catch (error) {
    console.error('[assess/submit] unexpected failure', error);
    captureSentryException(error);
    const response = appendCorsHeaders(json(500, { error: 'SERVER_ERROR' }), cors);
    return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
      outcome: 'error',
      error: 'unexpected',
      stage: 'exception',
    });
  }
});
