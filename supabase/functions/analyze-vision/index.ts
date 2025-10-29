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
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'Image base64 is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const startTime = Date.now();

    // Appel à Lovable AI (Gemini 2.5 Flash) pour analyse vision
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
            role: 'system',
            content: `Tu es un expert en analyse d'expressions faciales. Analyse l'image et retourne UNIQUEMENT un objet JSON avec cette structure exacte:
{
  "label": "joie" | "tristesse" | "colère" | "peur" | "surprise" | "dégoût" | "neutre",
  "scores": {
    "joie": 0.0-1.0,
    "tristesse": 0.0-1.0,
    "colère": 0.0-1.0,
    "peur": 0.0-1.0,
    "surprise": 0.0-1.0,
    "dégoût": 0.0-1.0,
    "neutre": 0.0-1.0
  }
}
Le label doit être l'émotion dominante. Les scores doivent totaliser environ 1.0.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyse cette expression faciale et retourne uniquement le JSON demandé, sans texte supplémentaire.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[analyze-vision] Lovable AI error:', error);
      throw new Error(`Lovable AI error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in response');
    }

    // Parse le JSON de la réponse
    let emotionData;
    try {
      // Extraire le JSON si entouré de texte
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        emotionData = JSON.parse(jsonMatch[0]);
      } else {
        emotionData = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('[analyze-vision] Parse error:', parseError, 'Content:', content);
      throw new Error('Failed to parse emotion data');
    }

    const latency = Date.now() - startTime;
    
    // Calculer la confiance moyenne
    const scores = emotionData.scores as Record<string, number>;
    const scoreValues = Object.values(scores) as number[];
    const maxScore = Math.max(...scoreValues);
    const avgOtherScores = (scoreValues.reduce((a, b) => a + b, 0) - maxScore) / 6;
    const confidence = maxScore - avgOtherScores;

    const result = {
      label: emotionData.label,
      scores: emotionData.scores,
      confidence: Math.max(0, Math.min(1, confidence)),
      timestamp: Date.now(),
      latency_ms: latency
    };

    console.log('[analyze-vision] Success:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[analyze-vision] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
