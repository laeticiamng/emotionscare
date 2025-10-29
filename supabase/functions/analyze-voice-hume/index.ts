import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audioBase64 } = await req.json();
    
    if (!audioBase64) {
      return new Response(
        JSON.stringify({ error: 'Audio base64 is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const HUME_API_KEY = Deno.env.get('HUME_API_KEY');
    if (!HUME_API_KEY) {
      console.log('[analyze-voice-hume] HUME_API_KEY not configured, returning mock data');
      // Retourner des données mockées si Hume n'est pas configuré
      const mockResult = {
        emotion: 'calme',
        valence: 0.65,
        arousal: 0.35,
        confidence: 0.78,
        emotions: {
          'calme': 0.78,
          'satisfaction': 0.65,
          'neutre': 0.45
        }
      };
      
      return new Response(
        JSON.stringify(mockResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const startTime = Date.now();

    // Convertir base64 en blob pour Hume AI
    const audioData = audioBase64.replace(/^data:audio\/\w+;base64,/, '');
    
    // Appel à l'API Hume AI Prosody
    const response = await fetch('https://api.hume.ai/v0/batch/jobs', {
      method: 'POST',
      headers: {
        'X-Hume-Api-Key': HUME_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        models: {
          prosody: {}
        },
        transcription: {
          language: "fr"
        },
        files: [{
          data: audioData,
          content_type: "audio/webm"
        }]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[analyze-voice-hume] Hume AI error:', error);
      throw new Error(`Hume AI error: ${response.status}`);
    }

    const data = await response.json();
    const jobId = data.job_id;

    // Polling pour récupérer les résultats
    let result = null;
    let attempts = 0;
    const maxAttempts = 30; // 30 secondes max
    
    while (attempts < maxAttempts) {
      const statusResponse = await fetch(`https://api.hume.ai/v0/batch/jobs/${jobId}`, {
        headers: {
          'X-Hume-Api-Key': HUME_API_KEY,
        }
      });

      if (!statusResponse.ok) {
        throw new Error(`Failed to check job status: ${statusResponse.status}`);
      }

      const statusData = await statusResponse.json();
      
      if (statusData.state === 'COMPLETED') {
        // Récupérer les prédictions
        const predictionsResponse = await fetch(`https://api.hume.ai/v0/batch/jobs/${jobId}/predictions`, {
          headers: {
            'X-Hume-Api-Key': HUME_API_KEY,
          }
        });

        if (!predictionsResponse.ok) {
          throw new Error(`Failed to get predictions: ${predictionsResponse.status}`);
        }

        const predictions = await predictionsResponse.json();
        result = predictions;
        break;
      } else if (statusData.state === 'FAILED') {
        throw new Error('Hume AI job failed');
      }

      // Attendre 1 seconde avant le prochain check
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (!result) {
      throw new Error('Timeout waiting for Hume AI analysis');
    }

    // Extraire les émotions principales de la prosodie
    const prosodyPredictions = result[0]?.results?.predictions[0]?.models?.prosody?.grouped_predictions[0]?.predictions || [];
    
    // Calculer les émotions moyennes sur toute la durée
    const emotionScores: Record<string, number> = {};
    prosodyPredictions.forEach((pred: any) => {
      pred.emotions.forEach((emotion: any) => {
        if (!emotionScores[emotion.name]) {
          emotionScores[emotion.name] = 0;
        }
        emotionScores[emotion.name] += emotion.score;
      });
    });

    // Moyenne des scores
    Object.keys(emotionScores).forEach(key => {
      emotionScores[key] = emotionScores[key] / prosodyPredictions.length;
    });

    // Trouver l'émotion dominante
    let dominantEmotion = 'neutre';
    let maxScore = 0;
    Object.entries(emotionScores).forEach(([emotion, score]) => {
      if (score > maxScore) {
        maxScore = score;
        dominantEmotion = emotion;
      }
    });

    // Mapper vers notre système valence/arousal
    const emotionToValenceArousal: Record<string, { valence: number; arousal: number }> = {
      'joy': { valence: 0.85, arousal: 0.75 },
      'excitement': { valence: 0.8, arousal: 0.85 },
      'pride': { valence: 0.75, arousal: 0.65 },
      'calmness': { valence: 0.7, arousal: 0.25 },
      'contentment': { valence: 0.75, arousal: 0.3 },
      'sadness': { valence: 0.25, arousal: 0.3 },
      'anxiety': { valence: 0.3, arousal: 0.75 },
      'anger': { valence: 0.2, arousal: 0.85 },
      'fear': { valence: 0.25, arousal: 0.8 },
      'surprise': { valence: 0.6, arousal: 0.75 },
      'disgust': { valence: 0.3, arousal: 0.6 },
      'neutral': { valence: 0.5, arousal: 0.5 },
    };

    const mapping = emotionToValenceArousal[dominantEmotion] || { valence: 0.5, arousal: 0.5 };
    
    const latencyMs = Date.now() - startTime;

    const analysisResult = {
      emotion: dominantEmotion,
      valence: mapping.valence,
      arousal: mapping.arousal,
      confidence: maxScore,
      emotions: Object.fromEntries(
        Object.entries(emotionScores)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 5)
      ),
      latency_ms: latencyMs
    };

    console.log('[analyze-voice-hume] Success:', JSON.stringify(analysisResult));

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[analyze-voice-hume] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Failed to analyze voice with Hume AI'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
