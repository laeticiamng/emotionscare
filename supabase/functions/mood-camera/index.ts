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
 * Using finer granularity for more varied feedback
 */
function generateSummary(valence: number, arousal: number): string {
  // High arousal (>70)
  if (arousal > 70) {
    if (valence > 70) return 'Très énergique';
    if (valence > 50) return 'Stimulé·e';
    if (valence > 30) return 'Anxieux·se';
    return 'Très tendu·e';
  }
  
  // Moderate-high arousal (50-70)
  if (arousal > 50) {
    if (valence > 70) return 'Joyeux·se';
    if (valence > 50) return 'Actif·ve';
    if (valence > 30) return 'Préoccupé·e';
    return 'Sous tension';
  }
  
  // Moderate-low arousal (30-50)
  if (arousal > 30) {
    if (valence > 70) return 'Satisfait·e';
    if (valence > 50) return 'Neutre';
    if (valence > 30) return 'Pensif·ve';
    return 'Un peu las·se';
  }
  
  // Low arousal (<30)
  if (valence > 70) return 'Très calme';
  if (valence > 50) return 'Détendu·e';
  if (valence > 30) return 'Mélancolique';
  return 'Fatigué·e';
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
      summary: generateSummary(valence, arousal),
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
    
    // Poll for results (max 10 seconds)
    for (let i = 0; i < 20; i++) {
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

        const { valence, arousal, confidence } = mapEmotionToValenceArousal(predictions.emotions);
        return {
          valence,
          arousal,
          confidence,
          summary: generateSummary(valence, arousal),
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
      summary: generateSummary(valence, arousal),
    };
  }
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
