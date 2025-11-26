import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import {
  appendAuditLog,
  buildCorsHeaders,
  getAuthContext,
  isSuiteEnabled,
  jsonResponse,
  serviceClient,
} from '../_shared/b2b.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

type EventPayload = {
  title: string;
  description?: string;
  starts_at: string;
  ends_at: string;
  location?: string;
  reminders?: { email?: boolean; push?: boolean };
};

function enforceSuiteEnabled(req: Request) {
  if (!isSuiteEnabled()) {
    throw jsonResponse(req, 404, { error: 'not_found' });
  }
}

function isIsoDate(value: string) {
  return Number.isFinite(Date.parse(value));
}

serve(async (req) => {
  const corsHeaders = {
    ...buildCorsHeaders(req),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    enforceSuiteEnabled(req);

    if (req.method !== 'POST') {
      return jsonResponse(req, 405, { error: 'method_not_allowed' });
    }

    const auth = await getAuthContext(req).catch((error) => {
      if (error instanceof Response) return error;
      return jsonResponse(req, 401, { error: 'unauthorized' });
    });

    if (auth instanceof Response) {
      return auth;
    }

    if (auth.orgRole !== 'admin' && auth.orgRole !== 'manager') {
      return jsonResponse(req, 403, { error: 'forbidden' });
    }

    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'b2b-events-create',
      userId: auth.userId,
      limit: 20,
      windowMs: 60_000,
      description: 'B2B events create API',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        error: 'Too many requests',
        retryAfter: rateLimit.retryAfter,
      });
    }

    const payload = (await req.json().catch(() => null)) as EventPayload | null;
    if (
      !payload ||
      typeof payload.title !== 'string' ||
      payload.title.trim().length === 0 ||
      typeof payload.starts_at !== 'string' ||
      typeof payload.ends_at !== 'string' ||
      !isIsoDate(payload.starts_at) ||
      !isIsoDate(payload.ends_at)
    ) {
      return jsonResponse(req, 400, { error: 'invalid_payload' });
    }

    const reminders = {
      email: Boolean(payload.reminders?.email),
      push: Boolean(payload.reminders?.push),
    };

    const { data, error } = await serviceClient
      .from('org_events')
      .insert({
        org_id: auth.orgId,
        title: payload.title.trim(),
        description: payload.description?.trim() ?? null,
        starts_at: payload.starts_at,
        ends_at: payload.ends_at,
        location: payload.location?.trim() ?? null,
        reminders,
        created_by: auth.userId,
      })
      .select('id, title, description, starts_at, ends_at, location, reminders')
      .single();

    if (error || !data) {
      console.error('[b2b] event create failed', error);
      return jsonResponse(req, 500, { error: 'create_failed' });
    }

    await appendAuditLog({
      orgId: auth.orgId,
      actorId: auth.userId,
      event: 'event.created',
      target: `event:${data.id}`,
      summary: `Événement créé («${payload.title.trim().slice(0, 48)}»)`,
    });

    return jsonResponse(req, 200, { success: true, event: data });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error('[b2b] events create error', error);
    return jsonResponse(req, 500, { error: 'unexpected_error' });
  }
});
