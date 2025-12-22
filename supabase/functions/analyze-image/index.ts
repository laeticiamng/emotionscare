// @ts-nocheck
// Migrated to Lovable AI Gateway with Gemini Vision
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
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const { image, fileName, mimeType } = await req.json();

    if (!image) {
      throw new Error('No image provided');
    }

    console.log(`[analyze-image] Analyzing: ${fileName}, type: ${mimeType}`);

    // Extract base64 data
    const base64Data = image.includes('base64,')
      ? image.split('base64,')[1]
      : image;

    // Use Gemini Vision via Lovable AI Gateway
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyse cette image dans le contexte d'une entrée de journal émotionnel.
Identifie:
1. Les émotions visibles (expressions faciales, langage corporel, ambiance générale)
2. L'humeur générale (positive, neutral, negative, calm, energetic, etc.)
3. Une description courte de ce que tu vois
4. Des tags pertinents pour le contexte émotionnel`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType || 'image/jpeg'};base64,${base64Data}`
                }
              }
            ]
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'analyze_image_emotions',
              description: 'Retourne l\'analyse émotionnelle de l\'image',
              parameters: {
                type: 'object',
                properties: {
                  emotions: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Liste des émotions détectées'
                  },
                  mood: { type: 'string', description: 'Humeur générale' },
                  sentiment: { type: 'string', enum: ['positive', 'neutral', 'negative'] },
                  description: { type: 'string', description: 'Description courte en français' },
                  tags: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Tags pertinents'
                  },
                  confidence: { type: 'number', minimum: 0, maximum: 1 },
                  therapeutic_insights: { type: 'string', description: 'Insight pour le bien-être émotionnel' }
                },
                required: ['emotions', 'mood', 'sentiment', 'description', 'tags', 'confidence'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'analyze_image_emotions' } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ success: false, error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ success: false, error: 'Payment required' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      const errorText = await response.text();
      console.error('[analyze-image] AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    let analysis;
    if (toolCall) {
      try {
        analysis = JSON.parse(toolCall.function.arguments);
      } catch {
        analysis = {
          emotions: [],
          mood: 'neutral',
          sentiment: 'neutral',
          description: 'Analyse non disponible',
          tags: [],
          confidence: 0.5,
          therapeutic_insights: ''
        };
      }
    } else {
      analysis = {
        emotions: [],
        mood: 'neutral',
        sentiment: 'neutral',
        description: 'Analyse non disponible',
        tags: [],
        confidence: 0.5,
        therapeutic_insights: ''
      };
    }

    console.log('[analyze-image] Success:', {
      emotions: analysis.emotions?.length || 0,
      mood: analysis.mood,
      confidence: analysis.confidence
    });

    return new Response(JSON.stringify({
      success: true,
      emotions: analysis.emotions || [],
      mood: analysis.mood || 'neutral',
      sentiment: analysis.sentiment || 'neutral',
      description: analysis.description || '',
      tags: analysis.tags || [],
      confidence: analysis.confidence || 0.7,
      therapeutic_insights: analysis.therapeutic_insights || '',
      face_detection: {
        faces_detected: (analysis.emotions?.length || 0) > 0,
        count: analysis.emotions?.length || 0
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[analyze-image] Error:', error);
    const err = error as Error;
    return new Response(JSON.stringify({
      success: false,
      error: err.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
