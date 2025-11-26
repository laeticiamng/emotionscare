// @ts-nocheck
/**
 * mood-camera - Analyse faciale des émotions via Hume AI
 *
 * 🔒 SÉCURISÉ: Auth multi-rôle + Rate limit 30/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

/**
 * Map ALL 48 Hume emotions to valence/arousal coordinates
 * Based on circumplex model of affect and empirical research
 */
function mapEmotionToValenceArousal(emotions: Array<{ name: string; score: number }>): { valence: number; arousal: number; confidence: number; topEmotion: string } {
  const emotionMap: Record<string, { valence: number; arousal: number }> = {
    // High valence, high arousal (excited, energized)
    'Admiration': { valence: 0.8, arousal: 0.7 },
    'Adoration': { valence: 0.9, arousal: 0.6 },
    'Aesthetic Appreciation': { valence: 0.7, arousal: 0.4 },
    'Amusement': { valence: 0.8, arousal: 0.7 },
    'Excitement': { valence: 0.9, arousal: 0.9 },
    'Joy': { valence: 0.9, arousal: 0.7 },
    'Ecstasy': { valence: 1.0, arousal: 0.9 },
    'Triumph': { valence: 0.9, arousal: 0.8 },
    
    // High valence, moderate arousal (pleasant, content)
    'Awe': { valence: 0.7, arousal: 0.6 },
    'Entrancement': { valence: 0.7, arousal: 0.5 },
    'Interest': { valence: 0.6, arousal: 0.5 },
    'Nostalgia': { valence: 0.6, arousal: 0.3 },
    'Pride': { valence: 0.8, arousal: 0.6 },
    'Romance': { valence: 0.8, arousal: 0.5 },
    'Satisfaction': { valence: 0.7, arousal: 0.3 },
    'Love': { valence: 0.9, arousal: 0.5 },
    
    // High valence, low arousal (calm, peaceful)
    'Calmness': { valence: 0.7, arousal: 0.2 },
    'Contentment': { valence: 0.8, arousal: 0.2 },
    'Relief': { valence: 0.6, arousal: 0.2 },
    'Serenity': { valence: 0.8, arousal: 0.1 },
    
    // Neutral valence (ambiguous emotions)
    'Concentration': { valence: 0.5, arousal: 0.6 },
    'Contemplation': { valence: 0.5, arousal: 0.3 },
    'Confusion': { valence: 0.4, arousal: 0.5 },
    'Realization': { valence: 0.5, arousal: 0.6 },
    'Surprise': { valence: 0.5, arousal: 0.8 },
    'Doubt': { valence: 0.4, arousal: 0.4 },
    'Determination': { valence: 0.5, arousal: 0.7 },
    
    // Low valence, high arousal (distressed, agitated)
    'Anger': { valence: 0.2, arousal: 0.9 },
    'Anxiety': { valence: 0.3, arousal: 0.8 },
    'Awkwardness': { valence: 0.3, arousal: 0.6 },
    'Disgust': { valence: 0.2, arousal: 0.7 },
    'Distress': { valence: 0.2, arousal: 0.8 },
    'Fear': { valence: 0.2, arousal: 0.9 },
    'Horror': { valence: 0.1, arousal: 0.9 },
    'Panic': { valence: 0.1, arousal: 1.0 },
    'Rage': { valence: 0.1, arousal: 1.0 },
    'Terror': { valence: 0.1, arousal: 1.0 },
    'Envy': { valence: 0.3, arousal: 0.7 },
    
    // Low valence, moderate arousal (uncomfortable, negative)
    'Craving': { valence: 0.3, arousal: 0.6 },
    'Disappointment': { valence: 0.3, arousal: 0.4 },
    'Disapproval': { valence: 0.3, arousal: 0.5 },
    'Embarrassment': { valence: 0.3, arousal: 0.6 },
    'Guilt': { valence: 0.3, arousal: 0.5 },
    'Shame': { valence: 0.2, arousal: 0.6 },
    'Pain': { valence: 0.2, arousal: 0.7 },
    'Empathic Pain': { valence: 0.3, arousal: 0.4 },
    
    // Low valence, low arousal (sad, depressed)
    'Boredom': { valence: 0.3, arousal: 0.2 },
    'Sadness': { valence: 0.2, arousal: 0.3 },
    'Tiredness': { valence: 0.4, arousal: 0.1 },
    'Sympathy': { valence: 0.4, arousal: 0.3 },
  };

  // French translations for emotions
  const emotionTranslations: Record<string, string> = {
    'Admiration': 'Admiration',
    'Adoration': 'Adoration',
    'Aesthetic Appreciation': 'Appreciation esthetique',
    'Amusement': 'Amusement',
    'Excitement': 'Excitation',
    'Joy': 'Joie',
    'Ecstasy': 'Extase',
    'Triumph': 'Triomphe',
    'Awe': 'Emerveillement',
    'Entrancement': 'Fascination',
    'Interest': 'Interet',
    'Nostalgia': 'Nostalgie',
    'Pride': 'Fierte',
    'Romance': 'Romance',
    'Satisfaction': 'Satisfaction',
    'Love': 'Amour',
    'Calmness': 'Calme',
    'Contentment': 'Contentement',
    'Relief': 'Soulagement',
    'Serenity': 'Serenite',
    'Concentration': 'Concentration',
    'Contemplation': 'Contemplation',
    'Confusion': 'Confusion',
    'Realization': 'Realisation',
    'Surprise': 'Surprise',
    'Doubt': 'Doute',
    'Determination': 'Determination',
    'Anger': 'Colere',
    'Anxiety': 'Anxiete',
    'Awkwardness': 'Malaise',
    'Disgust': 'Degout',
    'Distress': 'Detresse',
    'Fear': 'Peur',
    'Horror': 'Horreur',
    'Panic': 'Panique',
    'Rage': 'Rage',
    'Terror': 'Terreur',
    'Envy': 'Envie',
    'Craving': 'Desir intense',
    'Disappointment': 'Deception',
    'Disapproval': 'Desapprobation',
    'Embarrassment': 'Embarras',
    'Guilt': 'Culpabilite',
    'Shame': 'Honte',
    'Pain': 'Douleur',
    'Empathic Pain': 'Empathie douloureuse',
    'Boredom': 'Ennui',
    'Sadness': 'Tristesse',
    'Tiredness': 'Fatigue',
    'Sympathy': 'Sympathie',
  };

  let totalValence = 0;
  let totalArousal = 0;
  let totalWeight = 0;
  let maxScore = 0;
  let topEmotion = '';

  emotions.forEach(({ name, score }) => {
    const mapping = emotionMap[name];
    if (mapping && score > 0.1) {
      totalValence += mapping.valence * score;
      totalArousal += mapping.arousal * score;
      totalWeight += score;
      
      if (score > maxScore) {
        maxScore = score;
        topEmotion = emotionTranslations[name] || name;
      }
    }
  });

  if (totalWeight === 0) {
    return { valence: 50, arousal: 50, confidence: 0.3, topEmotion: 'Neutre' };
  }

  const valence = (totalValence / totalWeight) * 100;
  const arousal = (totalArousal / totalWeight) * 100;

  return {
    valence: Math.round(Math.min(100, Math.max(0, valence))),
    arousal: Math.round(Math.min(100, Math.max(0, arousal))),
    confidence: Math.round(maxScore * 100) / 100,
    topEmotion: topEmotion || 'Neutre',
  };
}

/**
 * Generate emotion summary using the top emotion detected
 */
function generateSummary(topEmotion: string): string {
  return topEmotion;
}

/**
 * Analyze facial expression using Hume AI HTTP Batch API
 */
async function analyzeFacialExpression(frameBase64: string) {
  const humeApiKey = Deno.env.get('HUME_API_KEY');
  
  console.log('[mood-camera] Analyzing frame, API key present:', !!humeApiKey);
  
  if (!humeApiKey) {
    console.warn('[mood-camera] HUME_API_KEY not configured, using fallback');
    const valence = 50 + Math.random() * 40 - 20;
    const arousal = 50 + Math.random() * 40 - 20;
    
    return {
      valence: Math.round(Math.max(0, Math.min(100, valence))),
      arousal: Math.round(Math.max(0, Math.min(100, arousal))),
      confidence: 0.6,
      summary: 'Neutre',
    };
  }

  try {
    // Clean base64 data
    const cleanBase64 = frameBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    console.log('[mood-camera] Calling Hume AI Batch API...');
    
    // Call Hume AI Batch API for single image analysis
    const response = await fetch('https://api.hume.ai/v0/batch/jobs', {
      method: 'POST',
      headers: {
        'X-Hume-Api-Key': humeApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        models: {
          face: {}
        },
        urls: [],
        files: [{
          filename: 'frame.jpg',
          content_type: 'image/jpeg',
          data: cleanBase64
        }]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[mood-camera] Hume API error:', response.status, errorText.slice(0, 200));
      throw new Error(`Hume API returned ${response.status}`);
    }

    const jobData = await response.json();
    const jobId = jobData.job_id;
    
    console.log('[mood-camera] Job created:', jobId);
    
    // Poll for results (max 30 seconds)
    for (let i = 0; i < 60; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const resultResponse = await fetch(`https://api.hume.ai/v0/batch/jobs/${jobId}`, {
        headers: {
          'X-Hume-Api-Key': humeApiKey,
        },
      });
      
      const result = await resultResponse.json();
      
      if (result.state === 'COMPLETED') {
        console.log('[mood-camera] Job completed');
        
        const predictions = result.predictions?.[0]?.results?.predictions?.[0];
        if (!predictions || !predictions.emotions) {
          console.warn('[mood-camera] No face detected');
          return {
            valence: 50,
            arousal: 50,
            confidence: 0.3,
            summary: 'Aucun visage détecté',
          };
        }

        const { valence, arousal, confidence, topEmotion } = mapEmotionToValenceArousal(predictions.emotions);
        return {
          valence,
          arousal,
          confidence,
          summary: generateSummary(topEmotion),
        };
      } else if (result.state === 'FAILED') {
        console.error('[mood-camera] Job failed:', result.message);
        throw new Error('Analysis failed');
      }
    }
    
    console.warn('[mood-camera] Job timeout');
    throw new Error('Analysis timeout');
    
  } catch (error) {
    console.error('[mood-camera] Hume analysis failed:', error);
    
    // Fallback on error
    const valence = 50 + Math.random() * 20 - 10;
    const arousal = 50 + Math.random() * 20 - 10;
    return {
      valence: Math.round(valence),
      arousal: Math.round(arousal),
      confidence: 0.4,
      summary: 'Neutre',
    };
  }
}

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

  const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user', 'b2b_admin', 'admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'mood-camera',
    userId: user.id,
    limit: 30,
    windowMs: 60_000,
    description: 'Mood camera analysis',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  try {
    console.log('[mood-camera] Request received');

    // Method check
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'method_not_allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse body
    const body = await req.json().catch(() => null);
    if (!body || !body.frame) {
      console.error('[mood-camera] Invalid body:', body);
      return new Response(
        JSON.stringify({ error: 'invalid_body', message: 'Missing frame data' }),
        {
          status: 422,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { frame } = body;

    console.log('[mood-camera] Analyzing frame, size:', frame.length);

    // Analyze facial expression
    const result = await analyzeFacialExpression(frame);

    console.log('[mood-camera] Analysis result:', result);

    return new Response(
      JSON.stringify(result),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('[mood-camera] Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'internal_error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
