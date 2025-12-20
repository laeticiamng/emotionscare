// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import OpenAI from 'https://deno.land/x/openai@v4.28.0/mod.ts';
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

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });
    const systemPrompt = `Tu es un analyste émotionnel EmotionsCare. Analyse un input utilisateur et réponds STRICTEMENT en JSON :
{
  "detected_emotions": [
    {"label": "anxiété", "intensity": 0.7, "confidence": 0.9, "valence": -0.4}
  ],
  "primary_emotion": "anxiété",
  "valence": -0.4,
  "arousal": 0.7,
  "summary": "Je détecte principalement..."
}
Contraintes: pas de diagnostic médical, langage "je détecte". Intensité 0..1. Valence -1..1. Arousal 0..1.`;

    const userPrompt = `Input type: ${input_type}
Texte: ${raw_input}
Émotion sélectionnée: ${selected_emotion ?? 'n/a'}
Intensité déclarée (1-10): ${intensity}
Contexte: ${context_tags.join(', ')}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content ?? '{}';
    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch {
      analysis = { detected_emotions: [], primary_emotion: selected_emotion ?? 'neutral', valence: 0, arousal: 0.3, summary: content };
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
        ai_model_version: response.model ?? 'gpt-4.1',
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
        modelVersion: response.model ?? 'gpt-4.1',
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
