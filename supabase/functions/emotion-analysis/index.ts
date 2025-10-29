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
    const { text, language = 'fr' } = await req.json();
    
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Text is required and must be non-empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.log('[emotion-analysis] OPENAI_API_KEY not configured, returning mock data');
      
      // Mock data fallback
      const mockResult = {
        emotion: 'neutre',
        valence: 0.5,
        arousal: 0.5,
        confidence: 0.65,
        summary: 'État émotionnel neutre détecté dans votre texte.',
        emotions: {
          'neutre': 0.65,
          'calme': 0.25,
          'pensif': 0.10
        }
      };
      
      return new Response(
        JSON.stringify(mockResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const startTime = Date.now();

    // Call OpenAI API for emotion analysis
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en analyse émotionnelle. Analyse le texte fourni et identifie les émotions présentes. 
            
Réponds UNIQUEMENT avec un objet JSON valide au format suivant (sans markdown, sans backticks):
{
  "emotion": "emotion_principale",
  "valence": 0.0-1.0,
  "arousal": 0.0-1.0,
  "confidence": 0.0-1.0,
  "summary": "résumé court",
  "emotions": {
    "emotion1": score,
    "emotion2": score,
    "emotion3": score
  }
}

Valence: 0 = négatif, 1 = positif
Arousal: 0 = calme, 1 = excité
Confidence: niveau de certitude de l'analyse

Émotions possibles: joie, tristesse, colère, peur, surprise, dégoût, anxiété, calme, excitation, confiance, neutre, frustration, sérénité, espoir, mélancolie`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[emotion-analysis] OpenAI error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    // Parse JSON response
    let analysisResult;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysisResult = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('[emotion-analysis] JSON parse error:', parseError, 'Content:', content);
      throw new Error('Failed to parse OpenAI response as JSON');
    }

    // Validate result structure
    if (!analysisResult.emotion || typeof analysisResult.valence !== 'number') {
      throw new Error('Invalid analysis result structure');
    }

    const latencyMs = Date.now() - startTime;

    const result = {
      emotion: analysisResult.emotion,
      valence: Math.max(0, Math.min(1, analysisResult.valence)),
      arousal: Math.max(0, Math.min(1, analysisResult.arousal || 0.5)),
      confidence: Math.max(0, Math.min(1, analysisResult.confidence || 0.7)),
      summary: analysisResult.summary || `Émotion ${analysisResult.emotion} détectée`,
      emotions: analysisResult.emotions || {},
      latency_ms: latencyMs
    };

    console.log('[emotion-analysis] Success:', JSON.stringify(result));

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[emotion-analysis] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Failed to analyze text emotions'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
