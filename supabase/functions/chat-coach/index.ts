// @ts-nocheck
/**
 * chat-coach - Coach IA en bien-être émotionnel
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 20/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { authenticateRequest } from '../_shared/auth-middleware.ts';
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
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200 || !authResult.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: authResult.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'chat-coach',
      userId: authResult.user.id,
      limit: 20,
      windowMs: 60_000,
      description: 'Chat coach AI',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { message, history } = await req.json();

    // Build conversation context
    const messages = [
      {
        role: 'system',
        content: `Tu es un coach en bien-être émotionnel bienveillant et professionnel. Tu aides les utilisateurs à:
        - Comprendre et gérer leurs émotions
        - Développer des stratégies de bien-être
        - Réduire le stress et l'anxiété
        - Améliorer leur humeur et leur confiance
        
        Sois empathique, pratique et encourage toujours. Donne des conseils concrets et réalisables.
        Propose parfois des exercices simples (respiration, méditation, etc.).
        Si la situation semble grave, encourage à consulter un professionnel.
        Réponds en français de manière naturelle et bienveillante.`
      }
    ];

    // Add conversation history
    if (history && history.length > 0) {
      history.forEach((msg: any) => {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      });
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: messages,
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error('Chat coach error:', errorMessage, errorDetails);
    return new Response(
      JSON.stringify({ 
        error: 'Erreur de communication avec le coach IA',
        details: errorMessage 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
