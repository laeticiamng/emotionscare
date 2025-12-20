import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { authenticateRequest } from '../_shared/auth-middleware.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';
import { validateRequest, createErrorResponse, OpenAIChatRequestSchema } from '../_shared/validation.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 🔒 SÉCURITÉ: Authentification obligatoire
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200 || !authResult.user) {
      console.warn('[openai-chat] Unauthorized access attempt');
      return createErrorResponse(authResult.error || 'Authentication required', authResult.status, corsHeaders);
    }

    // 🛡️ SÉCURITÉ: Rate limiting strict (10 req/min)
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'openai-chat',
      userId: authResult.user.id,
      limit: 10,
      windowMs: 60_000,
      description: 'OpenAI chat completions'
    });

    if (!rateLimit.allowed) {
      console.warn('[openai-chat] Rate limit exceeded', { userId: authResult.user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes chat. Réessayez dans ${rateLimit.retryAfterSeconds}s.`
      });
    }

    // ✅ VALIDATION: Validation Zod des entrées
    const validation = await validateRequest(req, OpenAIChatRequestSchema);
    if (!validation.success) {
      return createErrorResponse(validation.error, validation.status, corsHeaders);
    }

    const { messages } = validation.data as { messages: Array<{role: string, content: string}> };

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Modèle rapide et économique
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    
    return new Response(
      JSON.stringify({ response: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('OpenAI chat error:', errorMessage)
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
