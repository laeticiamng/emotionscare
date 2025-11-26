// @ts-nocheck
/**
 * dashboard-weekly - Tableau de bord hebdomadaire
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 30/min + CORS restrictif
 */
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { supabase } from '../_shared/supa_client.ts';
import { getUserHash } from '../_shared/http.ts';
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

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

  try {
    const { user: authUser, status } = await authorizeRole(req, ['b2c', 'b2b_user']);
    if (!authUser) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'dashboard-weekly',
      userId: authUser.id,
      limit: 30,
      windowMs: 60_000,
      description: 'Dashboard weekly API',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    const jwt = req.headers.get('authorization')?.replace('Bearer ', '') || '';
    const userHash = getUserHash(jwt);
    
    // Get current week start (Monday)
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - now.getDay() + 1);
    const weekStart = monday.toISOString().split('T')[0];
    
    // Generate mock weekly data - in production this would query real user metrics
    const generateDayData = (dayOffset: number) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + dayOffset);
      
      // Simulate glow score based on user activity patterns
      const baseScore = 45 + Math.random() * 50; // 45-95 range
      const score = Math.floor(baseScore);
      
      let bucket: 'low' | 'medium' | 'high';
      if (score < 50) bucket = 'low';
      else if (score < 70) bucket = 'medium';
      else bucket = 'high';
      
      const tips = {
        low: ['Écran-silk 90 s ?', 'Fais une marche de 5 min.', 'Respire 4-6-8 1 min.'],
        medium: ['Continue comme ça !', 'Peut-être une micro-pause ?', 'Écoute ton corps.'],
        high: ['Garde le rythme ✨', 'Tu rayonnes !', 'Bel équilibre !']
      };
      
      return {
        date: date.toISOString().split('T')[0],
        glow_score: score,
        glow_bucket: bucket,
        tip: tips[bucket][Math.floor(Math.random() * tips[bucket].length)]
      };
    };

    // Generate 7 days of data
    const days = Array.from({ length: 7 }, (_, i) => generateDayData(i));
    const today = days[new Date().getDay() - 1] || days[0]; // Current day or Monday

    const weeklyData = {
      week_start: weekStart,
      days,
      today
    };

    return new Response(JSON.stringify(weeklyData), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('dashboard-weekly error', err);
    return new Response(JSON.stringify({ error: 'server_error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});