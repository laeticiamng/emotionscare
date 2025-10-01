// @ts-nocheck
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { Resend } from 'https://esm.sh/resend@3.4.0';
import {
  appendAuditLog,
  buildCorsHeaders,
  getAuthContext,
  isSuiteEnabled,
  jsonResponse,
  normalizeEmail,
  serviceClient,
  sha256,
} from '../_shared/b2b.ts';

const resendKey = Deno.env.get('RESEND_API_KEY') ?? '';
const magicBaseUrl = Deno.env.get('B2B_MAGIC_LINK_BASE_URL') ?? '';
const resend = resendKey ? new Resend(resendKey) : null;

function enforceSuiteEnabled(req: Request) {
  if (!isSuiteEnabled()) {
    throw jsonResponse(req, 404, { error: 'not_found' });
  }
}

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

type InvitePayload = {
  email: string;
  role: 'manager' | 'member';
};

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

    const body = (await req.json().catch(() => null)) as InvitePayload | null;
    if (!body || typeof body.email !== 'string' || (body.role !== 'manager' && body.role !== 'member')) {
      return jsonResponse(req, 400, { error: 'invalid_payload' });
    }

    const normalizedEmail = normalizeEmail(body.email);
    if (normalizedEmail.length === 0 || !normalizedEmail.includes('@')) {
      return jsonResponse(req, 400, { error: 'invalid_email' });
    }

    const emailHash = await sha256(normalizedEmail);
    const token = generateToken();
    const tokenHash = await sha256(token);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const { error: insertError } = await serviceClient.from('org_invites').insert({
      org_id: auth.orgId,
      email_hash: emailHash,
      role: body.role,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });

    if (insertError) {
      console.error('[b2b] invite insert failed', { error: insertError.message, org: auth.orgId });
      return jsonResponse(req, 500, { error: 'invite_failed' });
    }

    const inviteUrl = magicBaseUrl ? `${magicBaseUrl}?token=${token}` : `https://app.emotionscare.com/b2b/join?token=${token}`;

    if (resend) {
      try {
        await resend.emails.send({
          from: 'EmotionsCare B2B <b2b@emotionscare.com>',
          to: [normalizedEmail],
          subject: 'Invitation à rejoindre votre espace Équipes',
          text: `Bonjour,\n\nVous avez été invité à rejoindre l\'organisation sur EmotionsCare. Utilisez ce lien pour accepter l\'invitation : ${inviteUrl}\n\nCe lien expire le ${new Date(expiresAt).toLocaleString('fr-FR', { timeZone: 'UTC' })}.\n\nÀ très vite,\nL'équipe EmotionsCare`,
          headers: {
            'X-Entity-Ref-ID': `b2b-invite-${emailHash.slice(0, 12)}`,
          },
        });
      } catch (sendError) {
        console.error('[b2b] invite email failed', { reason: sendError instanceof Error ? sendError.message : 'unknown', email_hash: emailHash.slice(0, 8) });
      }
    }

    await appendAuditLog({
      orgId: auth.orgId,
      actorId: auth.userId,
      event: 'team.invite.sent',
      target: `org:${auth.orgId}`,
      summary: `Invitation envoyée (hash:${emailHash.slice(0, 10)}) pour rôle ${body.role}`,
    });

    return jsonResponse(req, 200, {
      success: true,
      expires_at: expiresAt,
      email_hash: emailHash,
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error('[b2b] teams invite error', error);
    return jsonResponse(req, 500, { error: 'unexpected_error' });
  }
});
