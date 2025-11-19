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
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const { image, fileName, mimeType } = await req.json();

    if (!image) {
      throw new Error('No image provided');
    }

    console.log(`Analyzing image: ${fileName}, type: ${mimeType}`);

    // Extraer la parte base64 de la imagen (remover el prefijo data:image/...;base64,)
    const base64Data = image.includes('base64,')
      ? image.split('base64,')[1]
      : image;

    // Llamar a GPT-4 Vision API
    const visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Tu es un assistant spécialisé en analyse émotionnelle d'images pour un journal thérapeutique.
Analyse l'image et identifie:
1. Les émotions visibles (expressions faciales, langage corporel, ambiance générale)
2. L'humeur générale (positive, neutral, negative, calm, energetic, etc.)
3. Une description courte de ce que tu vois
4. Des tags pertinents pour le contexte émotionnel

Réponds en JSON avec cette structure exacte:
{
  "emotions": ["string array of detected emotions"],
  "mood": "string - overall mood",
  "sentiment": "positive|neutral|negative",
  "description": "string - brief description in French",
  "tags": ["string array of relevant tags"],
  "confidence": "number 0-1 - confidence score",
  "therapeutic_insights": "string - brief insight for emotional wellbeing"
}`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyse cette image dans le contexte d\'une entrée de journal émotionnel.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType || 'image/jpeg'};base64,${base64Data}`,
                  detail: 'auto'
                }
              }
            ]
          }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!visionResponse.ok) {
      const errorText = await visionResponse.text();
      console.error('GPT-4 Vision API error:', errorText);
      throw new Error(`GPT-4 Vision API error: ${visionResponse.status} - ${errorText}`);
    }

    const visionResult = await visionResponse.json();
    const analysis = JSON.parse(visionResult.choices[0].message.content);

    console.log('Image analysis successful:', {
      emotions: analysis.emotions?.length || 0,
      mood: analysis.mood,
      confidence: analysis.confidence
    });

    // Détection faciale supplémentaire (optionnel)
    let faceDetection = null;
    try {
      // On pourrait intégrer une API de détection faciale ici
      // Pour l'instant, on se base uniquement sur GPT-4 Vision
      faceDetection = {
        faces_detected: analysis.emotions?.length > 0,
        count: analysis.emotions?.length || 0
      };
    } catch (faceError) {
      console.error('Face detection failed:', faceError);
    }

    return new Response(JSON.stringify({
      success: true,
      emotions: analysis.emotions || [],
      mood: analysis.mood || 'neutral',
      sentiment: analysis.sentiment || 'neutral',
      description: analysis.description || '',
      tags: analysis.tags || [],
      confidence: analysis.confidence || 0.7,
      therapeutic_insights: analysis.therapeutic_insights || '',
      face_detection: faceDetection,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-image function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
