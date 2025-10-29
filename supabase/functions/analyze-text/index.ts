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
    const { text } = await req.json();
    
    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const startTime = Date.now();

    // Appel à Lovable AI pour analyse de sentiment
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
            content: `Tu es un expert en analyse de sentiment émotionnel. Analyse le texte et retourne UNIQUEMENT un objet JSON avec cette structure exacte:
{
  "label": "joie" | "tristesse" | "colère" | "peur" | "surprise" | "neutre",
  "sentiment": -1.0 to 1.0,
  "confidence": 0.0 to 1.0
}
- sentiment: -1 = très négatif, 0 = neutre, 1 = très positif
- confidence: niveau de certitude de l'analyse`
          },
          {
            role: 'user',
            content: `Analyse ce texte: "${text}"`
          }
        ],
        temperature: 0.3,
        max_tokens: 100
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[analyze-text] Lovable AI error:', error);
      throw new Error(`Lovable AI error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in response');
    }

    // Parse le JSON
    let emotionData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        emotionData = JSON.parse(jsonMatch[0]);
      } else {
        emotionData = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('[analyze-text] Parse error:', parseError, 'Content:', content);
      throw new Error('Failed to parse emotion data');
    }

    const latency = Date.now() - startTime;

    const result = {
      label: emotionData.label,
      sentiment: emotionData.sentiment,
      confidence: emotionData.confidence,
      timestamp: Date.now(),
      latency_ms: latency
    };

    console.log('[analyze-text] Success:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[analyze-text] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
