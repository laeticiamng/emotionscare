/**
 * Wrapper de monitoring pour Edge Functions RGPD
 * Utilise Sentry existant + logs structurés
 */

import { addSentryBreadcrumb, captureSentryException, initSentry } from './sentry.ts';

export interface MonitoringContext {
  functionName: string;
  userId?: string;
  requestId?: string;
  metadata?: Record<string, any>;
}

/**
 * Logger structuré avec intégration Sentry
 */
export const logger = {
  info: (message: string, context: MonitoringContext, data?: any) => {
    console.log(`ℹ️  [${context.functionName}]`, message, data || '');
    
    addSentryBreadcrumb({
      category: 'info',
      message: `[${context.functionName}] ${message}`,
      data: { ...(context.metadata || {}), ...data },
    });
  },
  
  warn: (message: string, context: MonitoringContext, data?: any) => {
    console.warn(`⚠️  [${context.functionName}]`, message, data || '');
    
    addSentryBreadcrumb({
      category: 'warning',
      message: `[${context.functionName}] ${message}`,
      data: { ...(context.metadata || {}), ...data },
    });
  },
  
  error: (message: string, error: Error, context: MonitoringContext) => {
    console.error(`❌ [${context.functionName}]`, message, error);
    
    captureSentryException(error, {
      function: context.functionName,
      message,
      userId: context.userId,
      requestId: context.requestId,
      ...(context.metadata || {}),
    });
  },
  
  debug: (message: string, context: MonitoringContext, data?: any) => {
    if (Deno.env.get('DEBUG')) {
      console.debug(`🐛 [${context.functionName}]`, message, data || '');
    }
  },
};

/**
 * Wrapper CORS securise
 */
const ALLOWED_ORIGINS = [
  'https://emotionscare.com',
  'https://www.emotionscare.com',
  'https://emotions-care.lovable.app',
  'http://localhost:5173',
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') ?? '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

/**
 * Wrapper de fonction Edge Function avec monitoring complet
 */
export function withMonitoring<T = any>(
  functionName: string,
  handler: (req: Request, context: MonitoringContext) => Promise<T>
) {
  return async (req: Request): Promise<Response> => {
    // Initialiser Sentry si pas déjà fait
    const sentry = initSentry();
    
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: getCorsHeaders(req) });
    }
    
    // Générer un ID de requête unique
    const requestId = crypto.randomUUID();
    
    // Créer le contexte de monitoring
    const context: MonitoringContext = {
      functionName,
      requestId,
      metadata: {
        method: req.method,
        url: req.url,
        timestamp: new Date().toISOString(),
      },
    };
    
    const startTime = Date.now();
    
    try {
      // Extraire l'ID utilisateur du JWT si disponible
      const authHeader = req.headers.get('Authorization');
      if (authHeader) {
        try {
          const token = authHeader.replace('Bearer ', '');
          const payload = JSON.parse(atob(token.split('.')[1]));
          context.userId = payload.sub;
          if (context.metadata) {
            context.metadata.userId = payload.sub;
          }
        } catch {
          // Ignore si parsing échoue
        }
      }
      
      // Log de démarrage
      logger.info('Requête reçue', context);
      
      // Breadcrumb Sentry
      addSentryBreadcrumb({
        category: 'http',
        message: `${req.method} ${req.url}`,
        data: {
          function: functionName,
          requestId,
          userId: context.userId,
        },
      });
      
      // Exécuter le handler
      const result = await handler(req, context);
      const duration = Date.now() - startTime;
      
      // Log de succès
      logger.info('Requête terminée avec succès', context, { duration: `${duration}ms` });
      
      // Breadcrumb succès
      addSentryBreadcrumb({
        category: 'http.response',
        message: `Success ${req.method} ${req.url}`,
        data: { duration, status: 200 },
      });
      
      // Retourner la réponse
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          ...getCorsHeaders(req),
          'Content-Type': 'application/json',
          'X-Request-Id': requestId,
          'X-Function-Name': functionName,
          'X-Response-Time': `${duration}ms`,
        },
      });
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      // Log d'erreur avec Sentry
      logger.error('Erreur lors du traitement de la requête', error, context);
      
      // Breadcrumb erreur
      addSentryBreadcrumb({
        category: 'http.error',
        message: `Error ${req.method} ${req.url}`,
        data: {
          error: error.message,
          duration,
          status: 500,
        },
      });
      
      // Retourner une erreur structurée
      return new Response(
        JSON.stringify({
          error: error.message || 'Internal Server Error',
          requestId,
          function: functionName,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 500,
          headers: {
            ...getCorsHeaders(req),
            'Content-Type': 'application/json',
            'X-Request-Id': requestId,
            'X-Response-Time': `${duration}ms`,
          },
        }
      );
    }
  };
}

/**
 * Mesure le temps d'exécution d'une opération
 */
export async function measureTime<T>(
  operationName: string,
  operation: () => Promise<T>,
  context: MonitoringContext
): Promise<T> {
  const startTime = Date.now();
  
  try {
    logger.debug(`Début: ${operationName}`, context);
    
    const result = await operation();
    const duration = Date.now() - startTime;
    
    logger.info(`${operationName} terminé`, context, { duration: `${duration}ms` });
    
    addSentryBreadcrumb({
      category: 'operation',
      message: operationName,
      data: { duration, success: true },
    });
    
    return result;
  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    logger.error(`Erreur dans ${operationName}`, error, context);
    
    addSentryBreadcrumb({
      category: 'operation',
      message: `${operationName} failed`,
      data: { duration, error: error.message },
    });
    
    throw error;
  }
}

/**
 * Wrapper pour les appels Supabase avec monitoring
 */
export async function withSupabaseCall<T>(
  operationName: string,
  supabaseCall: () => Promise<{ data: T | null; error: any }>,
  context: MonitoringContext
): Promise<T> {
  return measureTime(
    `Supabase: ${operationName}`,
    async () => {
      const { data, error } = await supabaseCall();
      
      if (error) {
        logger.error(`Erreur Supabase: ${operationName}`, error, {
          ...context,
          metadata: context.metadata || {},
        });
        throw new Error(error.message || 'Erreur Supabase');
      }
      
      if (!data) {
        throw new Error('Aucune donnée retournée');
      }
      
      return data;
    },
    context
  );
}

export default {
  withMonitoring,
  measureTime,
  withSupabaseCall,
  logger,
};
