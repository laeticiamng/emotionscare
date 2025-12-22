// @ts-nocheck
// Migrated to Lovable AI Gateway
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { authenticateRequest } from '../_shared/auth-middleware.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';
import { supabase } from '../_shared/supa_client.ts';
import { resolveCors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { z } from '../_shared/zod.ts';

const AnalyzeEmotionSchema = z.object({
  input_type: z.enum(['text', 'choice', 'voice', 'scan']),
  raw_input: z.string().max(500).optional().default(''),
  selected_emotion: z.string().optional().nullable(),
  intensity: z.number().min(1).max(10),
  context_tags: z.array(z.string()).optional().default([]),
}).superRefine((data, ctx) => {
  if (data.input_type === 'text') {
    const value = (data.raw_input ?? '').trim();
    if (!value) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['raw_input'],
        message: 'raw_input is required when input_type is "text".',
      });
    }
  }
});

serve(async (req) => {
  const cors = resolveCors(req);
  if (req.method === 'OPTIONS') {
    return preflightResponse(cors);
  }
  if (!cors.allowed) {
    return rejectCors(cors);
  }

  try {
    const auth = await authenticateRequest(req);
    if (auth.status !== 200 || !auth.user) {
      return new Response(JSON.stringify({ error: auth.error || 'Authentication required' }), {
        status: auth.status,
        headers: { 'Content-Type': 'application/json', ...cors.headers },
      });
    }

    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'analyze-emotion',
      userId: auth.user.id,
      limit: 8,
      windowMs: 60_000,
      description: 'Emotion analysis',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, cors.headers, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    const payload = await req.json();
    const parsed = AnalyzeEmotionSchema.safeParse(payload);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...cors.headers } },
      );
    }

    const start = Date.now();
    const { input_type, raw_input, selected_emotion, intensity, context_tags } = parsed.data;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `Tu es un analyste émotionnel EmotionsCare. Analyse un input utilisateur.
Contraintes: pas de diagnostic médical, langage "je détecte". Intensité 0..1. Valence -1..1. Arousal 0..1.`;

    const userPrompt = `Input type: ${input_type}
Texte: ${raw_input}
Émotion sélectionnée: ${selected_emotion ?? 'n/a'}
Intensité déclarée (1-10): ${intensity}
Contexte: ${context_tags.join(', ')}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'analyze_emotion_result',
              description: 'Retourne l\'analyse émotionnelle',
              parameters: {
                type: 'object',
                properties: {
                  detected_emotions: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        label: { type: 'string' },
                        intensity: { type: 'number', minimum: 0, maximum: 1 },
                        confidence: { type: 'number', minimum: 0, maximum: 1 },
                        valence: { type: 'number', minimum: -1, maximum: 1 }
                      },
                      required: ['label', 'intensity', 'confidence', 'valence']
                    }
                  },
                  primary_emotion: { type: 'string' },
                  valence: { type: 'number', minimum: -1, maximum: 1 },
                  arousal: { type: 'number', minimum: 0, maximum: 1 },
                  summary: { type: 'string' }
                },
                required: ['detected_emotions', 'primary_emotion', 'valence', 'arousal', 'summary'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'analyze_emotion_result' } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json', ...cors.headers }
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required' }), {
          status: 402,
          headers: { 'Content-Type': 'application/json', ...cors.headers }
        });
      }
      const errorText = await response.text();
      console.error('[analyze-emotion] AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    let analysis;
    if (toolCall) {
      try {
        analysis = JSON.parse(toolCall.function.arguments);
      } catch {
        analysis = { detected_emotions: [], primary_emotion: selected_emotion ?? 'neutral', valence: 0, arousal: 0.3, summary: 'Analyse non disponible' };
      }
    } else {
      analysis = { detected_emotions: [], primary_emotion: selected_emotion ?? 'neutral', valence: 0, arousal: 0.3, summary: 'Analyse non disponible' };
    }

    const detected = Array.isArray(analysis.detected_emotions) ? analysis.detected_emotions : [];
    const primaryEmotion = analysis.primary_emotion || selected_emotion || 'neutral';
    const normalizedIntensity = Math.min(1, Math.max(0, intensity / 10));
    const processingTime = Date.now() - start;

    const { data: session, error } = await supabase
      .from('emotion_sessions')
      .insert({
        user_id: auth.user.id,
        input_type,
        raw_input,
        detected_emotions: detected,
        primary_emotion: primaryEmotion,
        intensity: normalizedIntensity,
        valence: analysis.valence ?? 0,
        arousal: analysis.arousal ?? 0.3,
        context_tags,
        ai_model_version: 'google/gemini-2.5-flash',
        processing_time_ms: processingTime,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        detectedEmotions: detected,
        primaryEmotion,
        valence: analysis.valence ?? 0,
        arousal: analysis.arousal ?? 0.3,
        summary: analysis.summary ?? 'Analyse disponible.',
        modelVersion: 'google/gemini-2.5-flash',
      }),
      { headers: { 'Content-Type': 'application/json', ...cors.headers } },
    );
  } catch (error) {
    console.error('[analyze-emotion] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message ?? 'Internal error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...cors.headers } },
    );
  }
});
