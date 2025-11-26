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

type UpdatePayload = {
  event_id: string;
  title?: string;
  description?: string;
  starts_at?: string;
  ends_at?: string;
  location?: string;
  reminders?: { email?: boolean; push?: boolean };
};

function enforceSuiteEnabled(req: Request) {
  if (!isSuiteEnabled()) {
    throw jsonResponse(req, 404, { error: 'not_found' });
  }
}

function isIsoDate(value?: string) {
  if (typeof value !== 'string') return true;
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
      route: 'b2b-events-update',
      userId: auth.userId,
      limit: 30,
      windowMs: 60_000,
      description: 'B2B events update API',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        error: 'Too many requests',
        retryAfter: rateLimit.retryAfter,
      });
    }

    const payload = (await req.json().catch(() => null)) as UpdatePayload | null;
    if (!payload || typeof payload.event_id !== 'string' || payload.event_id.length === 0) {
      return jsonResponse(req, 400, { error: 'invalid_payload' });
    }

    if (!isIsoDate(payload.starts_at) || !isIsoDate(payload.ends_at)) {
      return jsonResponse(req, 400, { error: 'invalid_dates' });
    }

    const updates: Record<string, unknown> = {};
    if (typeof payload.title === 'string') updates.title = payload.title.trim();
    if (typeof payload.description === 'string') updates.description = payload.description.trim();
    if (typeof payload.starts_at === 'string') updates.starts_at = payload.starts_at;
    if (typeof payload.ends_at === 'string') updates.ends_at = payload.ends_at;
    if (typeof payload.location === 'string') updates.location = payload.location.trim();
    if (payload.reminders) {
      updates.reminders = {
        email: Boolean(payload.reminders.email),
        push: Boolean(payload.reminders.push),
      };
    }

    if (Object.keys(updates).length === 0) {
      return jsonResponse(req, 400, { error: 'nothing_to_update' });
    }

    const { data, error } = await serviceClient
      .from('org_events')
      .update(updates)
      .eq('org_id', auth.orgId)
      .eq('id', payload.event_id)
      .select('id, title, description, starts_at, ends_at, location, reminders')
      .single();

    if (error || !data) {
      console.error('[b2b] event update failed', error);
      return jsonResponse(req, 404, { error: 'event_not_found' });
    }

    await appendAuditLog({
      orgId: auth.orgId,
      actorId: auth.userId,
      event: 'event.updated',
      target: `event:${data.id}`,
      summary: 'Événement mis à jour',
    });

    return jsonResponse(req, 200, { success: true, event: data });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error('[b2b] events update error', error);
    return jsonResponse(req, 500, { error: 'unexpected_error' });
  }
});
