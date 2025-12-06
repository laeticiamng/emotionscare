// @ts-nocheck
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

const instrumentValues = [
  'WHO5','STAI6','PANAS10','PSS10','UCLA3','MSPSS','AAQ2','POMS_SF','SSQ',
  'ISI','GAS','GRITS','BRS','WEMWBS','SWEMWBS','UWES9','CBI','CVSQ','SAM','SUDS',
] as const;

const aggregateSchema = z.object({
  org_id: z.string().uuid(),
  period: z.object({ from: z.string(), to: z.string() }),
  instruments: z.array(z.enum(instrumentValues)).optional(),
  team_id: z.string().uuid().optional(),
  min_n: z.number().int().min(5).default(5),
});

type AggregatePayload = z.infer<typeof aggregateSchema>;
type InstrumentCode = (typeof instrumentValues)[number];

type AggRow = {
  instrument: InstrumentCode;
  bucket_week: string;
  n: number;
  payloads: unknown;
  org_id: string | null;
  team_id: string | null;
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const ORG_ALLOWED_ROLES = ['b2b_admin', 'b2b_hr', 'b2b_manager', 'admin'] as const;

function parseDate(value: string): Date | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

function summariseInstrument(instrument: AggRow['instrument'], payloads: unknown[]): string {
  switch (instrument) {
    case 'WHO5':
      return 'Les ressentis globaux restent cohérents et appellent à maintenir le cocon.';
    case 'STAI6':
      return 'Les signaux de tension sont suivis avec douceur et sans chiffres.';
    case 'PANAS10':
      return 'Les émotions rapportées se balancent entre énergie et calme, avec une attention verbale.';
    case 'PSS10':
      return 'La charge perçue reste verbalisée sans métriques, avec un accompagnement apaisé.';
    case 'MSPSS':
      return 'Le soutien ressenti continue d’être discuté en mots, jamais en pourcentages.';
    case 'SSQ':
      return 'Le suivi VR privilégie la sécurité : ajustements textuels et fallback 2D si nécessaire.';
    case 'SUDS':
      return 'Les montées et redescendes de ressenti sont guidées par des invites verbales.';
    default:
      return "Les tendances collectives sont décrites en langage naturel, sans aucune donnée individuelle.";
  }
}

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
      route: 'assess/aggregate',
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

    const role = (auth.user.user_metadata?.role as string | undefined) ?? 'b2c';
    if (!ORG_ALLOWED_ROLES.includes(role as (typeof ORG_ALLOWED_ROLES)[number])) {
      const response = appendCorsHeaders(json(403, { error: 'FORBIDDEN' }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'denied',
        error: 'forbidden',
        stage: 'role',
      });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      const response = appendCorsHeaders(json(422, { error: 'INVALID_PAYLOAD' }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'denied',
        error: 'invalid_payload',
        stage: 'payload',
      });
    }

    const parsed = aggregateSchema.safeParse(body);
    if (!parsed.success) {
      const response = appendCorsHeaders(json(422, { error: 'INVALID_PAYLOAD' }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'denied',
        error: 'validation_failed',
        stage: 'payload',
      });
    }

    const payload = parsed.data;
    const fromDate = parseDate(payload.period.from);
    const toDate = parseDate(payload.period.to);

    if (!fromDate || !toDate || fromDate > toDate) {
      const response = appendCorsHeaders(json(422, { error: 'INVALID_PAYLOAD' }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'denied',
        error: 'invalid_period',
        stage: 'payload',
      });
    }

    hashedOrgId = hash(payload.org_id);

    const client = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const query = client
      .from('assess_agg_source')
      .select('instrument,bucket_week,n,payloads,org_id,team_id')
      .eq('org_id', payload.org_id)
      .gte('bucket_week', fromDate.toISOString())
      .lte('bucket_week', toDate.toISOString());

    if (payload.team_id) {
      query.eq('team_id', payload.team_id);
    }

    if (payload.instruments && payload.instruments.length > 0) {
      query.in('instrument', payload.instruments);
    }

    const { data, error } = await traced(
      'supabase.assess_agg_source',
      () => query,
      { attributes: { route: 'assess/aggregate', org_id: payload.org_id } },
    );

    if (error) {
      console.error('[assess/aggregate] fetch failed', error);
      const response = appendCorsHeaders(json(500, { error: 'SERVER_ERROR' }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'error',
        error: 'fetch_failed',
        stage: 'storage',
      });
    }

    const rows = (data ?? []) as AggRow[];

    const totalN = rows.reduce((acc, row) => acc + (row.n ?? 0), 0);
    if (totalN < payload.min_n) {
      const response = appendCorsHeaders(json(400, { error: { code: 'MIN_N' } }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'denied',
        error: 'min_n',
        stage: 'threshold',
      });
    }

    const textSummary = Array.from(
      new Set(
        rows.map((row) => {
          const payloads = Array.isArray(row.payloads) ? row.payloads : [];
          return summariseInstrument(row.instrument, payloads);
        }),
      ),
    );

    const response = appendCorsHeaders(
      json(200, { ok: true, n: totalN, text_summary: textSummary }),
      cors,
    );

    return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
      outcome: 'success',
    });
  } catch (error) {
    console.error('[assess/aggregate] unexpected failure', error);
    captureSentryException(error);
    const response = appendCorsHeaders(json(500, { error: 'SERVER_ERROR' }), cors);
    return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
      outcome: 'error',
      error: 'unexpected',
      stage: 'exception',
    });
  }
});
