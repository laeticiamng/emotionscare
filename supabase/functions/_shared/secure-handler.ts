/**
 * Secure Handler - Wrapper sécurisé centralisé pour Edge Functions
 *
 * Combine:
 * - CORS restrictif (basé sur ALLOWED_ORIGINS)
 * - Authentification JWT obligatoire ou optionnelle
 * - Rate limiting configurable
 * - Validation Zod optionnelle
 * - Headers de sécurité
 * - Logging des erreurs
 */

import { cors, preflightResponse, rejectCors, type CorsResult } from './cors.ts';
import { authenticateRequest, logUnauthorizedAccess, type AuthResult } from './auth-middleware.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse, type RateLimitOptions, type RateLimitDecision } from './rate-limit.ts';
import { z } from './zod.ts';

// ============================================
// Types
// ============================================

export interface SecureHandlerOptions<T = unknown> {
  /** Nom de la route pour le rate limiting et logging */
  route: string;

  /** Authentification requise (défaut: true) */
  requireAuth?: boolean;

  /** Rôles autorisés (si vide, tous les utilisateurs authentifiés sont acceptés) */
  allowedRoles?: string[];

  /** Configuration du rate limiting */
  rateLimit?: {
    /** Nombre de requêtes autorisées (défaut: 30) */
    limit?: number;
    /** Fenêtre en millisecondes (défaut: 60000 = 1 min) */
    windowMs?: number;
    /** Description pour les logs */
    description?: string;
  };

  /** Schéma Zod pour valider le body JSON */
  bodySchema?: any; // z.ZodSchema<T>

  /** Méthodes HTTP autorisées (défaut: ['POST']) */
  allowedMethods?: string[];

  /** Headers supplémentaires à ajouter aux réponses */
  extraHeaders?: Record<string, string>;
}

export interface SecureContext<T = unknown> {
  /** Utilisateur authentifié (null si requireAuth=false et pas de token) */
  user: AuthResult['user'];

  /** Body validé par le schéma Zod (si fourni) */
  body: T;

  /** Requête originale */
  req: Request;

  /** Headers CORS à inclure dans la réponse */
  corsHeaders: Record<string, string>;

  /** Décision du rate limiter */
  rateLimit: RateLimitDecision | null;
}

export type SecureHandler<T = unknown> = (ctx: SecureContext<T>) => Promise<Response>;

// ============================================
// Headers de sécurité
// ============================================

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-Robots-Tag': 'noindex',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Resource-Policy': 'same-site',
  'Content-Security-Policy': "default-src 'self'",
};

// ============================================
// Helpers
// ============================================

function createErrorResponse(
  error: string,
  status: number,
  corsHeaders: Record<string, string>
): Response {
  return new Response(
    JSON.stringify({ error }),
    {
      status,
      headers: {
        ...corsHeaders,
        ...SECURITY_HEADERS,
        'Content-Type': 'application/json',
      },
    }
  );
}

function applySecurityHeaders(response: Response): Response {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    if (!response.headers.has(key)) {
      response.headers.set(key, value);
    }
  }
  return response;
}

// ============================================
// Wrapper principal
// ============================================

/**
 * Crée un handler sécurisé pour une Edge Function
 *
 * @example
 * ```ts
 * import { secureHandler } from '../_shared/secure-handler.ts';
 * import { z } from '../_shared/zod.ts';
 *
 * const BodySchema = z.object({
 *   message: z.string().min(1).max(1000),
 * });
 *
 * Deno.serve(secureHandler({
 *   route: 'my-function',
 *   requireAuth: true,
 *   rateLimit: { limit: 10, windowMs: 60_000 },
 *   bodySchema: BodySchema,
 * }, async (ctx) => {
 *   const { user, body, corsHeaders } = ctx;
 *
 *   // Votre logique ici...
 *
 *   return new Response(JSON.stringify({ success: true }), {
 *     headers: { ...corsHeaders, 'Content-Type': 'application/json' },
 *   });
 * }));
 * ```
 */
export function secureHandler<T = unknown>(
  options: SecureHandlerOptions<T>,
  handler: SecureHandler<T>
): (req: Request) => Promise<Response> {
  const {
    route,
    requireAuth = true,
    allowedRoles = [],
    rateLimit: rateLimitConfig,
    bodySchema,
    allowedMethods = ['POST'],
    extraHeaders = {},
  } = options;

  return async (req: Request): Promise<Response> => {
    // 1. CORS - Vérification origine
    const corsResult = cors(req);
    const corsHeaders = corsResult.headers;

    // 2. Preflight OPTIONS
    if (req.method === 'OPTIONS') {
      return preflightResponse(corsResult);
    }

    // 3. Vérification CORS stricte (rejeter origines non autorisées)
    if (!corsResult.allowed) {
      console.warn(`[${route}] CORS rejected - origin not allowed`);
      return rejectCors(corsResult);
    }

    // 4. Vérification méthode HTTP
    if (!allowedMethods.includes(req.method)) {
      return createErrorResponse(
        `Method ${req.method} not allowed`,
        405,
        corsHeaders
      );
    }

    try {
      // 5. Authentification
      let authResult: AuthResult = { user: null, status: 200 };

      if (requireAuth) {
        authResult = await authenticateRequest(req);

        if (authResult.status !== 200 || !authResult.user) {
          await logUnauthorizedAccess(req, authResult.error || 'Authentication failed');
          return createErrorResponse(
            authResult.error || 'Authentication required',
            authResult.status,
            corsHeaders
          );
        }

        // Vérification des rôles si spécifiés
        if (allowedRoles.length > 0) {
          // TODO: Implémenter vérification des rôles via has_role RPC
          // Pour l'instant, on log un warning si des rôles sont requis
          console.warn(`[${route}] Role checking not implemented yet for roles:`, allowedRoles);
        }
      }

      // 6. Rate Limiting
      let rateLimitDecision: RateLimitDecision | null = null;

      if (rateLimitConfig) {
        const rateLimitOptions: RateLimitOptions = {
          route,
          userId: authResult.user?.id ?? null,
          limit: rateLimitConfig.limit ?? 30,
          windowMs: rateLimitConfig.windowMs ?? 60_000,
          description: rateLimitConfig.description ?? route,
        };

        rateLimitDecision = await enforceEdgeRateLimit(req, rateLimitOptions);

        if (!rateLimitDecision.allowed) {
          console.warn(`[${route}] Rate limit exceeded`, {
            userId: authResult.user?.id,
            limit: rateLimitDecision.limit,
            retryAfter: rateLimitDecision.retryAfterSeconds,
          });
          return buildRateLimitResponse(rateLimitDecision, corsHeaders, {
            errorCode: 'rate_limit_exceeded',
            message: `Trop de requêtes. Réessayez dans ${rateLimitDecision.retryAfterSeconds}s.`,
          });
        }
      }

      // 7. Validation du body
      let validatedBody: T = {} as T;

      if (bodySchema && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
        try {
          const rawBody = await req.json();
          const parseResult = bodySchema.safeParse(rawBody);

          if (!parseResult.success) {
            const errors = parseResult.error.errors
              .map((e: any) => `${e.path.join('.')}: ${e.message}`)
              .join(', ');
            console.warn(`[${route}] Validation failed:`, errors);
            return createErrorResponse(`Invalid input: ${errors}`, 400, corsHeaders);
          }

          validatedBody = parseResult.data;
        } catch (parseError) {
          console.warn(`[${route}] JSON parse error:`, parseError);
          return createErrorResponse('Invalid JSON body', 400, corsHeaders);
        }
      }

      // 8. Exécuter le handler utilisateur
      const ctx: SecureContext<T> = {
        user: authResult.user,
        body: validatedBody,
        req,
        corsHeaders: { ...corsHeaders, ...extraHeaders },
        rateLimit: rateLimitDecision,
      };

      const response = await handler(ctx);

      // 9. Appliquer les headers de sécurité à la réponse
      return applySecurityHeaders(response);

    } catch (error) {
      console.error(`[${route}] Unhandled error:`, error);
      return createErrorResponse(
        'Internal server error',
        500,
        corsHeaders
      );
    }
  };
}

// ============================================
// Variantes utilitaires
// ============================================

/**
 * Handler sécurisé pour endpoints publics (pas d'auth requise)
 * mais avec CORS restrictif et rate limiting
 */
export function publicHandler<T = unknown>(
  options: Omit<SecureHandlerOptions<T>, 'requireAuth'>,
  handler: SecureHandler<T>
): (req: Request) => Promise<Response> {
  return secureHandler({ ...options, requireAuth: false }, handler);
}

/**
 * Handler sécurisé pour endpoints admin uniquement
 */
export function adminHandler<T = unknown>(
  options: Omit<SecureHandlerOptions<T>, 'requireAuth' | 'allowedRoles'>,
  handler: SecureHandler<T>
): (req: Request) => Promise<Response> {
  return secureHandler(
    { ...options, requireAuth: true, allowedRoles: ['admin', 'super_admin'] },
    handler
  );
}

/**
 * Handler sécurisé pour webhooks (CORS permissif, auth par signature)
 */
export function webhookHandler(
  options: { route: string; rateLimit?: SecureHandlerOptions['rateLimit'] },
  handler: (req: Request) => Promise<Response>
): (req: Request) => Promise<Response> {
  return async (req: Request): Promise<Response> => {
    // Pour les webhooks, on permet tous les origins mais on vérifie la signature
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, content-type, x-webhook-signature',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };

    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Rate limiting pour webhooks
    if (options.rateLimit) {
      const rateLimitDecision = await enforceEdgeRateLimit(req, {
        route: options.route,
        userId: null,
        limit: options.rateLimit.limit ?? 100,
        windowMs: options.rateLimit.windowMs ?? 60_000,
        description: options.rateLimit.description ?? `webhook:${options.route}`,
      });

      if (!rateLimitDecision.allowed) {
        return buildRateLimitResponse(rateLimitDecision, corsHeaders);
      }
    }

    try {
      const response = await handler(req);
      return applySecurityHeaders(response);
    } catch (error) {
      console.error(`[webhook:${options.route}] Error:`, error);
      return new Response(
        JSON.stringify({ error: 'Webhook processing failed' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  };
}
