import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import {
  appendAuditLog,
  buildCorsHeaders,
  getAuthContext,
  isSuiteEnabled,
  jsonResponse,
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

    if (auth.orgRole !== 'admin' && auth.orgRole !== 'manager') {
      return jsonResponse(req, 403, { error: 'forbidden' });
    }

    const sessions: Array<{ label: string; last_seen: string }> = [];

    await appendAuditLog({
      orgId: auth.orgId,
      actorId: auth.userId,
      event: 'security.sessions.viewed',
      target: `org:${auth.orgId}`,
      summary: 'Consultation des sessions actives',
    });

    return jsonResponse(req, 200, { sessions });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error('[b2b] security sessions error', error);
    return jsonResponse(req, 500, { error: 'unexpected_error' });
  }
});
