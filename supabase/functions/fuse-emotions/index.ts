import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmotionInput {
  voice?: {
    emotions: Record<string, number>;
    confidence: number;
    timestamp: number;
  };
  vision?: {
    scores: Record<string, number>;
    confidence: number;
    timestamp: number;
  };
  text?: {
    label: string;
    sentiment: number;
    confidence: number;
    timestamp: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const input: EmotionInput = await req.json();
    const startTime = Date.now();

    // Pondération dynamique basée sur la confiance et la fraîcheur des données
    const now = Date.now();
    const maxAge = 2000; // 2 secondes max

    let voiceWeight = 0.5;
    let visionWeight = 0.35;
    let textWeight = 0.15;

    // Ajuster les poids selon la disponibilité et la fraîcheur
    const voiceValid = input.voice && (now - input.voice.timestamp) < maxAge;
    const visionValid = input.vision && (now - input.vision.timestamp) < maxAge;
    const textValid = input.text && (now - input.text.timestamp) < maxAge;

    if (!voiceValid) voiceWeight = 0;
    if (!visionValid) visionWeight = 0;
    if (!textValid) textWeight = 0;

    // Redistribuer les poids
    const totalWeight = voiceWeight + visionWeight + textWeight;
    if (totalWeight > 0) {
      voiceWeight /= totalWeight;
      visionWeight /= totalWeight;
      textWeight /= totalWeight;
    }

    // Fusion des émotions
    const emotionScores: Record<string, number> = {
      joie: 0,
      tristesse: 0,
      colère: 0,
      peur: 0,
      surprise: 0,
      dégoût: 0,
      neutre: 0
    };

    // Ajouter les scores de la voix
    if (voiceValid && input.voice) {
      for (const [emotion, score] of Object.entries(input.voice.emotions)) {
        if (emotion in emotionScores) {
          emotionScores[emotion] += score * voiceWeight * input.voice.confidence;
        }
      }
    }

    // Ajouter les scores de la vision
    if (visionValid && input.vision) {
      for (const [emotion, score] of Object.entries(input.vision.scores)) {
        if (emotion in emotionScores) {
          emotionScores[emotion] += score * visionWeight * input.vision.confidence;
        }
      }
    }

    // Ajouter le score du texte (convertir sentiment en émotions)
    if (textValid && input.text) {
      const sentiment = input.text.sentiment;
      const textConf = input.text.confidence * textWeight;
      
      if (sentiment > 0.3) {
        emotionScores.joie += sentiment * textConf;
      } else if (sentiment < -0.3) {
        emotionScores.tristesse += Math.abs(sentiment) * textConf;
      } else {
        emotionScores.neutre += textConf;
      }
    }

    // Trouver l'émotion dominante
    let dominantEmotion = 'neutre';
    let maxScore = 0;
    for (const [emotion, score] of Object.entries(emotionScores)) {
      if (score > maxScore) {
        maxScore = score;
        dominantEmotion = emotion;
      }
    }

    // Calculer l'indice d'humeur (0-100)
    // Positif: joie, surprise
    // Négatif: tristesse, colère, peur, dégoût
    // Neutre: neutre
    const positiveScore = (emotionScores.joie + emotionScores.surprise * 0.5) * 100;
    const negativeScore = (emotionScores.tristesse + emotionScores.colère + emotionScores.peur + emotionScores.dégoût) * 100;
    const neutralScore = emotionScores.neutre * 50;

    const moodIndex = Math.round(
      Math.max(0, Math.min(100, positiveScore - negativeScore + neutralScore + 50))
    );

    const latency = Date.now() - startTime;

    const result = {
      mood_index: moodIndex,
      label: dominantEmotion,
      emotion_scores: emotionScores,
      confidences: {
        voice: voiceValid ? input.voice!.confidence : 0,
        vision: visionValid ? input.vision!.confidence : 0,
        text: textValid ? input.text!.confidence : 0
      },
      weights: {
        voice: voiceWeight,
        vision: visionWeight,
        text: textWeight
      },
      timestamp: Date.now(),
      latency_ms: latency
    };

    console.log('[fuse-emotions] Result:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[fuse-emotions] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
