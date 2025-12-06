
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { authenticateRequest, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';
import { buildRateLimitResponse, enforceEdgeRateLimit } from '../_shared/rate-limit.ts';

serve(async (req) => {
  // Headers CORS sécurisés
  const corsHeaders = {
    'Access-Control-Allow-Origin': req.headers.get('Origin') || '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Security-Policy': "default-src 'self'",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Vérification de l'authentification
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200) {
      await logUnauthorizedAccess(req, authResult.error || 'Authentication failed');
      return new Response(
        JSON.stringify({ error: authResult.error }),
        { status: authResult.status, headers: corsHeaders }
      );
    }

    // Rate limiting
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'analyze-emotion',
      userId: authResult.user.id,
      limit: 10,
      windowMs: 60_000,
      description: 'analyze-emotion',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        message: 'Trop de requêtes. Veuillez patienter.',
      });
    }

    const { text } = await req.json();
    
    if (!text || typeof text !== 'string' || text.length > 1000) {
      return new Response(
        JSON.stringify({ error: 'Texte invalide ou trop long (max 1000 caractères)' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY non configurée');
      return new Response(
        JSON.stringify({ error: 'Service temporairement indisponible' }),
        { status: 503, headers: corsHeaders }
      );
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          content: 'Tu es un expert en analyse émotionnelle. Analyse le texte et retourne uniquement un objet JSON avec: emotion (string), intensity (number 0-10), confidence (number 0-1).'
        }, {
          role: 'user',
          content: text
        }],
        max_tokens: 150,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('Réponse OpenAI invalide');
    }

    const analysis = JSON.parse(content);
    
    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur dans analyze-emotion:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de l\'analyse émotionnelle' }),
      { status: 500, headers: corsHeaders }
    );
  }
});
