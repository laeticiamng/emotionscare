/**
 * chat-with-ai - Coach IA conversationnel EmotionsCare
 *
 * 🔒 SÉCURISÉ:
 * - Authentification JWT obligatoire
 * - Rate limiting: 20 req/min
 * - CORS restrictif (ALLOWED_ORIGINS)
 * - Validation inputs
 */

import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { authenticateRequest, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';
import { z } from '../_shared/zod.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

// Schema de validation
const RequestSchema = z.object({
  message: z.string().min(1, 'Message required').max(2000, 'Message too long'),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string().max(2000),
      })
    )
    .max(20, 'History too long')
    .optional()
    .default([]),
  userContext: z.string().max(500).optional(),
});

Deno.serve(async (req) => {
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
    console.warn('[chat-with-ai] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  try {
    // 2. 🔒 Authentification obligatoire
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200 || !authResult.user) {
      await logUnauthorizedAccess(req, authResult.error || 'Authentication failed');
      return new Response(JSON.stringify({ error: authResult.error || 'Authentication required' }), {
        status: authResult.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. 🛡️ Rate limiting
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'chat-with-ai',
      userId: authResult.user.id,
      limit: 20,
      windowMs: 60_000,
      description: 'AI Chat - OpenAI API',
    });

    if (!rateLimit.allowed) {
      console.warn('[chat-with-ai] Rate limit exceeded', { userId: authResult.user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de messages. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    // 4. ✅ Validation du body
    const rawBody = await req.json();
    const parseResult = RequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const errors = parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return new Response(JSON.stringify({ error: `Invalid input: ${errors}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, conversationHistory, userContext } = parseResult.data;

    if (!openAIApiKey) {
      // Fallback response when no API key
      return new Response(
        JSON.stringify({
          response:
            "Je suis votre coach bien-être EmotionsCare. Comment puis-je vous aider aujourd'hui ? (Mode démo - API non configurée)",
          conversationId: 'demo-' + Date.now(),
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[chat-with-ai] Processing message for user: ${authResult.user.id}`);

    // Build conversation context
    const systemPrompt = `Tu es un coach en bien-être empathique et professionnel pour EmotionsCare.

Ton rôle :
- Écouter avec bienveillance les préoccupations émotionnelles
- Proposer des conseils pratiques et des exercices de bien-être
- Encourager sans porter de jugement
- Orienter vers des ressources appropriées si nécessaire
- Maintenir une approche positive et constructive

Style de communication :
- Chaleureux et authentique
- Utilise un langage accessible
- Pose des questions ouvertes pour approfondir
- Propose des actions concrètes
- Respecte les limites professionnelles

Contexte utilisateur : ${userContext || 'Utilisateur EmotionsCare cherchant du soutien'}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({
        response: aiResponse,
        conversationId: Date.now().toString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error in chat-with-ai';
    console.error('[chat-with-ai] Error:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
