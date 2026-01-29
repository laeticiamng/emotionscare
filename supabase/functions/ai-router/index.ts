// @ts-nocheck
/**
 * AI Router Edge Function
 * Router intelligent avec fallback et latence optimisée
 * MODULE 2 - EmotionsCare 2.0
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY') ?? '';
const AI_GATEWAY_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';

// Configuration des modèles
const MODEL_CONFIG = {
  default: 'google/gemini-3-flash-preview',
  complex: 'google/gemini-2.5-pro',
  fast: 'google/gemini-2.5-flash-lite',
  fallback: 'google/gemini-2.5-flash',
};

// Timeout settings (ms)
const TIMEOUT = {
  default: 10000,
  extended: 30000,
};

interface RouterRequest {
  prompt: string;
  context?: string;
  type?: 'coach' | 'analysis' | 'summary' | 'emotion' | 'general';
  stream?: boolean;
  maxTokens?: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: RouterRequest = await req.json();
    const { prompt, context, type = 'general', stream = false, maxTokens = 1024 } = body;

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sélectionner le modèle selon le type de requête
    const model = selectModel(type, prompt.length);
    const systemPrompt = getSystemPrompt(type);

    console.log(`[AI Router] Request type: ${type}, model: ${model}, user: ${user.id}`);

    // Tentative principale
    const response = await callAI({
      model,
      systemPrompt,
      prompt,
      context,
      stream,
      maxTokens,
      timeout: TIMEOUT.default,
    });

    if (response.ok) {
      const latency = Date.now() - startTime;
      console.log(`[AI Router] Success with ${model} in ${latency}ms`);

      // Log pour analytics
      await logRequest(supabase, user.id, type, model, latency, true);

      if (stream) {
        return new Response(response.body, {
          headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
        });
      }

      const data = await response.json();
      return new Response(
        JSON.stringify({
          content: data.choices?.[0]?.message?.content || '',
          model,
          latency,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fallback si le modèle principal échoue
    console.log(`[AI Router] Primary model failed, trying fallback...`);

    const fallbackResponse = await callAI({
      model: MODEL_CONFIG.fallback,
      systemPrompt,
      prompt,
      context,
      stream,
      maxTokens,
      timeout: TIMEOUT.extended,
    });

    if (fallbackResponse.ok) {
      const latency = Date.now() - startTime;
      console.log(`[AI Router] Fallback success in ${latency}ms`);

      await logRequest(supabase, user.id, type, MODEL_CONFIG.fallback, latency, true, true);

      if (stream) {
        return new Response(fallbackResponse.body, {
          headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
        });
      }

      const data = await fallbackResponse.json();
      return new Response(
        JSON.stringify({
          content: data.choices?.[0]?.message?.content || '',
          model: MODEL_CONFIG.fallback,
          latency,
          fallback: true,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Both failed
    const latency = Date.now() - startTime;
    await logRequest(supabase, user.id, type, model, latency, false);

    // Rate limit handling
    if (response.status === 429 || fallbackResponse.status === 429) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' } }
      );
    }

    // Payment required
    if (response.status === 402 || fallbackResponse.status === 402) {
      return new Response(
        JSON.stringify({ error: 'AI credits exhausted. Please add funds to continue.' }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'AI service temporarily unavailable' }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[AI Router] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function selectModel(type: string, promptLength: number): string {
  // Requêtes complexes (analyse, coach) → modèle puissant
  if (type === 'analysis' || type === 'coach' || promptLength > 2000) {
    return MODEL_CONFIG.complex;
  }

  // Résumés courts → modèle rapide
  if (type === 'summary' || promptLength < 200) {
    return MODEL_CONFIG.fast;
  }

  // Défaut
  return MODEL_CONFIG.default;
}

function getSystemPrompt(type: string): string {
  switch (type) {
    case 'coach':
      return `Tu es Nyvée, une coach émotionnelle bienveillante et empathique. Tu accompagnes des professionnels de santé dans leur bien-être émotionnel. Tu réponds toujours en français, de manière chaleureuse et encourageante. Tu utilises des techniques de psychologie positive et de pleine conscience.`;

    case 'analysis':
      return `Tu es un analyste émotionnel expert. Tu analyses les patterns émotionnels et comportementaux avec précision. Tu fournis des insights actionnables basés sur les données. Réponds en français de manière structurée.`;

    case 'emotion':
      return `Tu es spécialisé dans l'analyse des émotions. Identifie les émotions présentes, leur intensité, et les déclencheurs potentiels. Réponds en JSON structuré avec les champs: emotions (array), dominant (string), intensity (number 0-1), triggers (array).`;

    case 'summary':
      return `Tu résumes de manière concise et claire. Garde les points essentiels, utilise des puces si nécessaire. Maximum 3-5 phrases.`;

    default:
      return `Tu es un assistant bienveillant pour l'application EmotionsCare, dédiée au bien-être émotionnel des soignants. Réponds en français de manière empathique et utile.`;
  }
}

async function callAI(options: {
  model: string;
  systemPrompt: string;
  prompt: string;
  context?: string;
  stream: boolean;
  maxTokens: number;
  timeout: number;
}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout);

  try {
    const messages = [
      { role: 'system', content: options.systemPrompt },
    ];

    if (options.context) {
      messages.push({ role: 'user', content: `Contexte: ${options.context}` });
      messages.push({ role: 'assistant', content: 'Je prends en compte ce contexte.' });
    }

    messages.push({ role: 'user', content: options.prompt });

    const response = await fetch(AI_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options.model,
        messages,
        stream: options.stream,
        max_tokens: options.maxTokens,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function logRequest(
  supabase: any,
  userId: string,
  type: string,
  model: string,
  latency: number,
  success: boolean,
  fallback = false
) {
  try {
    await supabase.from('ai_router_logs').insert({
      user_id: userId,
      request_type: type,
      model_used: model,
      latency_ms: latency,
      success,
      used_fallback: fallback,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[AI Router] Failed to log request:', error);
  }
}
