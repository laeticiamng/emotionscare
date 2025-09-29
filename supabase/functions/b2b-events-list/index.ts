import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import {
  appendAuditLog,
  buildCorsHeaders,
  getAuthContext,
  isSuiteEnabled,
  jsonResponse,
  serviceClient,
} from '../_shared/b2b.ts';

function enforceSuiteEnabled(req: Request) {
  if (!isSuiteEnabled()) {
    throw jsonResponse(req, 404, { error: 'not_found' });
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: buildCorsHeaders(req) });
  }

  try {
    enforceSuiteEnabled(req);

    if (req.method !== 'GET') {
      return jsonResponse(req, 405, { error: 'method_not_allowed' });
    }

    const auth = await getAuthContext(req).catch((error) => {
      if (error instanceof Response) return error;
      return jsonResponse(req, 401, { error: 'unauthorized' });
    });

    if (auth instanceof Response) {
      return auth;
    }

    const { data, error } = await serviceClient
      .from('org_events')
      .select('id, title, description, starts_at, ends_at, location, reminders, created_at')
      .eq('org_id', auth.orgId)
      .order('starts_at', { ascending: true });

    if (error) {
      console.error('[b2b] events list failed', error);
      return jsonResponse(req, 500, { error: 'query_failed' });
    }

    await appendAuditLog({
      orgId: auth.orgId,
      actorId: auth.userId,
      event: 'event.list.viewed',
      target: `org:${auth.orgId}`,
      summary: 'Consultation des événements',
    });

    return jsonResponse(req, 200, { events: data ?? [] });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error('[b2b] events list error', error);
    return jsonResponse(req, 500, { error: 'unexpected_error' });
  }
});
