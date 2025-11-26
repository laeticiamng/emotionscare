import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import {
  appendAuditLog,
  buildCorsHeaders,
  getAuthenticatedUser,
  isSuiteEnabled,
  jsonResponse,
  serviceClient,
  sha256,
} from '../_shared/b2b.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

type AcceptPayload = {
  token: string;
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

    const user = await getAuthenticatedUser(req).catch((error) => {
      if (error instanceof Response) return error;
      return jsonResponse(req, 401, { error: 'unauthorized' });
    });

    if (user instanceof Response) {
      return user;
    }

    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'b2b-teams-accept',
      userId: user.id,
      limit: 10,
      windowMs: 60_000,
      description: 'B2B team invite acceptance',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        error: 'Too many requests',
        retryAfter: rateLimit.retryAfter,
      });
    }

    const body = (await req.json().catch(() => null)) as AcceptPayload | null;
    if (!body || typeof body.token !== 'string' || body.token.trim().length === 0) {
      return jsonResponse(req, 400, { error: 'invalid_payload' });
    }

    const tokenHash = await sha256(body.token.trim());
    const nowIso = new Date().toISOString();

    const { data: invite, error: inviteError } = await serviceClient
      .from('org_invites')
      .select('id, org_id, role, expires_at, accepted_at')
      .eq('token_hash', tokenHash)
      .gte('expires_at', nowIso)
      .is('accepted_at', null)
      .single();

    if (inviteError || !invite) {
      console.warn('[b2b] invite not found or expired', { user: user.id });
      return jsonResponse(req, 404, { error: 'invite_not_found' });
    }

    if (new Date(invite.expires_at).getTime() < Date.now()) {
      return jsonResponse(req, 410, { error: 'invite_expired' });
    }

    const { error: memberError } = await serviceClient
      .from('org_members')
      .upsert(
        {
          org_id: invite.org_id,
          user_id: user.id,
          role: invite.role,
          joined_at: nowIso,
        },
        { onConflict: 'org_id,user_id' },
      );

    if (memberError) {
      console.error('[b2b] invite accept upsert failed', { error: memberError.message });
      return jsonResponse(req, 500, { error: 'membership_failed' });
    }

    const { error: updateInviteError } = await serviceClient
      .from('org_invites')
      .update({ accepted_at: nowIso })
      .eq('id', invite.id);

    if (updateInviteError) {
      console.error('[b2b] invite update failed', { error: updateInviteError.message });
    }

    try {
      const metadata = {
        ...(user.user_metadata ?? {}),
        org_id: invite.org_id,
        org_role: invite.role,
      } as Record<string, unknown>;
      await serviceClient.auth.admin.updateUserById(user.id, { user_metadata: metadata });
    } catch (updateError) {
      console.error('[b2b] failed to update user metadata', updateError);
    }

    const actorHash = await sha256(user.id);

    await appendAuditLog({
      orgId: invite.org_id,
      actorId: user.id,
      event: 'team.invite.accepted',
      target: `org:${invite.org_id}`,
      summary: `Invitation acceptée par membre hash:${actorHash.slice(0, 10)}`,
    });

    return jsonResponse(req, 200, { success: true, org_id: invite.org_id, role: invite.role });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error('[b2b] teams accept error', error);
    return jsonResponse(req, 500, { error: 'unexpected_error' });
  }
});
