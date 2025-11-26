// @ts-nocheck
/**
 * assistant-api - OpenAI Assistants API integration
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 15/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { authorizeRole } from '../_shared/auth.ts';
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
    console.warn('[assistant-api] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  // 2. Auth
  const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user', 'b2b_admin', 'admin']);
  if (!user) {
    console.warn('[assistant-api] Unauthorized access attempt');
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 3. 🛡️ Rate limiting (OpenAI API calls are expensive)
  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'assistant-api',
    userId: user.id,
    limit: 15,
    windowMs: 60_000,
    description: 'OpenAI Assistants API',
  });

  if (!rateLimit.allowed) {
    console.warn('[assistant-api] Rate limit exceeded', { userId: user.id });
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  console.log(`[assistant-api] Processing for user: ${user.id}`);

  try {
    if (!openAIApiKey) {
      throw new Error("OpenAI API key is not configured");
    }

    const { action, assistantId, threadId, content, instructions } = await req.json();
    
    console.log(`Assistant API request: ${action}`);

    switch (action) {
      case 'create_assistant':
        // Création d'un assistant
        const createAssistantResponse = await fetch('https://api.openai.com/v1/assistants', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v1'
          },
          body: JSON.stringify({
            name: "Coach EmotionsCare",
            instructions: instructions || "Répondre avec empathie et clarté aux questions émotionnelles ou pratiques des utilisateurs.",
            model: "gpt-4.1-2025-04-14",
            tools: []
          }),
        });
        
        const assistant = await createAssistantResponse.json();
        return new Response(JSON.stringify({ assistant }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'create_thread':
        // Création d'un thread de conversation
        const createThreadResponse = await fetch('https://api.openai.com/v1/threads', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v1'
          },
          body: JSON.stringify({}),
        });
        
        const thread = await createThreadResponse.json();
        return new Response(JSON.stringify({ thread }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'create_message':
        // Ajout d'un message à un thread
        if (!threadId) throw new Error("Thread ID is required");
        
        const createMessageResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v1'
          },
          body: JSON.stringify({
            role: "user",
            content: content
          }),
        });
        
        const message = await createMessageResponse.json();
        return new Response(JSON.stringify({ message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'run_assistant':
        // Exécuter l'assistant sur un thread
        if (!threadId || !assistantId) throw new Error("Thread ID and Assistant ID are required");
        
        const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v1'
          },
          body: JSON.stringify({
            assistant_id: assistantId
          }),
        });
        
        const run = await runResponse.json();
        return new Response(JSON.stringify({ run }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'get_messages':
        // Récupérer les messages d'un thread
        if (!threadId) throw new Error("Thread ID is required");
        
        const getMessagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v1'
          },
        });
        
        const messages = await getMessagesResponse.json();
        return new Response(JSON.stringify({ messages }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'check_run':
        // Vérifier l'état d'une exécution
        if (!threadId || !content) throw new Error("Thread ID and Run ID are required");
        
        const runId = content; // Dans ce cas, content contient l'ID du run
        const checkRunResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v1'
          },
        });
        
        const runStatus = await checkRunResponse.json();
        return new Response(JSON.stringify({ run: runStatus }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error) {
    console.error('Error in assistant-api function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
