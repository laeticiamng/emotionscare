// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import OpenAI from 'https://deno.land/x/openai@v4.28.0/mod.ts';
import { authenticateRequest } from '../_shared/auth-middleware.ts';
import { supabase } from '../_shared/supa_client.ts';
import { resolveCors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { z } from '../_shared/zod.ts';

const GeneratePlanSchema = z.object({
  session_id: z.string().uuid(),
  emotion_analysis: z.object({
    primary_emotion: z.string(),
    valence: z.number().min(-1).max(1),
    arousal: z.number().min(0).max(1),
    detected_emotions: z.array(z.object({
      label: z.string(),
      intensity: z.number().min(0).max(1),
    })).optional().default([]),
  }),
});

const BASE_RECOMMENDATIONS: Record<string, Array<any>> = {
  anxiety: [
    { type: 'breathing', title: 'Respiration 4-7-8', durationMin: 5, priority: 1 },
    { type: 'music', title: 'Ambiance apaisante', durationMin: 3, priority: 2 },
    { type: 'light', title: 'Lumière chaude', durationMin: 2, priority: 3 },
  ],
  stress: [
    { type: 'breathing', title: 'Respiration carrée', durationMin: 4, priority: 1 },
    { type: 'grounding', title: 'Ancrage 5-4-3-2-1', durationMin: 3, priority: 2 },
    { type: 'music', title: 'Musique douce', durationMin: 3, priority: 3 },
  ],
  sadness: [
    { type: 'journaling', title: 'Journal rapide', durationMin: 5, priority: 1 },
    { type: 'music', title: 'Soutien musical', durationMin: 4, priority: 2 },
    { type: 'light', title: 'Lumière cocon', durationMin: 3, priority: 3 },
  ],
  joy: [
    { type: 'grounding', title: 'Ancrage gratitude', durationMin: 3, priority: 1 },
    { type: 'music', title: 'Playlist énergisante', durationMin: 4, priority: 2 },
    { type: 'light', title: 'Lumière dynamique', durationMin: 2, priority: 3 },
  ],
};

const getRecommendations = (emotion: string) => {
  const key = emotion?.toLowerCase();
  return BASE_RECOMMENDATIONS[key] ?? [
    { type: 'breathing', title: 'Respiration cohérence', durationMin: 5, priority: 1 },
    { type: 'music', title: 'Musique équilibrante', durationMin: 4, priority: 2 },
    { type: 'light', title: 'Lumière douce', durationMin: 2, priority: 3 },
  ];
};

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

    const payload = await req.json();
    const parsed = GeneratePlanSchema.safeParse(payload);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...cors.headers } },
      );
    }

    const { session_id, emotion_analysis } = parsed.data;
    const baseRecommendations = getRecommendations(emotion_analysis.primary_emotion);

    let recommendations = baseRecommendations.map(rec => ({
      ...rec,
      description: '',
    }));

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (openaiApiKey) {
      const openai = new OpenAI({ apiKey: openaiApiKey });
      const systemPrompt = `Tu es un coach EmotionsCare. Reformule des recommandations en français, 1 phrase max, ton bienveillant.`;
      const userPrompt = `Émotion principale: ${emotion_analysis.primary_emotion}
Recommandations: ${JSON.stringify(baseRecommendations)}

Retourne exactement ${baseRecommendations.length} descriptions, une pour chaque recommandation dans l'ordre.`;

      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4.1-mini-2025-04-14',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'RecommendationDescriptions',
              schema: {
                type: 'object',
                properties: {
                  descriptions: {
                    type: 'array',
                    items: {
                      type: 'string',
                      description: 'Une phrase de description bienveillante pour la recommandation',
                    },
                    description: 'Liste des descriptions pour chaque recommandation',
                  },
                },
                required: ['descriptions'],
                additionalProperties: false,
              },
              strict: true,
            },
          },
          temperature: 0.4,
          max_completion_tokens: 300,
        });
        const content = response.choices[0]?.message?.content ?? '';
        const parsed = JSON.parse(content);
        recommendations = baseRecommendations.map((rec, index) => ({
          ...rec,
          description: parsed.descriptions[index] || `Action ${rec.title}`,
        }));
      } catch (error) {
        console.error('[generate-plan] OpenAI error:', error);
        recommendations = baseRecommendations.map((rec) => ({
          ...rec,
          description: `Action recommandée: ${rec.title}`,
        }));
      }
    } else {
      recommendations = baseRecommendations.map((rec) => ({
        ...rec,
        description: `Action recommandée: ${rec.title}`,
      }));
    }

    const estimatedDurationMin = recommendations.reduce(
      (total, rec) => total + (rec.durationMin ?? 0),
      0,
    );

    const { data: plan, error } = await supabase
      .from('emotion_plans')
      .insert({
        session_id,
        user_id: auth.user.id,
        plan_type: 'immediate',
        recommendations,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        planId: plan.id,
        sessionId: plan.session_id,
        recommendations,
        estimatedDurationMin,
      }),
      { headers: { 'Content-Type': 'application/json', ...cors.headers } },
    );
  } catch (error) {
    console.error('[generate-plan] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message ?? 'Internal error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...cors.headers } },
    );
  }
});
