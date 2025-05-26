import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { logAccess } from './logging.ts';

export async function validateJwt(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('unauthorized');
  }
  const jwt = authHeader.slice(7);
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  );
  const { data: { user }, error } = await supabase.auth.getUser(jwt);
  if (error || !user) throw new Error('unauthorized');
  return user;
}

export function getClaim(user: any, claim: string) {
  return user.user_metadata?.[claim];
}

export async function assertJwt(req: Request) {
  const user_agent = req.headers.get('user-agent') || '';
  const user = await validateJwt(req);
  return {
    user_hash: getClaim(user, 'user_hash'),
    org_id: getClaim(user, 'org_id'),
    role: getClaim(user, 'role'),
    user_agent,
  };
}

export async function authorizeRole(req: Request, allowedRoles: string[]) {
  try {
    const claims = await assertJwt(req);
    if (!claims.role || !allowedRoles.includes(claims.role)) {
      await logAccess({
        user_id: claims.user_hash,
        role: claims.role,
        route: new URL(req.url).pathname,
        action: 'access',
        result: 'denied',
        user_agent: claims.user_agent,
      });

import { verify } from 'https://deno.land/x/djwt@v2.9/mod.ts';
import { hash as argonHash } from 'https://deno.land/x/argon2@0.11.0/mod.ts';
import { logUnauthorizedAccess } from './auth-middleware.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabase = createClient(supabaseUrl, anonKey);
const pepper = Deno.env.get('SUPA_PEPPER') ?? '';

export async function validateJwtOrThrow(jwt: string): Promise<string> {
  const secret = Deno.env.get('JWT_SECRET') ?? '';
  const { payload } = await verify(jwt, secret, 'HS256');
  if (!payload.sub) throw new Error('invalid jwt');
  return payload.sub as string;
}

export async function hashUser(sub: string): Promise<string> {
  return await argonHash(sub + pepper, { type: 'argon2id', salt: new TextEncoder().encode(pepper) });
}

export async function authorizeRole(req: Request, allowedRoles: string[]) {
  const user_agent = req.headers.get('user-agent') || 'unknown';
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      await logUnauthorizedAccess(req, 'missing token');
      return { user: null, status: 401 };
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      await logUnauthorizedAccess(req, 'invalid token');
      return { user: null, status: 401 };
    }

    const role = user.user_metadata?.role || 'b2c';
    if (!allowedRoles.includes(role)) {
      await logUnauthorizedAccess(req, 'invalid role');
      return { user: null, status: 403 };
    }
    return { user: claims, status: 200 };
  } catch (_e) {
    await logAccess({
      user_id: null,
      route: new URL(req.url).pathname,
      action: 'access',
      result: 'denied',
      user_agent: req.headers.get('user-agent') || '',
    });
    return { user: null, status: 401 };
  }
}
