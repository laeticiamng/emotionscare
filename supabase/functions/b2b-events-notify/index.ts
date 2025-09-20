import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import {
  appendAuditLog,
  buildCorsHeaders,
  getAuthContext,
  isSuiteEnabled,
  jsonResponse,
  serviceClient,
  sha256,
} from '../_shared/b2b.ts';

type NotifyPayload = {
  event_id: string;
  channel?: 'email' | 'push' | 'both';
};

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

    const payload = (await req.json().catch(() => null)) as NotifyPayload | null;
    if (!payload || typeof payload.event_id !== 'string' || payload.event_id.length === 0) {
      return jsonResponse(req, 400, { error: 'invalid_payload' });
    }

    const { data: event } = await serviceClient
      .from('org_events')
      .select('id, reminders')
      .eq('org_id', auth.orgId)
      .eq('id', payload.event_id)
      .maybeSingle();

    if (!event) {
      return jsonResponse(req, 404, { error: 'event_not_found' });
    }

    const { data: members } = await serviceClient
      .from('org_members')
      .select('user_id')
      .eq('org_id', auth.orgId);

    const hashes: string[] = [];
    for (const member of members ?? []) {
      hashes.push((await sha256(member.user_id)).slice(0, 10));
    }

    const notifications = {
      email: payload.channel === 'email' || payload.channel === 'both' ? true : Boolean(event.reminders?.email),
      push: payload.channel === 'push' || payload.channel === 'both' ? true : Boolean(event.reminders?.push),
    };

    await appendAuditLog({
      orgId: auth.orgId,
      actorId: auth.userId,
      event: 'event.notifications.sent',
      target: `event:${payload.event_id}`,
      summary: `Notifications ${notifications.email ? 'email ' : ''}${notifications.push ? 'push' : ''} envoyées (${hashes.length} destinataires)`,
    });

    return jsonResponse(req, 200, {
      success: true,
      channels: notifications,
      recipients: hashes,
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error('[b2b] events notify error', error);
    return jsonResponse(req, 500, { error: 'unexpected_error' });
  }
});
