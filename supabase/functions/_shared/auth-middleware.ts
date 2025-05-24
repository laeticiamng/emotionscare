
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
 * Rate limiting basique
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(clientId: string, maxRequests = 60, windowMs = 60000): boolean {
  const now = Date.now();
  const clientData = requestCounts.get(clientId);
  
  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(clientId, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (clientData.count >= maxRequests) {
    return false;
  }
  
  clientData.count++;
  return true;
}

/**
 * Log des tentatives d'accès non autorisées
 */
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
}
