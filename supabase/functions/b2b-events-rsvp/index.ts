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

type RsvpPayload = {
  event_id: string;
  status: 'yes' | 'no' | 'maybe';
};

function enforceSuiteEnabled(req: Request) {
  if (!isSuiteEnabled()) {
    throw jsonResponse(req, 404, { error: 'not_found' });
  }
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

    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'b2b-events-rsvp',
      userId: auth.userId,
      limit: 30,
      windowMs: 60_000,
      description: 'B2B events RSVP API',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        error: 'Too many requests',
        retryAfter: rateLimit.retryAfter,
      });
    }

    const payload = (await req.json().catch(() => null)) as RsvpPayload | null;
    if (!payload || typeof payload.event_id !== 'string' || !['yes', 'no', 'maybe'].includes(payload.status)) {
      return jsonResponse(req, 400, { error: 'invalid_payload' });
    }

    const { data: event } = await serviceClient
      .from('org_events')
      .select('id')
      .eq('org_id', auth.orgId)
      .eq('id', payload.event_id)
      .maybeSingle();

    if (!event) {
      return jsonResponse(req, 404, { error: 'event_not_found' });
    }

    const { error } = await serviceClient
      .from('org_event_rsvps')
      .upsert(
        {
          event_id: payload.event_id,
          org_id: auth.orgId,
          user_id: auth.userId,
          status: payload.status,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'event_id,user_id' },
      );

    if (error) {
      console.error('[b2b] rsvp update failed', error);
      return jsonResponse(req, 500, { error: 'update_failed' });
    }

    await appendAuditLog({
      orgId: auth.orgId,
      actorId: auth.userId,
      event: 'event.rsvp.updated',
      target: `event:${payload.event_id}`,
      summary: `RSVP mis à jour (${payload.status})`,
    });

    return jsonResponse(req, 200, { success: true });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error('[b2b] events rsvp error', error);
    return jsonResponse(req, 500, { error: 'unexpected_error' });
  }
});
