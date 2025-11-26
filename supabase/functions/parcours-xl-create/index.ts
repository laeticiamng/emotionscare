// @ts-nocheck
/**
 * parcours-xl-create - Création de parcours XL thérapeutiques
 *
 * 🔒 SÉCURISÉ: Auth user + Rate limit 10/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import OpenAI from 'https://esm.sh/openai@4.20.1';
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

// Presets disponibles (en attendant les YAMLs)
const PRESETS: Record<string, any> = {
  'universel-reset': {
    title: 'Reset Universel → Équilibre',
    emotionLabel: 'Reset/Équilibre',
    musicStyle: 'Calming 6/8, 68 BPM, dorian, felt piano + handpan',
    targetDuration: 18,
  },
  'panique-anxiete': {
    title: 'Panique → Calme',
    emotionLabel: 'Anxiété/Panique',
    musicStyle: 'A dorian 64 BPM, handpan lull, felt piano',
    targetDuration: 20,
  },
  'tristesse-deuil': {
    title: 'Tristesse → Lumière',
    emotionLabel: 'Tristesse/Deuil',
    musicStyle: 'Cinematic piano & strings 68 BPM, lydian shimmer',
    targetDuration: 22,
  },
};

serve(async (req: Request) => {
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
    const { presetKey, emotionState } = await req.json();

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Rate limiting per-user
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'parcours-xl-create',
      userId: user.id,
      limit: 10,
      windowMs: 60_000,
      description: 'Parcours XL creation',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    console.log(`[create] 🎭 Creating parcours XL: ${presetKey} for user: ${user.id}`);

    const preset = PRESETS[presetKey];
    if (!preset) {
      throw new Error(`Preset inconnu: ${presetKey}`);
    }

    // Générer le brief avec OpenAI Structured Outputs (JSON Schema strict)
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const openai = new OpenAI({ apiKey: openaiKey });

    console.log(`[create] Generating brief for preset: ${presetKey}, emotion: ${preset.emotionLabel}`);

    const briefResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Tu es un thérapeute spécialisé en TCC, ACT et DBT. Tu génères des scripts thérapeutiques personnalisés en français.`
        },
        {
          role: 'user',
          content: `Génère un brief thérapeutique pour un parcours musical de ${preset.targetDuration}-${preset.targetDuration + 4} minutes sur l'émotion "${preset.emotionLabel}". Style musical: ${preset.musicStyle}. Inclus 3-4 segments avec transitions fluides. Chaque segment doit avoir un prompt Suno descriptif.`
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'TherapyBrief',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              brief: { type: 'string', description: 'Vue d\'ensemble du parcours thérapeutique' },
              segments: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    prompt: { type: 'string', description: 'Prompt Suno pour ce segment musical' },
                    duration_min: { type: 'number', description: 'Durée souhaitée en minutes (4-6 min)' },
                    technique: { type: 'string', description: 'Technique thérapeutique (TCC/ACT/DBT)' }
                  },
                  required: ['prompt', 'duration_min', 'technique'],
                  additionalProperties: false
                },
                minItems: 3,
                maxItems: 4
              }
            },
            required: ['brief', 'segments'],
            additionalProperties: false
          }
        }
      },
      temperature: 0.7,
    });

    const briefContent = briefResponse.choices[0]?.message?.content;
    if (!briefContent) {
      throw new Error('No brief generated');
    }

    const briefData = JSON.parse(briefContent);
    console.log(`[create] ✅ Brief generated with ${briefData.segments?.length || 0} segments`);

    // Créer la run dans la DB
    const { data: run, error: runError } = await supabase
      .from('parcours_runs')
      .insert({
        user_id: user.id,
        preset_key: presetKey,
        emotion_detected: emotionState?.emotion || preset.emotionLabel,
        status: 'creating',
        brief: briefData.brief,
        metadata: { 
          emotion_state: emotionState,
          preset: preset 
        }
      })
      .select()
      .single();

    if (runError) {
      console.error('[create] Run creation error:', runError);
      throw runError;
    }

    console.log(`[create] ✅ Run created: ${run.id}`);

    // Créer les segments
    const segmentsToInsert = briefData.segments.map((seg: any, index: number) => ({
      run_id: run.id,
      segment_index: index,
      prompt: seg.prompt,
      status: 'queued',
      metadata: {
        technique: seg.technique,
        target_duration_min: seg.duration_min,
      }
    }));

    const { error: segmentsError } = await supabase
      .from('parcours_segments')
      .insert(segmentsToInsert);

    if (segmentsError) {
      console.error('[create] Segments creation error:', segmentsError);
      throw segmentsError;
    }

    console.log(`[create] ✅ ${segmentsToInsert.length} segments created`);

    return new Response(
      JSON.stringify({
        runId: run.id,
        title: preset.title,
        brief: briefData.brief,
        segmentsCount: briefData.segments.length,
        status: 'creating'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[create] ❌ Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
