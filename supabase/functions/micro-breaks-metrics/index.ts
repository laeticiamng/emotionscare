// @ts-nocheck
/**
 * micro-breaks-metrics - Métriques des micro-pauses
 *
 * 🔒 SÉCURISÉ: Auth multi-rôle + Rate limit 60/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

interface MicroBreakMetrics {
  module: 'screen-silk' | 'other';
  action: 'start' | 'end';
  duration_s?: number;
  label?: 'gain' | 'léger' | 'incertain';
  blink_count?: number;
  user_agent?: string;
}

serve(async (req) => {
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  if (!corsResult.allowed) {
    return rejectCors(corsResult);
  }

  const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user', 'b2b_admin', 'admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'micro-breaks-metrics',
    userId: user.id,
    limit: 60,
    windowMs: 60_000,
    description: 'Micro-breaks metrics',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const body: MicroBreakMetrics = await req.json();
    
    // Validation des données
    if (!body.module || !body.action) {
      return new Response(
        JSON.stringify({ error: 'Module et action requis' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Log des métriques (à remplacer par une vraie base de données)
    console.log('📊 Métriques micro-pause reçues:', {
      module: body.module,
      action: body.action,
      duration: body.duration_s || 0,
      label: body.label || 'unknown',
      blinkCount: body.blink_count || 0,
      timestamp: new Date().toISOString(),
      userAgent: req.headers.get('user-agent')?.slice(0, 100) || 'unknown'
    });

    // Simulation d'enregistrement réussi
    const response = {
      success: true,
      module: body.module,
      action: body.action,
      timestamp: new Date().toISOString(),
      message: `Métriques ${body.module} enregistrées avec succès`
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Erreur dans micro-breaks-metrics:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Erreur interne du serveur', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});