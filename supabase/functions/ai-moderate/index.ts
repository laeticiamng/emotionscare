/**
 * ai-moderate - Modération de contenu via OpenAI
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 30/min + CORS restrictif
 */
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { authenticateRequest } from '../_shared/auth-middleware.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // 1. CORS check
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  // Vérification CORS stricte
  if (!corsResult.allowed) {
    console.warn('[ai-moderate] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  // 2. 🔒 SÉCURITÉ: Authentification obligatoire
  const authResult = await authenticateRequest(req);
  if (authResult.status !== 200 || !authResult.user) {
    console.warn('[ai-moderate] Unauthorized access attempt');
    return new Response(JSON.stringify({ error: authResult.error || 'Authentication required' }), {
      status: authResult.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 3. 🛡️ Rate limiting
  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'ai-moderate',
    userId: authResult.user.id,
    limit: 30,
    windowMs: 60_000,
    description: 'AI content moderation',
  });

  if (!rateLimit.allowed) {
    console.warn('[ai-moderate] Rate limit exceeded', { userId: authResult.user.id });
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  console.log(`[ai-moderate] Processing for user: ${authResult.user.id}`);

  if (!openAIApiKey) {
    console.error('OpenAI API key not found');
    return new Response(JSON.stringify({ error: 'Service configuration error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { text, context = 'general' } = await req.json();

    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: 'Text content is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Moderating content for context: ${context}`);

    // Use OpenAI Moderation API
    const moderationResponse = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: text,
        model: 'text-moderation-latest'
      }),
    });

    if (!moderationResponse.ok) {
      console.error('OpenAI Moderation API error:', moderationResponse.status);
      throw new Error('Moderation service error');
    }

    const moderationData = await moderationResponse.json();
    const result = moderationData.results[0];

    const response = {
      flagged: result.flagged,
      categories: result.categories,
      category_scores: result.category_scores,
      safe: !result.flagged,
      message: result.flagged 
        ? 'Ce contenu ne respecte pas nos directives communautaires. Veuillez reformuler de manière bienveillante.'
        : 'Contenu approuvé',
      context,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Moderation service error';
    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error('Error in ai-moderate function:', errorMessage, errorDetails);
    return new Response(JSON.stringify({ 
      error: 'Moderation service error',
      safe: false,
      message: 'Impossible de vérifier le contenu actuellement. Veuillez réessayer.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});