
import { createClient } from './supabase.ts';
import { hash } from './hash_user.ts';
import { logAccess } from './logging.ts';

export interface AuthResult {
  user: any | null;
  status: number;
  error?: string;
}

/**
 * Middleware d'authentification sécurisé pour les fonctions Edge
 */
export async function authenticateRequest(req: Request): Promise<AuthResult> {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { user: null, status: 401, error: 'Token d\'authentification manquant' };
    }

    const token = authHeader.replace('Bearer ', '');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return { user: null, status: 401, error: 'Token invalide ou expiré' };
    }

    return { user, status: 200 };
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return { user: null, status: 500, error: 'Erreur serveur d\'authentification' };
  }
}

/**
 * Vérifie si l'utilisateur a le rôle requis
 */
export async function authorizeRole(req: Request, allowedRoles: string[]): Promise<AuthResult> {
  const authResult = await authenticateRequest(req);
  
  if (authResult.status !== 200 || !authResult.user) {
    return authResult;
  }

  // Récupérer le rôle de l'utilisateur depuis les métadonnées
  const userRole = authResult.user.user_metadata?.role || 'b2c';
  
  if (!allowedRoles.includes(userRole)) {
    return { 
      user: null, 
      status: 403, 
      error: `Accès refusé. Rôle requis: ${allowedRoles.join(', ')}` 
    };
  }

  return authResult;
}

/**
 * Log des tentatives d'accès non autorisées
 */
export async function logUnauthorizedAccess(req: Request, reason: string) {
  const forwarded = req.headers.get('x-forwarded-for');
  const primaryAddress = forwarded?.split(',')[0]?.trim()
    || req.headers.get('cf-connecting-ip')
    || req.headers.get('x-real-ip')
    || null;
  const hashedIp = primaryAddress ? hash(primaryAddress) : null;
  const path = (() => {
    try {
      return new URL(req.url).pathname;
    } catch (_error) {
      return 'unknown';
    }
  })();

  console.warn('[SECURITY] Unauthorized access blocked', {
    route: path,
    hashedIp,
    reason,
  });

  try {
    await logAccess({
      user_id: null,
      route: path,
      action: 'unauthorized',
      result: 'denied',
      ip_address: hashedIp,
      user_agent: 'redacted',
      details: reason,
    });
  } catch (error) {
    console.warn('[SECURITY] Failed to persist unauthorized access log', error);
  }
}
