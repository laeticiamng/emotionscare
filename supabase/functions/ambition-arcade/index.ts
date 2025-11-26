// @ts-nocheck
/**
 * ambition-arcade - Gamification des objectifs avec IA
 *
 * 🔒 SÉCURISÉ: Auth multi-rôle + Rate limit 20/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user', 'b2b_admin', 'admin']);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'ambition-arcade',
      userId: user.id,
      limit: 20,
      windowMs: 60_000,
      description: 'Ambition Arcade - Gamification AI',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    const { goal, timeframe = '30', difficulty = 'medium' } = await req.json();
    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const messages = [
      {
        role: 'system',
        content: `Tu es un coach gamification. Décompose l'objectif en niveaux gamifiés avec points, badges et milestones. Réponds en JSON: { "levels": [{"name": "Level 1", "description": "desc", "points": 100, "tasks": ["tâche1", "tâche2"]}], "totalPoints": 1000, "badges": ["badge1", "badge2"] }`
      },
      {
        role: 'user',
        content: `Objectif: ${goal}. Délai: ${timeframe} jours. Difficulté: ${difficulty}`
      }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages,
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const gameContent = data.choices?.[0]?.message?.content || '';

    try {
      const gameStructure = JSON.parse(gameContent);
      return new Response(JSON.stringify({ gameStructure }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch {
      // Fallback structure
      return new Response(JSON.stringify({
        gameStructure: {
          levels: [
            { name: "Niveau 1", description: "Commencer", points: 100, tasks: ["Première étape"] },
            { name: "Niveau 2", description: "Progresser", points: 200, tasks: ["Continuer"] }
          ],
          totalPoints: 500,
          badges: ["Débutant", "Motivé"]
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in ambition-arcade function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
