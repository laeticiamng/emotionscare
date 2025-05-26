import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
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

    return { user, status: 200 };
  } catch (error) {
    console.error('Authorization error:', error);
    return { user: null, status: 401 };
  }
}
