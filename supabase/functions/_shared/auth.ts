import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function requireAuth(req: Request) {
  const authHeader = req.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return null;

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
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
