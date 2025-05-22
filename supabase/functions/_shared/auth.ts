import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Centralised Supabase client for edge functions

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Log unauthorized access attempts for audit purposes.
 */
export async function logUnauthorizedAccess(
  route: string,
  reason: string,
  userId: string | null = null,
  ip: string | null = null
) {
  try {
    await supabase.from('auth_attempts').insert({
      user_id: userId,
      route,
      reason,
      ip_address: ip,
    });
  } catch (logError) {
    console.error('Failed to log auth attempt:', logError);
  }
}

/**
 * Validate the incoming request using the Authorization header or cookie.
 * Returns the authenticated user or null if authentication fails.
 */
export async function requireAuth(req: Request) {
  const { pathname } = new URL(req.url);
  const ip =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    null;

  let token = req.headers.get('Authorization')?.replace('Bearer ', '') || '';

  if (!token) {
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(/sb-access-token=([^;]+)/);
    if (match) token = match[1];
  }

  if (!token) {
    await logUnauthorizedAccess(pathname, 'missing_token', null, ip);
    return null;
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    await logUnauthorizedAccess(pathname, error?.message || 'invalid_token', null, ip);
    console.warn('Authentication failed:', error);
    return null;
  }
  return data.user;
}

export async function requireRole(req: Request, allowedRoles: string | string[]) {
  const user = await requireAuth(req);
  if (!user) return null;
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const userRole = (user.user_metadata?.role || '').toLowerCase();
  if (!roles.map(r => r.toLowerCase()).includes(userRole)) {
    console.warn('Role mismatch:', { userRole, allowedRoles: roles });
    return null;
  }
  return user;
}
