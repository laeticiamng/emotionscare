// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { authenticateRequest } from '../_shared/auth-middleware.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';
import { validateRequest, createErrorResponse, VoiceAnalysisSchema } from '../_shared/validation.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 🔒 SÉCURITÉ: Authentification obligatoire
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200 || !authResult.user) {
      console.warn('[analyze-voice-hume] Unauthorized access attempt');
      return createErrorResponse(authResult.error || 'Authentication required', authResult.status, corsHeaders);
    }

    // 🛡️ SÉCURITÉ: Rate limiting strict (10 req/min - Whisper + Lovable AI)
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'analyze-voice-hume',
      userId: authResult.user.id,
      limit: 10,
      windowMs: 60_000,
      description: 'Voice analysis - OpenAI Whisper + Lovable AI'
    });

    if (!rateLimit.allowed) {
      console.warn('[analyze-voice-hume] Rate limit exceeded', { userId: authResult.user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes vocales. Réessayez dans ${rateLimit.retryAfterSeconds}s.`
      });
    }

    // ✅ VALIDATION: Validation Zod des entrées
    const validation = await validateRequest(req, VoiceAnalysisSchema);
    if (!validation.success) {
      return createErrorResponse(validation.error, validation.status, corsHeaders);
    }

    const { audioBase64 } = validation.data;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const HUME_API_KEY = Deno.env.get('HUME_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.log('[analyze-voice-hume] LOVABLE_API_KEY not configured');
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const startTime = Date.now();

    // Extraire les données audio base64
    let audioData = audioBase64;
    if (audioData.includes(',')) {
      audioData = audioData.split(',')[1];
    }

    // Étape 1: Transcription audio avec Lovable AI
    let transcript = '';
    
    console.log('[analyze-voice-hume] Transcribing audio with Lovable AI');
    
    try {
      const transcriptionResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'system',
              content: 'Tu es un expert en transcription audio. Transcris fidèlement le contenu audio fourni en français. Retourne uniquement le texte transcrit, sans commentaires ni annotations.'
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Transcris cet enregistrement audio en français :'
                },
                {
                  type: 'input_audio',
                  input_audio: {
                    data: audioData,
                    format: 'webm'
                  }
                }
              ]
            }
          ]
        })
      });

      if (transcriptionResponse.ok) {
        const transcriptionData = await transcriptionResponse.json();
        transcript = transcriptionData.choices?.[0]?.message?.content?.trim() || '';
        console.log('[analyze-voice-hume] Transcription:', transcript.substring(0, 100));
      } else {
        console.warn('[analyze-voice-hume] Transcription failed:', await transcriptionResponse.text());
      }
    } catch (e) {
      console.warn('[analyze-voice-hume] Transcription error:', e);
    }

    // Si pas de transcription, retourner un état par défaut
    if (!transcript || transcript.length < 3) {
      console.log('[analyze-voice-hume] No valid transcript, returning neutral state');
      return new Response(
        JSON.stringify({
          emotion: 'neutre',
          valence: 0.5,
          arousal: 0.5,
          confidence: 0.3,
          emotions: { 'neutre': 0.3 },
          transcript: '',
          latency_ms: Date.now() - startTime,
          note: 'Transcription audio non détectée. Veuillez parler plus clairement ou plus longtemps.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[analyze-voice-hume] Using Lovable AI for emotion analysis');
    
    const analysisResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en psychologie et en analyse émotionnelle. Ton rôle est d'analyser le contenu émotionnel d'un texte transcrit à partir d'un enregistrement vocal.

IMPORTANT: Analyse attentivement le CONTENU SÉMANTIQUE du texte, pas seulement les mots.
- Si la personne dit qu'elle est stressée, anxieuse, ou exprime du stress → détecte "anxiété" ou "stress" avec une valence BASSE (0.2-0.35) et arousal ÉLEVÉ (0.65-0.85)
- Si la personne exprime de la tristesse, du mal-être → détecte "tristesse" avec valence TRÈS BASSE (0.1-0.25)
- Si la personne exprime de la joie, du bonheur → détecte "joie" avec valence HAUTE (0.75-0.95)
- Le stress et l'anxiété sont des émotions NÉGATIVES à haute énergie

Ne réponds JAMAIS "neutre" si la personne exprime clairement une émotion. Écoute le sens de ses mots.`
          },
          {
            role: 'user',
            content: `Voici la transcription de ce que la personne a dit: "${transcript}"\n\nAnalyse l'émotion dominante exprimée.`
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'analyze_voice_emotion',
              description: 'Analyse les émotions dans la transcription vocale',
              parameters: {
                type: 'object',
                properties: {
                  emotion: {
                    type: 'string',
                    description: 'Émotion principale détectée',
                    enum: ['joie', 'tristesse', 'colère', 'peur', 'surprise', 'dégoût', 'anxiété', 'stress', 'calme', 'excitation', 'confiance', 'neutre', 'frustration', 'sérénité', 'espoir', 'mélancolie', 'satisfaction', 'inquiétude', 'fatigue', 'ennui', 'nervosité', 'tension']
                  },
                  valence: {
                    type: 'number',
                    description: 'Valence émotionnelle (0=négatif, 1=positif)',
                    minimum: 0,
                    maximum: 1
                  },
                  arousal: {
                    type: 'number',
                    description: 'Niveau d\'activation (0=calme, 1=excité)',
                    minimum: 0,
                    maximum: 1
                  },
                  confidence: {
                    type: 'number',
                    description: 'Niveau de confiance de l\'analyse',
                    minimum: 0,
                    maximum: 1
                  },
                  secondary_emotions: {
                    type: 'object',
                    description: 'Top 3 émotions secondaires avec leurs scores',
                    additionalProperties: {
                      type: 'number',
                      minimum: 0,
                      maximum: 1
                    }
                  }
                },
                required: ['emotion', 'valence', 'arousal', 'confidence', 'secondary_emotions'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'analyze_voice_emotion' } }
      })
    });

    if (!analysisResponse.ok) {
      if (analysisResponse.status === 429) {
        throw new Error('Limite de requêtes Lovable AI atteinte. Veuillez réessayer plus tard.');
      }
      if (analysisResponse.status === 402) {
        throw new Error('Crédits Lovable AI insuffisants. Veuillez recharger votre compte.');
      }
      const error = await analysisResponse.text();
      console.error('[analyze-voice-hume] Lovable AI error:', error);
      throw new Error(`Lovable AI error: ${analysisResponse.status}`);
    }

    const analysisData = await analysisResponse.json();
    const toolCall = analysisData.choices[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error('No tool call in Lovable AI response');
    }

    const analysisResult = JSON.parse(toolCall.function.arguments);
    
    const latencyMs = Date.now() - startTime;

    const result = {
      emotion: analysisResult.emotion,
      valence: analysisResult.valence,
      arousal: analysisResult.arousal,
      confidence: analysisResult.confidence,
      emotions: {
        [analysisResult.emotion]: analysisResult.confidence,
        ...analysisResult.secondary_emotions
      },
      transcript,
      latency_ms: latencyMs
    };

    console.log('[analyze-voice-hume] Success:', JSON.stringify(result));

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[analyze-voice-hume] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Failed to analyze voice'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
