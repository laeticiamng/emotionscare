// @ts-nocheck
/**
 * API Helpers - Fonctions utilitaires pour Edge Functions
 *
 * Helpers pour :
 * - Validation de données
 * - Gestion des erreurs
 * - Pagination
 * - Filtering
 * - Response formatting
 *
 * @version 1.0.0
 * @created 2025-11-14
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Crée un client Supabase authentifié
 */
export function createAuthenticatedClient(req: Request) {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  );
}

/**
 * Vérifie l'authentification et retourne l'utilisateur
 */
export async function authenticateUser(req: Request) {
  const supabaseClient = createAuthenticatedClient(req);

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    throw new APIError('Non autorisé', 401);
  }

  return { user, supabaseClient };
}

/**
 * Custom Error Class pour API
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Créer une réponse JSON formatée
 */
export function jsonResponse(data: any, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

/**
 * Créer une réponse d'erreur formatée
 */
export function errorResponse(error: any, status: number = 500) {
  console.error('API Error:', error);

  const message = error instanceof APIError ? error.message : 'Une erreur est survenue';
  const code = error instanceof APIError ? error.code : 'internal_error';

  return jsonResponse(
    {
      error: message,
      code,
      timestamp: new Date().toISOString(),
    },
    status
  );
}

/**
 * Gérer CORS preflight
 */
export function handleCORS(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
}

/**
 * Parser et valider le body JSON
 */
export async function parseBody<T = any>(req: Request): Promise<T> {
  try {
    return await req.json();
  } catch (error) {
    throw new APIError('Invalid JSON body', 400, 'invalid_json');
  }
}

/**
 * Extraire les paramètres de pagination
 */
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export function getPaginationParams(url: URL): PaginationParams {
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '50')));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Extraire les paramètres de filtrage de dates
 */
export interface DateFilters {
  dateFrom?: string;
  dateTo?: string;
}

export function getDateFilters(url: URL): DateFilters {
  return {
    dateFrom: url.searchParams.get('date_from') || undefined,
    dateTo: url.searchParams.get('date_to') || undefined,
  };
}

/**
 * Parser le path de la requête
 */
export interface ParsedPath {
  resource: string;
  id?: string;
  action?: string;
  subResource?: string;
}

export function parsePath(url: URL): ParsedPath {
  const pathParts = url.pathname.split('/').filter((p) => p);

  // Remove 'functions/v1/{function-name}' prefix if present
  const startIndex = pathParts.findIndex((p) => p !== 'functions' && p !== 'v1');
  const relevantParts = startIndex >= 0 ? pathParts.slice(startIndex + 1) : pathParts;

  if (relevantParts.length === 0) {
    return { resource: '' };
  }

  if (relevantParts.length === 1) {
    return { resource: relevantParts[0] };
  }

  if (relevantParts.length === 2) {
    // Could be /{resource}/{id} or /{resource}/{action}
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      relevantParts[1]
    );

    if (isUUID) {
      return { resource: relevantParts[0], id: relevantParts[1] };
    } else {
      return { resource: relevantParts[0], action: relevantParts[1] };
    }
  }

  if (relevantParts.length === 3) {
    // /{resource}/{id}/{action}
    return {
      resource: relevantParts[0],
      id: relevantParts[1],
      action: relevantParts[2],
    };
  }

  if (relevantParts.length === 4) {
    // /{resource}/{id}/{subResource}/{action}
    return {
      resource: relevantParts[0],
      id: relevantParts[1],
      subResource: relevantParts[2],
      action: relevantParts[3],
    };
  }

  return { resource: relevantParts[0] };
}

/**
 * Valider un UUID
 */
export function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Valider un email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Créer une réponse paginée
 */
export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  return jsonResponse({
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
}

/**
 * Appliquer des filtres de date à une query Supabase
 */
export function applyDateFilters(query: any, filters: DateFilters, columnName: string = 'created_at') {
  let filteredQuery = query;

  if (filters.dateFrom) {
    filteredQuery = filteredQuery.gte(columnName, filters.dateFrom);
  }

  if (filters.dateTo) {
    filteredQuery = filteredQuery.lte(columnName, filters.dateTo);
  }

  return filteredQuery;
}

/**
 * Calculer la durée entre deux timestamps
 */
export function calculateDuration(startTime: string, endTime?: string): number {
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : new Date().getTime();
  return Math.round((end - start) / 60000); // Minutes
}

/**
 * Sanitize et valider une string
 */
export function sanitizeString(str: string, maxLength: number = 10000): string {
  if (!str || typeof str !== 'string') {
    return '';
  }

  // Remove control characters
  let sanitized = str.replace(/[\x00-\x1F\x7F]/g, '');

  // Trim and limit length
  sanitized = sanitized.trim().slice(0, maxLength);

  return sanitized;
}

/**
 * Valider et parser un tableau depuis query params
 */
export function parseArrayParam(url: URL, paramName: string): string[] {
  const param = url.searchParams.get(paramName);
  if (!param) return [];

  return param.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
}

/**
 * Wrapper pour exécuter une fonction avec try-catch et logging
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context: string
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(`[${context}] Error:`, error);
    throw error;
  }
}

/**
 * Rate limiting simple (in-memory, pour développement)
 * En production, utiliser Redis ou enforceEdgeRateLimit
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function simpleRateLimit(
  userId: string,
  limit: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const key = `${userId}:${Math.floor(now / windowMs)}`;

  const current = rateLimitMap.get(key);

  if (!current || current.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  current.count++;
  return { allowed: true, remaining: limit - current.count };
}

/**
 * Clean up old rate limit entries (appelé périodiquement)
 */
export function cleanupRateLimits() {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetAt < now) {
      rateLimitMap.delete(key);
    }
  }
}

/**
 * Logger structuré
 */
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(JSON.stringify({ level: 'info', message, ...meta, timestamp: new Date().toISOString() }));
  },
  warn: (message: string, meta?: any) => {
    console.warn(JSON.stringify({ level: 'warn', message, ...meta, timestamp: new Date().toISOString() }));
  },
  error: (message: string, error?: any, meta?: any) => {
    console.error(
      JSON.stringify({
        level: 'error',
        message,
        error: error?.message || error,
        stack: error?.stack,
        ...meta,
        timestamp: new Date().toISOString(),
      })
    );
  },
};
