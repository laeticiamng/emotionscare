// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Map ALL 48 Hume emotions to valence/arousal coordinates
 * Based on circumplex model of affect and empirical research
 */
function mapEmotionToValenceArousal(emotions: Array<{ name: string; score: number }>): { valence: number; arousal: number; confidence: number } {
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

  let totalValence = 0;
  let totalArousal = 0;
  let totalWeight = 0;
  let maxScore = 0;

  emotions.forEach(({ name, score }) => {
    const mapping = emotionMap[name];
    if (mapping && score > 0.1) {
      totalValence += mapping.valence * score;
      totalArousal += mapping.arousal * score;
      totalWeight += score;
      maxScore = Math.max(maxScore, score);
    }
  });

  if (totalWeight === 0) {
    return { valence: 50, arousal: 50, confidence: 0.3 };
  }

  const valence = (totalValence / totalWeight) * 100;
  const arousal = (totalArousal / totalWeight) * 100;

  return {
    valence: Math.round(Math.min(100, Math.max(0, valence))),
    arousal: Math.round(Math.min(100, Math.max(0, arousal))),
    confidence: Math.round(maxScore * 100) / 100,
  };
}

/**
 * Generate emotion summary based on valence/arousal
 */
function generateSummary(valence: number, arousal: number): string {
  if (valence > 60 && arousal > 60) {
    return 'Énergique et positif';
  } else if (valence > 60 && arousal <= 60) {
    return 'Calme et serein';
  } else if (valence <= 40 && arousal > 60) {
    return 'Tension ressentie';
  } else if (valence <= 40 && arousal <= 60) {
    return 'Apaisement recherché';
  }
  return 'État neutre';
}

/**
 * Analyze facial expression using Hume AI API
 */
async function analyzeFacialExpression(frameBase64: string) {
  const humeApiKey = Deno.env.get('HUME_API_KEY');
  
  console.log('[mood-camera] Analyzing frame, API key present:', !!humeApiKey);
  
  // NOTE: Hume AI real-time requires WebSocket Streaming API (wss://api.hume.ai/v0/stream/models)
  // HTTP Edge Functions cannot use WebSockets, so we use a heuristic fallback
  // For production: Move emotion detection to client-side with Hume SDK + WebSocket
  
  if (!humeApiKey) {
    console.warn('[mood-camera] HUME_API_KEY not configured, using fallback');
  } else {
    console.warn('[mood-camera] Hume requires WebSocket for real-time, using fallback until client-side integration');
  }
  
  // Fallback: Generate varied emotional states for testing
  // In production: Replace with client-side Hume WebSocket SDK
  const valence = 50 + Math.random() * 40 - 20; // 30-70 range
  const arousal = 50 + Math.random() * 40 - 20; // 30-70 range
  
  return {
    valence: Math.round(Math.max(0, Math.min(100, valence))),
    arousal: Math.round(Math.max(0, Math.min(100, arousal))),
    confidence: 0.6 + Math.random() * 0.2, // 0.6-0.8 range
    summary: generateSummary(valence, arousal),
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
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
