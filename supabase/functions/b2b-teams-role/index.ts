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

type RolePayload = {
  user_id: string;
  role: 'admin' | 'manager' | 'member';
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

    if (auth.orgRole !== 'admin') {
      return jsonResponse(req, 403, { error: 'forbidden' });
    }

    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'b2b-teams-role',
      userId: auth.userId,
      limit: 20,
      windowMs: 60_000,
      description: 'B2B team role management API',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        error: 'Too many requests',
        retryAfter: rateLimit.retryAfter,
      });
    }

    const body = (await req.json().catch(() => null)) as RolePayload | null;
    if (
      !body ||
      typeof body.user_id !== 'string' ||
      !body.user_id ||
      (body.role !== 'admin' && body.role !== 'manager' && body.role !== 'member')
    ) {
      return jsonResponse(req, 400, { error: 'invalid_payload' });
    }

    const { data: membership, error: memberError } = await serviceClient
      .from('org_members')
      .select('org_id')
      .eq('org_id', auth.orgId)
      .eq('user_id', body.user_id)
      .maybeSingle();

    if (memberError) {
      console.error('[b2b] failed to load member', memberError);
      return jsonResponse(req, 500, { error: 'member_lookup_failed' });
    }

    if (!membership) {
      return jsonResponse(req, 404, { error: 'member_not_found' });
    }

    const { error: updateError } = await serviceClient
      .from('org_members')
      .update({ role: body.role })
      .eq('org_id', auth.orgId)
      .eq('user_id', body.user_id);

    if (updateError) {
      console.error('[b2b] failed to update role', updateError);
      return jsonResponse(req, 500, { error: 'update_failed' });
    }

    try {
      const { data: adminUser } = await serviceClient.auth.admin.getUserById(body.user_id);
      const currentMeta = (adminUser?.user?.user_metadata ?? {}) as Record<string, unknown>;
      await serviceClient.auth.admin.updateUserById(body.user_id, {
        user_metadata: { ...currentMeta, org_id: auth.orgId, org_role: body.role },
      });
    } catch (adminError) {
      console.error('[b2b] failed to update auth metadata', adminError);
    }

    await appendAuditLog({
      orgId: auth.orgId,
      actorId: auth.userId,
      event: 'team.role.updated',
      target: `user:${body.user_id}`,
      summary: `Rôle mis à jour vers ${body.role}`,
    });

    return jsonResponse(req, 200, { success: true });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error('[b2b] teams role error', error);
    return jsonResponse(req, 500, { error: 'unexpected_error' });
  }
});
