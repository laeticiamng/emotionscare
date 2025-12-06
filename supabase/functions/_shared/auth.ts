
import { createClient } from './supabase.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabase = createClient(supabaseUrl, anonKey);

export async function validateJwt(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('unauthorized');
  }
  const jwt = authHeader.slice(7);
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
    await logUnauthorizedAccess(req, 'auth error');
    return { user: null, status: 401 };
  }
}

export async function logUnauthorizedAccess(req: Request, reason: string) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const timestamp = new Date().toISOString();
  
  console.warn(`[SECURITY] Accès non autorisé: ${reason}`, {
    ip,
    userAgent,
    timestamp,
    url: req.url
  });

  // Log to database if needed
  try {
    await supabase
      .from('access_logs')
      .insert({
        ip_address: ip,
        user_agent: userAgent,
        route: new URL(req.url).pathname,
        action: 'unauthorized_access',
        reason: reason,
        timestamp: timestamp
      });
  } catch (dbError) {
    console.error('Failed to log unauthorized access:', dbError);
  }
}
