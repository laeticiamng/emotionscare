// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.warn('[b2b] Missing Supabase credentials for service client');
}

export const serviceClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const allowedOrigins = (Deno.env.get('B2B_ALLOWED_ORIGINS') ?? '')
  .split(',')
  .map(origin => origin.trim())
  .filter(origin => origin.length > 0);

const suiteEnabled = (Deno.env.get('FF_B2B_SUITE') ?? 'false').toLowerCase() === 'true';
const reportsEnabled = (Deno.env.get('FF_B2B_REPORTS') ?? 'false').toLowerCase() === 'true';

const textEncoder = new TextEncoder();

export function isSuiteEnabled(): boolean {
  return suiteEnabled;
}

export function isReportsEnabled(): boolean {
  return reportsEnabled;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function sha256(value: string): Promise<string> {
  const data = textEncoder.encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

function resolveAllowedOrigin(requestOrigin: string | null): string {
  if (!requestOrigin) {
    return allowedOrigins[0] ?? '*';
  }
  if (allowedOrigins.length === 0) {
    return requestOrigin;
  }
  return allowedOrigins.includes(requestOrigin) ? requestOrigin : allowedOrigins[0];
}

export function buildCorsHeaders(req: Request, additional: Record<string, string> = {}) {
  const origin = resolveAllowedOrigin(req.headers.get('origin'));

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Vary': 'Origin',
    'X-Robots-Tag': 'noindex',
    ...additional,
  } as Record<string, string>;
}

export function jsonResponse(req: Request, status: number, payload: unknown) {
  const headers = buildCorsHeaders(req, { 'Content-Type': 'application/json' });
  return new Response(JSON.stringify(payload), { status, headers });
}

export type AuthContext = {
  userId: string;
  orgId: string;
  orgRole: 'admin' | 'manager' | 'member';
};

export async function getAuthContext(req: Request): Promise<AuthContext> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Response('Unauthorized', { status: 401, headers: buildCorsHeaders(req) });
  }

  const token = authHeader.slice(7);
  const { data, error } = await serviceClient.auth.getUser(token);
  if (error || !data.user) {
    throw new Response('Unauthorized', { status: 401, headers: buildCorsHeaders(req) });
  }

  const user = data.user;
  const orgId = (user.user_metadata?.org_id as string | undefined) ?? (user.app_metadata?.org_id as string | undefined);
  const orgRole = (user.user_metadata?.org_role as string | undefined) ?? (user.user_metadata?.role as string | undefined);

  if (!orgId) {
    throw new Response('Forbidden', { status: 403, headers: buildCorsHeaders(req) });
  }

  const normalizedRole = orgRole === 'admin' || orgRole === 'manager' || orgRole === 'member' ? orgRole : 'member';

  return {
    userId: user.id,
    orgId,
    orgRole: normalizedRole,
  };
}

export async function getAuthenticatedUser(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Response('Unauthorized', { status: 401, headers: buildCorsHeaders(req) });
  }

  const token = authHeader.slice(7);
  const { data, error } = await serviceClient.auth.getUser(token);
  if (error || !data.user) {
    throw new Response('Unauthorized', { status: 401, headers: buildCorsHeaders(req) });
  }

  return data.user;
}

export async function appendAuditLog(params: {
  orgId: string;
  actorId?: string;
  event: string;
  target?: string;
  summary: string;
}) {
  try {
    const actorHash = params.actorId ? await sha256(params.actorId) : null;
    await serviceClient.from('org_audit_logs').insert({
      org_id: params.orgId,
      actor_hash: actorHash,
      event: params.event,
      target: params.target ?? null,
      text_summary: params.summary,
    });
  } catch (error) {
    console.error('[b2b] failed to append audit log', { error });
  }
}
